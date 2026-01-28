import { ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';

export interface CardProps {
  children: ReactNode;
  animate?: boolean;
  delay?: number;
  variant?: 'default' | 'outlined' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

const paddingSizes = {
  none: '0',
  sm: '16px',
  md: '24px',
  lg: '40px'
};

const variantStyles = {
  default: {
    background: 'var(--surface)',
    border: '1px solid var(--border)'
  },
  outlined: {
    background: 'transparent',
    border: '2px solid var(--border)'
  },
  gradient: {
    background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
    border: '1px solid var(--primary)'
  }
};

/**
 * Reusable card component with motion animation support.
 * Used across various pages for consistent card styling.
 */
export function Card({
  children,
  animate = true,
  delay = 0,
  variant = 'default',
  padding = 'md',
  className = '',
  style,
  onClick
}: CardProps) {
  const variantStyle = variantStyles[variant];

  const baseStyle = {
    borderRadius: '24px',
    padding: paddingSizes[padding],
    ...variantStyle,
    ...style
  };

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3 }}
        style={baseStyle}
        className={className}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div style={baseStyle} className={className} onClick={onClick}>
      {children}
    </div>
  );
}

/**
 * Card with centered content - useful for stat displays
 */
export function StatCard({
  value,
  label,
  delay = 0,
  valueColor = 'var(--primary-light)',
  className = ''
}: {
  value: string | number;
  label: string;
  delay?: number;
  valueColor?: string;
  className?: string;
}) {
  return (
    <Card delay={delay} className={className} style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: '48px',
          fontWeight: '700',
          color: valueColor,
          marginBottom: '8px'
        }}
      >
        {value}
      </div>
      <p style={{ color: 'var(--text-muted)' }}>{label}</p>
    </Card>
  );
}

export default Card;
