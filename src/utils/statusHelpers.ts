import type { StatusType } from '../components/ui/StatusBadge';

/**
 * Status information returned by helper functions
 */
export interface StatusInfo {
  status: StatusType;
  label: string;
  color: string;
}

/**
 * Configuration for each status type
 */
const statusConfig: Record<StatusType, { label: string; color: string }> = {
  excellent: {
    label: 'Excellent',
    color: 'var(--secondary)'
  },
  good: {
    label: 'Good',
    color: 'var(--primary-light)'
  },
  fair: {
    label: 'Needs Work',
    color: 'var(--accent)'
  },
  'needs-improvement': {
    label: 'Needs Improvement',
    color: 'var(--error)'
  },
  developing: {
    label: 'Developing',
    color: 'var(--accent)'
  }
};

/**
 * Determines competency status based on percentage score.
 * Used in assessment results pages.
 *
 * @param percentage - Score percentage (0-100)
 * @returns StatusInfo object with status, label, and color
 *
 * @example
 * const { status, label, color } = getCompetencyStatus(75);
 * // { status: 'good', label: 'Good', color: 'var(--primary-light)' }
 */
export function getCompetencyStatus(percentage: number): StatusInfo {
  let status: StatusType;

  if (percentage >= 80) {
    status = 'excellent';
  } else if (percentage >= 60) {
    status = 'good';
  } else if (percentage >= 40) {
    status = 'fair';
  } else {
    status = 'needs-improvement';
  }

  const config = statusConfig[status];
  return {
    status,
    label: config.label,
    color: config.color
  };
}

/**
 * Calculates percentage from correct answers
 *
 * @param correct - Number of correct answers
 * @param total - Total number of questions
 * @returns Percentage (0-100)
 */
export function calculatePercentage(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Gets skill level string from proficiency number
 * Used for displaying skill levels in profile/results pages.
 *
 * @param proficiency - Proficiency level (0-4 or 0-100)
 * @returns Human-readable skill level string
 */
export function getSkillLevel(proficiency: number): string {
  // Handle 0-4 scale
  if (proficiency <= 4) {
    if (proficiency >= 3.5) return 'Expert';
    if (proficiency >= 2.5) return 'Advanced';
    if (proficiency >= 1.5) return 'Intermediate';
    return 'Basic';
  }

  // Handle percentage scale (0-100)
  if (proficiency >= 80) return 'Expert';
  if (proficiency >= 60) return 'Advanced';
  if (proficiency >= 40) return 'Intermediate';
  return 'Basic';
}

/**
 * Determines color based on score for visual indicators
 */
export function getScoreColor(percentage: number): string {
  if (percentage >= 80) return 'var(--secondary)';
  if (percentage >= 60) return 'var(--primary-light)';
  if (percentage >= 40) return 'var(--accent)';
  return 'var(--error)';
}

/**
 * Maps difficulty level to display order
 * Used for sorting focus areas by difficulty
 */
export function getDifficultyOrder(difficulty: string): number {
  const order: Record<string, number> = {
    'Expert': 0,
    'Advanced': 1,
    'Intermediate': 2,
    'Basic': 3
  };
  return order[difficulty] ?? 99;
}

/**
 * Formats a score for display
 * Adds appropriate formatting like percentage signs
 */
export function formatScore(score: number, options?: {
  asPercentage?: boolean;
  decimals?: number;
}): string {
  const { asPercentage = true, decimals = 0 } = options || {};
  const formatted = score.toFixed(decimals);
  return asPercentage ? `${formatted}%` : formatted;
}

export default {
  getCompetencyStatus,
  calculatePercentage,
  getSkillLevel,
  getScoreColor,
  getDifficultyOrder,
  formatScore
};
