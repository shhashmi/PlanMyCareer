import { AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  variant?: 'error' | 'warning' | 'info';
  className?: string;
}

const variantStyles = {
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#ef4444'
  },
  warning: {
    background: 'rgba(251, 191, 36, 0.1)',
    border: '1px solid rgba(251, 191, 36, 0.3)',
    color: '#d97706'
  },
  info: {
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    color: '#3b82f6'
  }
};

/**
 * Reusable error/warning/info alert component.
 * Used across pages for displaying error messages.
 */
export function ErrorAlert({
  message,
  onDismiss,
  variant = 'error',
  className = ''
}: ErrorAlertProps) {
  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            background: styles.background,
            border: styles.border,
            borderRadius: '12px',
            color: styles.color,
            fontSize: '14px',
            marginBottom: '24px'
          }}
          className={className}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{message}</span>
          {onDismiss && (
            <button
              onClick={onDismiss}
              style={{
                background: 'transparent',
                border: 'none',
                color: styles.color,
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ErrorAlert;
