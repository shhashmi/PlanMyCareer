import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { skills } = useApp();

    if (skills.length === 0) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
