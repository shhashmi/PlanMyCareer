# OAuth Social Login - Sequence Diagrams

## Understanding the Actors:
- **Browser**: The web browser application (Chrome, Firefox) handling HTTP requests and redirects
- **Frontend**: Your React application code running inside the browser
- **Backend**: Your API server on AWS App Runner
- **OAuth Provider**: Google/LinkedIn/GitHub authentication service

**Key Point**: OAuth redirects are browser-level (302/303 HTTP redirects) that happen outside your React app's control. Your Frontend code initiates them but doesn't handle the redirect responses - the browser does.

---

## 1. Complete OAuth Flow (Google/LinkedIn/GitHub)

```
┌─────────┐          ┌──────────┐          ┌────────────────┐          ┌──────────────┐
│ Browser │          │ Frontend │          │ Backend (AWS)  │          │ OAuth Provider│
│ (Chrome/│          │ (React   │          │  App Runner    │          │ (Google/etc) │
│ Firefox)│          │   App)   │          │                │          │              │
└────┬────┘          └────┬─────┘          └───────┬────────┘          └──────┬───────┘
     │                    │                        │                          │
     │  1. Click "Login   │                        │                          │
     │   with Google"     │                        │                          │
     ├───────────────────>│                        │                          │
     │                    │                        │                          │
     │                    │ 2. Frontend initiates OAuth                       │
     │                    │    window.location.href = 'backend.com/api/auth/google'
     │                    │                        │                          │
     │  ════════════════════════════════════════════════════════════════════  │
     │  Browser now takes over - React is no longer involved in redirects    │
     │  ════════════════════════════════════════════════════════════════════  │
     │                    │                        │                          │
     │  3. Browser navigates to backend                                       │
     │     GET https://backend.com/api/auth/google │                          │
     ├────────────────────────────────────────────>│                          │
     │                    │                        │                          │
     │                    │                        │ 4. Generate state token  │
     │                    │                        │    Store in session      │
     │                    │                        │                          │
     │                    │                        │ 5. Return HTTP 302       │
     │                    │                        │    Redirect response     │
     │  6. Backend sends redirect                  │    Location: Google.com  │
     │     HTTP 302 to OAuth provider              │    with OAuth params     │
     │<────────────────────────────────────────────┤                          │
     │  Location: accounts.google.com/oauth?       │                          │
     │    client_id=xxx&redirect_uri=xxx&state=xxx │                          │
     │                    │                        │                          │
     │  7. Browser auto-follows redirect (not React)                          │
     │     GET https://accounts.google.com/oauth/authorize?...                │
     │────────────────────────────────────────────────────────────────────────>│
     │                    │                        │                          │
     │                    │                        │                          │
     │  8. OAuth provider shows consent screen    │                          │
     │     User logs in and grants permissions    │                          │
     │<───────────────────────────────────────────────────────────────────────>│
     │                    │                        │                          │
     │  9. OAuth Provider redirects browser with authorization code           │
     │     HTTP 302: Location: backend.com/api/auth/google/callback?code=xxx  │
     │<────────────────────────────────────────────────────────────────────────┤
     │                    │                        │                          │
     │  10. Browser follows redirect to backend    │                          │
     │      GET backend.com/api/auth/google/callback?code=xxx&state=xxx       │
     ├────────────────────────────────────────────>│                          │
     │                    │                        │                          │
     │                    │                        │ 11. Validate state token │
     │                    │                        │     (CSRF protection)    │
     │                    │                        │                          │
     │                    │                        │ 12. Exchange code for    │
     │                    │                        │     access token         │
     │                    │                        ├─────────────────────────>│
     │                    │                        │  POST /token             │
     │                    │                        │  code, client_id, secret │
     │                    │                        │                          │
     │                    │                        │ 13. Return access token  │
     │                    │                        │<─────────────────────────┤
     │                    │                        │     {access_token: "xxx"}│
     │                    │                        │                          │
     │                    │                        │ 14. Fetch user profile   │
     │                    │                        ├─────────────────────────>│
     │                    │                        │  GET /userinfo           │
     │                    │                        │  Authorization: Bearer   │
     │                    │                        │                          │
     │                    │                        │ 15. Return user data     │
     │                    │                        │<─────────────────────────┤
     │                    │                        │  {email, name, id, pic}  │
     │                    │                        │                          │
     │                    │                        │ 16. Upsert user in DB    │
     │                    │                        │     - If exists: update  │
     │                    │                        │     - If new: create     │
     │                    │                        │                          │
     │                    │                        │ 17. Generate JWT token   │
     │                    │                        │     signed with secret   │
     │                    │                        │                          │
     │  18. Backend redirects browser to frontend callback with JWT           │
     │      HTTP 302: Location: yourapp.com/auth/callback?token=jwt_token     │
     │<─────────────────────────────────────────────┤                          │
     │                    │                        │                          │
     │  19. Browser navigates to yourapp.com/auth/callback?token=xxx          │
     │                    │                        │                          │
     │  ════════════════════════════════════════════════════════════════════  │
     │  React app now loads and takes over                                    │
     │  ════════════════════════════════════════════════════════════════════  │
     │                    │                        │                          │
     ├───────────────────>│ 20. OAuthCallback.tsx  │                          │
     │                    │     component loads    │                          │
     │                    │                        │                          │
     │                    │ 21. Extract JWT from   │                          │
     │                    │     URL params         │                          │
     │                    │     const token =      │                          │
     │                    │     params.get('token')│                          │
     │                    │                        │                          │
     │                    │ 22. Store JWT in       │                          │
     │                    │     localStorage       │                          │
     │                    │     .setItem('jwt')    │                          │
     │                    │                        │                          │
     │                    │ 23. Fetch user profile │                          │
     │                    │     (Frontend->Backend)│                          │
     │                    │     fetch('/api/auth/me', {                       │
     │                    │       Authorization:   │                          │
     │                    │       Bearer jwt       │                          │
     │                    │     })                 │                          │
     │                    ├───────────────────────>│                          │
     │                    │                        │                          │
     │                    │                        │ 24. Validate JWT         │
     │                    │                        │     Verify signature     │
     │                    │                        │     Extract user_id      │
     │                    │                        │     Query database       │
     │                    │                        │                          │
     │                    │ 25. Return user data   │                          │
     │                    │<───────────────────────┤                          │
     │                    │  {id, name, email,     │                          │
     │                    │   provider, picture}   │                          │
     │                    │                        │                          │
     │                    │ 26. Update AppContext  │                          │
     │                    │     login(userData)    │                          │
     │                    │     setIsLoggedIn(true)│                          │
     │                    │                        │                          │
     │                    │ 27. Navigate to        │                          │
     │                    │     /assessment        │                          │
     │                    │     navigate('/assessment')                       │
     │                    │                        │                          │
     │  28. Render Assessment page                 │                          │
     │<───────────────────┤                        │                          │
     │                    │                        │                          │
```

