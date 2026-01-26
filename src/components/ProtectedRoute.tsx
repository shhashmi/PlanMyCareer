import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isLoggedIn, loading } = useApp();

    // Wait for auth check to complete
    if (loading) {
        return null;
    }

    // Must be logged in to access protected routes
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // User is logged in - allow access
    // Skills will be loaded by App.tsx navigation logic
    return children;
};

export default ProtectedRoute;
