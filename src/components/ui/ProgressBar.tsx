import { motion } from 'framer-motion';

export interface ProgressBarProps {
  progress: number; // 0-100
  animated?: boolean;
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
  showLabel?: boolean;
  labelPosition?: 'inside' | 'outside';
  delay?: number;
  className?: string;
}

/**
 * Reusable progress bar component with optional animation.
 * Used in assessments and results pages.
 */
export function ProgressBar({
  progress,
  animated = true,
  height = 6,
  backgroundColor = 'var(--surface-light)',
  fillColor = 'var(--gradient-1)',
  showLabel = false,
  labelPosition = 'outside',
  delay = 0,
  className = ''
}: ProgressBarProps) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={className}>
      <div
        style={{
          position: 'relative',
          height: `${height}px`,
          background: backgroundColor,
          borderRadius: `${height / 2}px`,
          overflow: 'hidden'
        }}
      >
        {animated ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${clampedProgress}%` }}
            transition={{ duration: 0.5, delay, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              background: fillColor,
              borderRadius: `${height / 2}px`
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${clampedProgress}%`,
              background: fillColor,
              borderRadius: `${height / 2}px`,
              transition: 'width 0.3s ease'
            }}
          />
        )}
        {showLabel && labelPosition === 'inside' && clampedProgress > 10 && (
          <span
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '10px',
              fontWeight: '600',
              color: 'white'
            }}
          >
            {Math.round(clampedProgress)}%
          </span>
        )}
      </div>
      {showLabel && labelPosition === 'outside' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '4px',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}
        >
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  );
}

export default ProgressBar;
