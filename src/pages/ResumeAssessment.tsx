import { motion } from 'framer-motion';
import { PlayCircle, ArrowLeft } from 'lucide-react';
import { useSmartNavigation } from '../hooks/useSmartNavigation';
import SEOHead from '../components/SEOHead';

export default function ResumeAssessment() {
  const { smartNavigate } = useSmartNavigation()

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px'
    }}>
      <SEOHead />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center',
          maxWidth: '500px'
        }}
      >
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: 'rgba(20, 184, 166, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <PlayCircle size={40} color="var(--primary-light)" />
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px' }}>
          Resume Assessment
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '32px', lineHeight: '1.6' }}>
          You have an assessment in progress. This feature will allow you to continue from where you left off.
        </p>

        <div style={{
          background: 'var(--surface)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid var(--border)',
          marginBottom: '24px'
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Resume functionality coming soon
          </p>
        </div>

        <button
          onClick={() => smartNavigate()}
          className="btn-secondary"
          style={{ padding: '12px 24px' }}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
      </motion.div>
    </div>
  )
}
