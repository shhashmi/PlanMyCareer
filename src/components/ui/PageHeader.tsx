import { motion } from 'framer-motion';

export interface PageHeaderProps {
  title: string;
  description?: string;
  centered?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: {
    title: '24px',
    description: '14px',
    marginBottom: '24px'
  },
  md: {
    title: '32px',
    description: '16px',
    marginBottom: '32px'
  },
  lg: {
    title: '36px',
    description: '18px',
    marginBottom: '48px'
  }
};

/**
 * Reusable page header component with title and optional description.
 * Used across Home, Profile, AssessmentChoice, Skills, Results pages.
 */
export function PageHeader({
  title,
  description,
  centered = true,
  size = 'lg',
  className = ''
}: PageHeaderProps) {
  const styles = sizeStyles[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        textAlign: centered ? 'center' : 'left',
        marginBottom: styles.marginBottom
      }}
      className={className}
    >
      <h1
        style={{
          fontSize: styles.title,
          fontWeight: '700',
          marginBottom: description ? '12px' : 0
        }}
      >
        {title}
      </h1>
      {description && (
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: styles.description
          }}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}

export default PageHeader;
