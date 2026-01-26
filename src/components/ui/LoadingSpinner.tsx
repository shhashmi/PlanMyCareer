import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  message?: string;
  className?: string;
}

const sizeConfig = {
  sm: { iconSize: 16, fontSize: '12px' },
  md: { iconSize: 32, fontSize: '14px' },
  lg: { iconSize: 48, fontSize: '16px' }
};

/**
 * Reusable loading spinner component.
 * Can be used inline or as a full-page loader.
 */
export function LoadingSpinner({
  size = 'md',
  fullPage = false,
  message,
  className = ''
}: LoadingSpinnerProps) {
  const config = sizeConfig[size];

  const spinner = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}
      className={className}
    >
      <Loader2
        size={config.iconSize}
        className="animate-spin"
        style={{ color: 'var(--primary-light)' }}
      />
      {message && (
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: config.fontSize
          }}
        >
          {message}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div
        style={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * Inline loading indicator for buttons or small spaces
 */
export function InlineLoader({
  size = 16,
  message,
  className = ''
}: {
  size?: number;
  message?: string;
  className?: string;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px'
      }}
      className={className}
    >
      <Loader2 size={size} className="animate-spin" />
      {message && <span>{message}</span>}
    </span>
  );
}

/**
 * Processing spinner with custom animation
 */
export function ProcessingSpinner({
  message = 'Processing...',
  className = ''
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--text-muted)',
        fontSize: '14px'
      }}
      className={className}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{
          width: '20px',
          height: '20px',
          border: '2px solid var(--primary-light)',
          borderTopColor: 'transparent',
          borderRadius: '50%'
        }}
      />
      {message}
    </div>
  );
}

export default LoadingSpinner;
