import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--surface)',
              borderRadius: '24px',
              padding: '40px',
              maxWidth: '480px',
              width: '100%',
              textAlign: 'center',
              border: '1px solid var(--border)',
              position: 'relative'
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '8px'
              }}
            >
              <X size={24} />
            </button>

            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'var(--gradient-1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <Sparkles size={32} color="white" />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
              Thank You for Your Interest!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6' }}>
              Advanced Assessment will be available soon. We're working hard to bring you an AI-powered deep analysis experience.
            </p>

            <button
              onClick={onClose}
              className="btn-primary"
              style={{ marginTop: '24px', width: '100%', justifyContent: 'center' }}
            >
              Got it
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
