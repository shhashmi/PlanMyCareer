export type StatusType = 'excellent' | 'good' | 'fair' | 'needs-improvement' | 'developing';

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig: Record<StatusType, { color: string; defaultLabel: string }> = {
  excellent: {
    color: 'var(--secondary)',
    defaultLabel: 'Excellent'
  },
  good: {
    color: 'var(--primary-light)',
    defaultLabel: 'Good'
  },
  fair: {
    color: 'var(--accent)',
    defaultLabel: 'Needs Work'
  },
  'needs-improvement': {
    color: 'var(--error)',
    defaultLabel: 'Needs Improvement'
  },
  developing: {
    color: 'var(--accent)',
    defaultLabel: 'Developing'
  }
};

/**
 * Reusable status badge component for displaying competency levels.
 * Used in BasicResults, AdvancedResults pages.
 */
export function StatusBadge({
  status,
  label,
  size = 'md',
  className = ''
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const displayLabel = label || config.defaultLabel;

  const sizeStyles = {
    sm: {
      padding: '2px 6px',
      fontSize: '10px'
    },
    md: {
      padding: '4px 8px',
      fontSize: '11px'
    }
  };

  return (
    <span
      style={{
        padding: sizeStyles[size].padding,
        borderRadius: '6px',
        fontSize: sizeStyles[size].fontSize,
        fontWeight: '600',
        background: `${config.color}20`,
        color: config.color,
        whiteSpace: 'nowrap'
      }}
      className={className}
    >
      {displayLabel}
    </span>
  );
}

/**
 * Helper function to get status based on percentage score.
 * Can be used in components that need to determine status from a score.
 */
export function getStatusFromScore(percentage: number): StatusType {
  if (percentage >= 80) return 'excellent';
  if (percentage >= 60) return 'good';
  if (percentage >= 40) return 'fair';
  return 'needs-improvement';
}

/**
 * Get status info object with status, label, and color.
 * Useful when you need all status information.
 */
export function getStatusInfo(percentage: number) {
  const status = getStatusFromScore(percentage);
  const config = statusConfig[status];
  return {
    status,
    label: config.defaultLabel,
    color: config.color
  };
}

export default StatusBadge;
