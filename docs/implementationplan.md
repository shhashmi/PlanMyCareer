# Detailed Implementation Plan: Stateless Social Authentication with JWT

This document provides a step-by-step guide for implementing a secure and scalable social authentication system using Node.js/Express for the backend and React for the frontend.

**Core Principles:**
- **Stateless (No DB):** User information is not stored in a database. The user's identity is fully encapsulated within a JWT.
- **OAuth 2.0:** Authentication is delegated to trusted OAuth providers (Google, GitHub, LinkedIn).
- **JWTs (JSON Web Tokens):** A JWT is generated after successful OAuth authentication, containing the user's profile information.
- **`httpOnly` Cookies:** The JWT is stored in a secure, `httpOnly` cookie to prevent XSS attacks and automatically handle authentication for subsequent requests.

---

## 1. Environment Setup & Configuration

Create a `.env` file in your Node.js project root. Store all secrets and configuration here. **Never commit this file to version control.**

```bash
# --- Server Configuration ---
NODE_ENV=development
PORT=8080
FRONTEND_URL=http://localhost:3000

# --- JWT Configuration ---
JWT_SECRET=your-super-strong-and-long-secret-key # Use a 32+ character random string
JWT_EXPIRATION=7d

# --- Cookie Configuration ---
COOKIE_SECRET=your-super-strong-cookie-secret # Different from JWT secret
COOKIE_NAME=auth_token

# --- Google OAuth Credentials ---
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# --- GitHub OAuth Credentials ---
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# --- LinkedIn OAuth Credentials ---
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

---

## 2. Backend Implementation (Node.js & Express)

We will use `Passport.js` to abstract the OAuth flows.

### 2.1. Dependencies

```bash
npm install express express-session passport passport-google-oauth20 passport-github2 passport-linkedin-oauth2 jsonwebtoken cookie-parser cors dotenv
```

### 2.2. Project Structure

```
/backend
├── src/
│   ├── config/
│   │   └── passport-setup.js   # Passport.js strategy configuration
│   ├── controllers/
│   │   └── auth.controller.js  # Logic for login, callback, logout
│   ├── middleware/
│   │   └── auth.middleware.js    # Middleware to protect routes
│   ├── routes/
│   │   └── auth.routes.js        # All authentication-related routes
│   └── server.js               # Main Express server setup
├── .env
└── package.json
```

### 2.3. Passport.js Configuration (`src/config/passport-setup.js`)

This file configures the "strategies" for each OAuth provider.

```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

// Passport needs to serialize and deserialize users to support sessions.
// Since we are stateless, we'll just pass the user profile through.
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
    scope: ['profile', 'email']
  },
  (accessToken, refreshToken, profile, done) => {
    // We are not saving the user to the DB.
    // The profile object contains all the user info we need.
    return done(null, profile);
  }
));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/auth/github/callback",
    scope: ['read:user', 'user:email']
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

// LinkedIn Strategy
passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: "/api/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile']
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));
```

### 2.4. Authentication Routes (`src/routes/auth.routes.js`)

```javascript
const router = require('express').Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// 1. Routes to initiate OAuth flow
router.get('/google', passport.authenticate('google'));
router.get('/github', passport.authenticate('github'));
router.get('/linkedin', passport.authenticate('linkedin'));

// 2. Callback routes that providers redirect to
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login-failed' }), authController.handleCallback);
router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/login-failed' }), authController.handleCallback);
router.get('/linkedin/callback', passport.authenticate('linkedin', { session: false, failureRedirect: '/login-failed' }), authController.handleCallback);

// 3. Route to verify user's auth status
router.get('/me', authMiddleware.verifyToken, authController.getMe);

// 4. Logout route
router.post('/logout', authController.logout);

// 5. Failure route
router.get('/login-failed', authController.loginFailed);

module.exports = router;
```

### 2.5. Authentication Controller (`src/controllers/auth.controller.js`)

This is where the JWT is created and the cookie is set.

```javascript
const jwt = require('jsonwebtoken');

// This function is called after Passport successfully authenticates the user.
exports.handleCallback = (req, res) => {
  // 1. Extract relevant user info from the profile object
  const userProfile = {
    id: req.user.id,
    displayName: req.user.displayName,
    email: req.user.emails ? req.user.emails[0].value : null,
    provider: req.user.provider,
    photo: req.user.photos ? req.user.photos[0].value : null
  };

  // 2. Create the JWT
  const token = jwt.sign(userProfile, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  // 3. Set the JWT in a secure, httpOnly cookie
  res.cookie(process.env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'lax', // Mitigates CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days, should match JWT expiration
  });

  // 4. Redirect user back to the frontend application
  res.redirect(process.env.FRONTEND_URL);
};

