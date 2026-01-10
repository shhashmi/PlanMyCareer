import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isLoggedIn, loading, skills } = useApp();

    // Optionally show a loading spinner while checking auth status
    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--surface-dark)',
                color: 'var(--text-primary)'
            }}>
                Loading session...
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (skills.length === 0) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
