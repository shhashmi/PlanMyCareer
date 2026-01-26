import { useState, useCallback, ChangeEvent } from 'react';

/**
 * Validation rule for a single field
 */
export interface ValidationRule<T> {
  validate: (value: T[keyof T], formData: T) => boolean;
  message: string;
}

/**
 * Validation rules for all form fields
 */
export type ValidationRules<T> = Partial<Record<keyof T, ValidationRule<T>[]>>;

/**
 * Form errors object
 */
export type FormErrors<T> = Partial<Record<keyof T, string>>;

/**
 * Return type for useForm hook
 */
export interface UseFormReturn<T> {
  formData: T;
  errors: FormErrors<T>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  validate: () => boolean;
  reset: () => void;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors<T>>>;
  clearError: (field: keyof T) => void;
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
}

/**
 * Custom hook for managing form state with validation support.
 *
 * @param initialState - The initial form data
 * @param validators - Optional validation rules for form fields
 * @returns Form state and helper functions
 *
 * @example
 * const { formData, errors, handleChange, validate } = useForm(
 *   { email: '', password: '' },
 *   {
 *     email: [{ validate: (v) => v.includes('@'), message: 'Invalid email' }],
 *     password: [{ validate: (v) => v.length >= 8, message: 'Too short' }]
 *   }
 * );
 */
export function useForm<T extends Record<string, any>>(
  initialState: T,
  validators?: ValidationRules<T>
): UseFormReturn<T> {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<FormErrors<T>>({});

  /**
   * Handle input change events
   */
  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field when user types
    if (errors[name as keyof T]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  /**
   * Clear error for a specific field
   */
  const clearError = useCallback((field: keyof T) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  /**
   * Set a specific field value programmatically
   */
  const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearError(field);
  }, [clearError]);

  /**
   * Validate form data against provided rules
   * Returns true if valid, false otherwise
   */
  const validate = useCallback((): boolean => {
    if (!validators) return true;

    const newErrors: FormErrors<T> = {};
    let isValid = true;

    for (const field of Object.keys(validators) as (keyof T)[]) {
      const fieldRules = validators[field];
      if (!fieldRules) continue;

      for (const rule of fieldRules) {
        if (!rule.validate(formData[field], formData)) {
          newErrors[field] = rule.message;
          isValid = false;
          break; // Stop at first error for this field
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [formData, validators]);

  /**
   * Reset form to initial state
   */
  const reset = useCallback(() => {
    setFormData(initialState);
    setErrors({});
  }, [initialState]);

  return {
    formData,
    errors,
    handleChange,
    validate,
    reset,
    setFormData,
    setErrors,
    clearError,
    setFieldValue
  };
}

/**
 * Common validators that can be reused across forms
 */
export const commonValidators = {
  required: (fieldName: string) => ({
    validate: (value: any) => value !== undefined && value !== null && value !== '',
    message: `${fieldName} is required`
  }),
  minLength: (fieldName: string, min: number) => ({
    validate: (value: string) => value.length >= min,
    message: `${fieldName} must be at least ${min} characters`
  }),
  maxLength: (fieldName: string, max: number) => ({
    validate: (value: string) => value.length <= max,
    message: `${fieldName} must be at most ${max} characters`
  }),
  email: () => ({
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Invalid email address'
  }),
  number: (fieldName: string) => ({
    validate: (value: string) => !isNaN(Number(value)),
    message: `${fieldName} must be a number`
  })
};

export default useForm;