---

## 2. Subsequent API Requests (After Login)

```
┌─────────┐          ┌──────────┐          ┌────────────────┐
│ Browser │          │ Frontend │          │ Backend (AWS)  │
│  (User) │          │ (React)  │          │  App Runner    │
└────┬────┘          └────┬─────┘          └───────┬────────┘
     │                    │                        │
     │  1. User navigates │                        │
     │     or takes action│                        │
     ├───────────────────>│                        │
     │                    │                        │
     │                    │ 2. Make API request    │
     │                    │    with JWT            │
     │                    ├───────────────────────>│
     │                    │  Authorization:        │
     │                    │  Bearer jwt_token      │
     │                    │                        │
     │                    │                        │ 3. Validate JWT
     │                    │                        │    - Check signature
     │                    │                        │    - Check expiration
     │                    │                        │    - Extract user_id
     │                    │                        │
     │                    │ 4. Return data         │
     │                    │<───────────────────────┤
     │                    │                        │
     │  5. Update UI      │                        │
     │<───────────────────┤                        │
     │                    │                        │
```

---

## 3. Token Expiration & Refresh Flow

```
┌─────────┐          ┌──────────┐          ┌────────────────┐
│ Browser │          │ Frontend │          │ Backend (AWS)  │
│  (User) │          │ (React)  │          │  App Runner    │
└────┬────┘          └────┬─────┘          └───────┬────────┘
     │                    │                        │
     │  1. API Request    │                        │
     ├───────────────────>│                        │
     │                    │                        │
     │                    │ 2. API call with       │
     │                    │    expired JWT         │
     │                    ├───────────────────────>│
     │                    │  Authorization:        │
     │                    │  Bearer expired_jwt    │
     │                    │                        │
     │                    │                        │ 3. Validate JWT
     │                    │                        │    JWT expired!
     │                    │                        │
     │                    │ 4. Return 401          │
     │                    │<───────────────────────┤
     │                    │  Unauthorized          │
     │                    │                        │
     │                    │ 5. Clear localStorage  │
     │                    │    Clear AppContext    │
     │                    │                        │
     │                    │ 6. Redirect to /login  │
     │                    │                        │
     │  7. Show login page│                        │
     │<───────────────────┤                        │
     │                    │                        │
```

---

## 4. Logout Flow

```
┌─────────┐          ┌──────────┐          ┌────────────────┐
│ Browser │          │ Frontend │          │ Backend (AWS)  │
│  (User) │          │ (React)  │          │  App Runner    │
└────┬────┘          └────┬─────┘          └───────┬────────┘
     │                    │                        │
     │  1. Click Logout   │                        │
     ├───────────────────>│                        │
     │                    │                        │
     │                    │ 2. Optional: Notify    │
     │                    │    backend of logout   │
     │                    ├───────────────────────>│
     │                    │  POST /api/auth/logout │
     │                    │  Bearer: jwt_token     │
     │                    │                        │
     │                    │                        │ 3. Invalidate token
     │                    │                        │    (if using blacklist)
     │                    │                        │
     │                    │ 4. Return success      │
     │                    │<───────────────────────┤
     │                    │                        │
     │                    │ 5. Clear JWT from      │
     │                    │    localStorage        │
     │                    │                        │
     │                    │ 6. Clear AppContext    │
     │                    │    setUser(null)       │
     │                    │    setIsLoggedIn(false)│
     │                    │                        │
     │                    │ 7. Navigate to /       │
     │                    │    or /login           │
     │                    │                        │
     │  8. Show home/login│                        │
     │<───────────────────┤                        │
     │                    │                        │
```

