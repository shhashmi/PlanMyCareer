import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Chrome, Github, Linkedin, AlertCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSmartNavigation } from '../hooks/useSmartNavigation';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoggedIn } = useApp();
  const { smartNavigate } = useSmartNavigation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      smartNavigate();
    }
  }, [isLoggedIn, smartNavigate]);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(errorParam === 'auth_failed' ? 'Authentication failed. Please try again.' : `Login failed: ${errorParam}`);
    }
  }, [searchParams]);

  const getAuthLoginUrl = (provider: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://api.aifluens.com';
    const frontend = window.location.hostname.includes('replit.dev') ? 'replit' : 'prod';
    return `${apiUrl}/api/v1/auth/login/${provider}?frontend=${frontend}`;
  };

  const handleSocialLogin = (provider: string) => {
    window.location.href = getAuthLoginUrl(provider);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      background: 'radial-gradient(ellipse at center, rgba(20, 184, 166, 0.1) 0%, transparent 50%)'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--surface)',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid var(--border)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            Welcome
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Sign in to continue
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            color: '#ef4444',
            fontSize: '14px',
            marginBottom: '24px'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => handleSocialLogin('google')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              background: 'var(--surface-light)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <Chrome size={18} />
            Google
          </button>
          <button
            onClick={() => handleSocialLogin('github')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              background: 'var(--surface-light)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <Github size={18} />
            GitHub
          </button>
          <button
            onClick={() => handleSocialLogin('linkedin')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              background: 'var(--surface-light)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <Linkedin size={18} />
            LinkedIn
          </button>
        </div>

        <button
          onClick={() => navigate(-1)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            color: 'var(--text-muted)',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} />
          Cancel
        </button>
      </motion.div>
    </div>
  )
}