// Controller to get the current user's data from the JWT
exports.getMe = (req, res) => {
  // The user object is attached to the request by the verifyToken middleware
  res.status(200).json(req.user);
};

// Controller for logging out
exports.logout = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.status(200).json({ message: 'Successfully logged out.' });
};

// Controller for login failure
exports.loginFailed = (req, res) => {
    res.status(401).json({ message: 'Authentication failed.' });
};
```

### 2.6. Verification Middleware (`src/middleware/auth.middleware.js`)

This middleware protects your API routes. It reads the JWT from the cookie and verifies it.

```javascript
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.cookies[process.env.COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user payload to the request
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Unauthorized: Token has expired.' });
    }
    return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
  }
};
```

### 2.7. Main Server File (`src/server.js`)

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
require('./config/passport-setup'); // Import passport configuration

const app = express();

// --- Middleware ---
app.use(cors({
  origin: process.env.FRONTEND_URL, // Allow requests from your React app
  credentials: true, // Allow cookies to be sent
}));
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

// --- Routes ---
app.use('/api/auth', authRoutes);

// Example of a protected route
// app.use('/api/protected', authMiddleware.verifyToken, protectedRoutes);

// --- Start Server ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## 3. Frontend Implementation (React)

### 3.1. Dependencies

We'll use `axios` for API calls.

```bash
npm install axios
```

### 3.2. Project Structure

```
/frontend
├── src/
│   ├── components/
│   │   ├── LoginPage.js
│   │   └── ProtectedRoute.js
│   ├── context/
│   │   └── AuthContext.js      # Manages global auth state
│   ├── hooks/
│   │   └── useAuth.js          # Easy access to AuthContext
│   └── App.js
└── package.json
```

### 3.3. Auth Context (`src/context/AuthContext.js`)

This context will provide authentication state and functions to the entire app.

```jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      // Axios will automatically include the httpOnly cookie
      const response = await axios.get(`${API_URL}/me`, { withCredentials: true });
      setUser(response.data);
    } catch (error) {
      setUser(null);
      console.error('Failed to fetch user', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = (provider) => {
    // Redirect to the backend OAuth route
    window.location.href = `${API_URL}/${provider}`;
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 3.4. Login Page (`src/components/LoginPage.js`)

```jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth'; // Custom hook to access context

const LoginPage = () => {
  const { login } = useAuth();

  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => login('google')}>Login with Google</button>
      <button onClick={() => login('github')}>Login with GitHub</button>
      <button onClick={() => login('linkedin')}>Login with LinkedIn</button>
    </div>
  );
};

export default LoginPage;
```

### 3.5. Protected Route Component (`src/components/ProtectedRoute.js`)

This component ensures only authenticated users can access certain routes.

```jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
```

### 3.6. App Router Setup (`src/App.js`)

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './components/HomePage'; // Example home page
import Dashboard from './components/Dashboard'; // Example protected page

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Add other protected routes here */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

---

## 4. Security & Scalability Checklist

-   **[✓] Strong Secrets:** Use long, random strings for `JWT_SECRET` and `COOKIE_SECRET`. Store them securely as environment variables.
-   **[✓] `httpOnly` Cookies:** Prevents client-side scripts from accessing the JWT, mitigating XSS.
-   **[✓] `secure` & `SameSite` Flags:** Ensure cookies are sent only over HTTPS in production and protect against CSRF.
-   **[✓] CORS Policy:** The backend is configured to only accept requests from the frontend's domain.
-   **[✓] State Parameter:** `Passport.js` handles the `state` parameter automatically, preventing CSRF during the OAuth handshake.
-   **[✓] Stateless Architecture:** The backend does not store session state, making it easy to scale horizontally by simply adding more instances.
-   **[✓] Token Expiration:** JWTs have a defined lifetime, forcing re-authentication after a set period.
-   **[ ] Rate Limiting:** (Recommended) Add a library like `express-rate-limit` to your backend to prevent brute-force attacks on authentication endpoints.
-   **[ ] Input Validation:** (Recommended) Use a library like `Joi` or `Zod` to validate any request bodies or parameters.

This plan provides a robust foundation for a secure, scalable, and stateless authentication system.