---

## 5. Error Handling Flow

```
┌─────────┐          ┌──────────┐          ┌────────────────┐          ┌──────────────┐
│ Browser │          │ Frontend │          │ Backend (AWS)  │          │ OAuth Provider│
└────┬────┘          └────┬─────┘          └───────┬────────┘          └──────┬───────┘
     │                    │                        │                          │
     │  Scenario A: User denies permission         │                          │
     │  ────────────────────────────────────────────────────────────────────  │
     │                    │                        │                          │
     │  User clicks       │                        │                          │
     │  "Deny" on OAuth   │                        │                          │
     │  consent screen    │                        │                          │
     ├────────────────────────────────────────────────────────────────────────>│
     │                    │                        │                          │
     │  Redirect with error                        │                          │
     │  /callback?error=access_denied              │                          │
     │<────────────────────────────────────────────────────────────────────────┤
     │                    │                        │                          │
     ├────────────────────────────────────────────>│                          │
     │                    │                        │                          │
     │                    │                        │ Check for error param    │
     │                    │                        │                          │
     │  Redirect to frontend with error            │                          │
     │  /auth/callback?error=access_denied         │                          │
     │<─────────────────────────────────────────────┤                          │
     │                    │                        │                          │
     ├───────────────────>│                        │                          │
     │                    │ Parse error            │                          │
     │                    │                        │                          │
     │  Show error message│                        │                          │
     │  "Login cancelled" │                        │                          │
     │<───────────────────┤                        │                          │
     │                    │ Redirect to /login     │                          │
     │                    │                        │                          │
     │                                                                         │
     │  Scenario B: OAuth provider error           │                          │
     │  ────────────────────────────────────────────────────────────────────  │
     │                    │                        │                          │
     │                    │                        │ Token exchange fails     │
     │                    │                        ├─────────────────────────>│
     │                    │                        │                          │
     │                    │                        │ Error response           │
     │                    │                        │<─────────────────────────┤
     │                    │                        │ {error: "invalid_grant"} │
     │                    │                        │                          │
     │  Redirect with error│                       │                          │
     │  /auth/callback?error=auth_failed           │                          │
     │<─────────────────────────────────────────────┤                          │
     │                    │                        │                          │
     ├───────────────────>│                        │                          │
     │                    │ Parse error            │                          │
     │                    │                        │                          │
     │  Show error message│                        │                          │
     │  "Login failed"    │                        │                          │
     │<───────────────────┤                        │                          │
     │                    │ Redirect to /login     │                          │
     │                    │                        │                          │
```

---

## Key URLs & Endpoints Reference

### Backend Endpoints (AWS App Runner)
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/linkedin` - Initiate LinkedIn OAuth
- `GET /api/auth/github` - Initiate GitHub OAuth
- `GET /api/auth/{provider}/callback` - OAuth callback handler
- `POST /api/auth/verify` - (Alternative) Verify OAuth token
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout (optional)

### Frontend Routes
- `/login` - Login page with OAuth buttons
- `/auth/callback` - OAuth callback handler page
- `/assessment` - Protected route (post-login)

### OAuth Provider URLs (Examples)
- **Google**: `https://accounts.google.com/o/oauth2/v2/auth`
- **LinkedIn**: `https://www.linkedin.com/oauth/v2/authorization`
- **GitHub**: `https://github.com/login/oauth/authorize`

---

## Security Notes

1. **State Parameter**: Prevents CSRF attacks by validating the state token
2. **JWT Token**: Signed with secret key, contains user ID and expiration
3. **HTTPS Only**: All OAuth flows must use HTTPS
4. **Token Storage**: Store JWT in localStorage or httpOnly cookies
5. **Token Expiration**: Implement reasonable expiration (7-30 days)
6. **Redirect URI**: Must exactly match registered URI with OAuth providers

---

## Implementation Checklist

- [ ] Backend OAuth initialization endpoints created
- [ ] Backend OAuth callback handlers implemented
- [ ] Database schema updated with provider fields
- [ ] JWT generation and validation implemented
- [ ] Frontend OAuth buttons trigger redirects
- [ ] Frontend callback page extracts and stores JWT
- [ ] Frontend API service attaches JWT to requests
- [ ] Protected routes validate authentication
- [ ] Error handling for all failure scenarios
- [ ] Token expiration and refresh logic implemented
- [ ] Logout functionality clears tokens
- [ ] All environment variables configured in AWS App Runner
- [ ] OAuth apps registered with all providers
- [ ] Redirect URIs configured correctly
- [ ] CORS configured on backend
- [ ] Testing completed for all three providers
