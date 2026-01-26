import { ReactNode, MouseEventHandler } from 'react';
import { motion } from 'framer-motion';
import { Loader2, LucideIcon } from 'lucide-react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}

const variantStyles = {
  primary: {
    background: 'var(--gradient-1)',
    border: 'none',
    color: 'white'
  },
  secondary: {
    background: 'transparent',
    border: '2px solid var(--border)',
    color: 'var(--text-secondary)'
  },
  ghost: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)'
  },
  danger: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#ef4444'
  }
};

const sizeStyles = {
  sm: {
    padding: '8px 16px',
    fontSize: '13px',
    iconSize: 14,
    gap: '6px'
  },
  md: {
    padding: '12px 20px',
    fontSize: '14px',
    iconSize: 16,
    gap: '8px'
  },
  lg: {
    padding: '16px 24px',
    fontSize: '16px',
    iconSize: 18,
    gap: '10px'
  }
};

/**
 * Reusable button component with variants and loading state.
 * Standardizes button styling across the app.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  loading = false,
  fullWidth = false,
  disabled,
  type = 'button',
  onClick,
  className = '',
  style,
  children
}: ButtonProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      disabled={isDisabled}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: sizeStyle.gap,
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        fontWeight: '500',
        borderRadius: '12px',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
        transition: 'all 0.2s',
        width: fullWidth ? '100%' : 'auto',
        ...variantStyle,
        ...style
      }}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 size={sizeStyle.iconSize} className="animate-spin" />
          <span>{typeof children === 'string' ? 'Loading...' : children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={sizeStyle.iconSize} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={sizeStyle.iconSize} />}
        </>
      )}
    </motion.button>
  );
}

export default Button;
