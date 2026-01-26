import { ChangeEvent, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea';
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  icon?: LucideIcon;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  rows?: number;
  min?: number;
  max?: number;
  helperText?: string;
  className?: string;
  children?: ReactNode; // For select elements
}

/**
 * Reusable form field component with icon, label, and error display.
 * Used across Home, Profile, Payment pages.
 */
export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  icon: Icon,
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  rows = 3,
  min,
  max,
  helperText,
  className = ''
}: FormFieldProps) {
  const hasIcon = !!Icon;

  const baseInputStyle = {
    width: '100%',
    padding: '14px 16px',
    paddingLeft: hasIcon ? '44px' : '16px',
    background: readOnly ? 'var(--surface-light)' : 'var(--surface)',
    border: `2px solid ${error ? 'var(--error)' : readOnly ? 'var(--border)' : 'var(--border)'}`,
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
    cursor: readOnly ? 'default' : disabled ? 'not-allowed' : 'text'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-secondary)'
  };

  return (
    <div className={className}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: 'var(--error)', marginLeft: '4px' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: type === 'textarea' ? '16px' : '50%',
              transform: type === 'textarea' ? 'none' : 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
        )}
        {type === 'textarea' ? (
          <textarea
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={rows}
            disabled={disabled}
            readOnly={readOnly}
            style={{
              ...baseInputStyle,
              paddingTop: '14px',
              resize: 'vertical',
              minHeight: '80px'
            }}
          />
        ) : (
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            min={min}
            max={max}
            style={baseInputStyle}
          />
        )}
      </div>
      {error && (
        <span style={{ color: 'var(--error)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
      {helperText && !error && (
        <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
          {helperText}
        </span>
      )}
    </div>
  );
}

/**
 * Select field variant for dropdown menus
 */
export interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  error?: string;
  icon?: LucideIcon;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  error,
  icon: Icon,
  placeholder = 'Select...',
  required = false,
  disabled = false,
  className = ''
}: SelectFieldProps) {
  const hasIcon = !!Icon;

  return (
    <div className={className}>
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--text-secondary)'
        }}
      >
        {label}
        {required && <span style={{ color: 'var(--error)', marginLeft: '4px' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}
          />
        )}
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '14px 16px',
            paddingLeft: hasIcon ? '44px' : '16px',
            background: 'var(--surface)',
            border: `2px solid ${error ? 'var(--error)' : 'var(--border)'}`,
            borderRadius: '12px',
            color: 'var(--text-primary)',
            fontSize: '16px',
            outline: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'border-color 0.2s'
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <span style={{ color: 'var(--error)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
}

export default FormField;
