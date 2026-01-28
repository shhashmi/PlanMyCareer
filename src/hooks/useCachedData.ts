import { useState, useEffect, useCallback, useRef } from 'react';
import type { ApiResponse } from '../types/api.types';

export interface UseCachedDataOptions<F, T> {
  /** Transform API response to cached type (can make additional API calls) */
  transform?: (data: F) => Promise<T> | T;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  /** Control when to auto-fetch (default: true) */
  enabled?: boolean;
}

export interface UseCachedDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<T | null>;
}

/**
 * Hook for "context-first, API-fallback" data fetching.
 *
 * @param cachedValue - Current cached value from context
 * @param setCachedValue - Setter to update the context cache
 * @param fetcher - API call that returns the fetched type F
 * @param options - Configuration options including transform function
 *
 * Type parameters:
 * - F: Type returned by the fetcher API
 * - T: Type stored in the cache (and returned by transform)
 */
export function useCachedData<F, T = F>(
  cachedValue: T | null,
  setCachedValue: (value: T) => void,
  fetcher: () => Promise<ApiResponse<F>>,
  options: UseCachedDataOptions<F, T> = {}
): UseCachedDataReturn<T> {
  const { transform, onSuccess, onError, enabled = true } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);  // Prevent duplicate fetches

  const fetchData = useCallback(async (): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetcher();
      if (response.success && response.data) {
        let finalData: T;

        // Apply transform if provided (can make additional API calls)
        if (transform) {
          finalData = await transform(response.data);
        } else {
          // If no transform, F must be assignable to T
          finalData = response.data as unknown as T;
        }

        setCachedValue(finalData);
        onSuccess?.(finalData);
        return finalData;
      } else {
        const errMsg = response.error?.message || 'Failed to fetch data';
        setError(errMsg);
        onError?.(errMsg);
        return null;
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unexpected error';
      setError(errMsg);
      onError?.(errMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetcher, transform, setCachedValue, onSuccess, onError]);

  // Auto-fetch if cache is empty and enabled
  useEffect(() => {
    if (!cachedValue && enabled && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchData();
    }
  }, [cachedValue, enabled, fetchData]);

  return {
    data: cachedValue,
    loading,
    error,
    refetch: fetchData
  };
}
