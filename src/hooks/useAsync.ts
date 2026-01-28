import { useState, useCallback } from 'react';
import type { ApiResponse } from '../types/api.types';

/**
 * State managed by the useAsync hook
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Return type for useAsync hook
 */
export interface UseAsyncReturn<T, Args extends any[]> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: Args) => Promise<T | null>;
  reset: () => void;
  setData: (data: T | null) => void;
  setError: (error: string | null) => void;
}

/**
 * Custom hook for handling async operations with loading/error states.
 * Works seamlessly with the ApiResponse type used throughout the app.
 *
 * @param asyncFn - The async function to execute (should return ApiResponse<T>)
 * @param options - Optional configuration
 * @returns State and helper functions for async operations
 *
 * @example
 * const { data, loading, error, execute } = useAsync(
 *   (id: number) => assessmentService.getAssessmentSummary(id)
 * );
 *
 * // Later in component
 * useEffect(() => { execute(sessionId); }, [sessionId]);
 */
export function useAsync<T, Args extends any[] = []>(
  asyncFn: (...args: Args) => Promise<ApiResponse<T>>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    initialData?: T | null;
  }
): UseAsyncReturn<T, Args> {
  const [state, setState] = useState<AsyncState<T>>({
    data: options?.initialData ?? null,
    loading: false,
    error: null
  });

  /**
   * Execute the async function
   */
  const execute = useCallback(async (...args: Args): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await asyncFn(...args);

      if (response.success && response.data !== undefined) {
        setState({ data: response.data, loading: false, error: null });
        options?.onSuccess?.(response.data);
        return response.data;
      } else {
        const errorMessage = response.error?.message || 'An unexpected error occurred';
        setState({ data: null, loading: false, error: errorMessage });
        options?.onError?.(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      options?.onError?.(errorMessage);
      return null;
    }
  }, [asyncFn, options]);

  /**
   * Reset state to initial values
   */
  const reset = useCallback(() => {
    setState({
      data: options?.initialData ?? null,
      loading: false,
      error: null
    });
  }, [options?.initialData]);

  /**
   * Manually set data
   */
  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  /**
   * Manually set error
   */
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
    setData,
    setError
  };
}

/**
 * Simplified hook for async operations that don't need ApiResponse wrapper.
 * Useful for simpler async operations.
 */
export function useAsyncSimple<T, Args extends any[] = []>(
  asyncFn: (...args: Args) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    initialData?: T | null;
  }
): UseAsyncReturn<T, Args> {
  const [state, setState] = useState<AsyncState<T>>({
    data: options?.initialData ?? null,
    loading: false,
    error: null
  });

  const execute = useCallback(async (...args: Args): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await asyncFn(...args);
      setState({ data, loading: false, error: null });
      options?.onSuccess?.(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      options?.onError?.(errorMessage);
      return null;
    }
  }, [asyncFn, options]);

  const reset = useCallback(() => {
    setState({
      data: options?.initialData ?? null,
      loading: false,
      error: null
    });
  }, [options?.initialData]);

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
    setData,
    setError
  };
}

export default useAsync;
