import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useApp();

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '40px 24px' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '24px',
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div
            style={{
              background: 'var(--surface)',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'var(--gradient-1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <User size={36} color="white" />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                {user?.name || 'User'}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Member
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'var(--surface-light)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                }}
              >
                <User size={20} color="var(--text-muted)" />
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                    Name
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                    {user?.name || 'Not provided'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'var(--surface-light)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                }}
              >
                <Mail size={20} color="var(--text-muted)" />
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                    Email
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                    {user?.email || 'Not provided'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
