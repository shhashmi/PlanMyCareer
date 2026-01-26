/**
 * UI Components barrel export
 * Import all UI components from this file for convenience
 *
 * @example
 * import { Button, Card, ErrorAlert, Modal } from '../components/ui';
 */

export { ErrorAlert } from './ErrorAlert';
export type { ErrorAlertProps } from './ErrorAlert';

export { ProgressBar } from './ProgressBar';
export type { ProgressBarProps } from './ProgressBar';

export { Modal } from './Modal';
export type { ModalProps } from './Modal';

export { PageHeader } from './PageHeader';
export type { PageHeaderProps } from './PageHeader';

export { Button } from './Button';
export type { ButtonProps } from './Button';

export { FormField, SelectField } from './FormField';
export type { FormFieldProps, SelectFieldProps } from './FormField';

export { StatusBadge, getStatusFromScore, getStatusInfo } from './StatusBadge';
export type { StatusBadgeProps, StatusType } from './StatusBadge';

export { Card, StatCard } from './Card';
export type { CardProps } from './Card';

export { LoadingSpinner, InlineLoader, ProcessingSpinner } from './LoadingSpinner';
export type { LoadingSpinnerProps } from './LoadingSpinner';
