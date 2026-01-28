import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useSmartNavigation } from '../hooks/useSmartNavigation';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useApp();
  const { smartNavigate } = useSmartNavigation();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (isLoggedIn) {
      smartNavigate();
    } else {
      // Not logged in - redirect to login page
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, loading, smartNavigate, navigate]);

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid var(--border)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
        Signing you in...
      </p>
    </div>
  );
}
