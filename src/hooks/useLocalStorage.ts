import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing localStorage with React state synchronization.
 * Handles JSON serialization/deserialization automatically.
 *
 * @param key - The localStorage key
 * @param initialValue - The initial value if no stored value exists
 * @returns A tuple of [storedValue, setValue] similar to useState
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T) | null) => void] {
  // Get stored value or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Persist to localStorage when value changes
  useEffect(() => {
    try {
      // Handle arrays - check length, handle objects - check null
      const isEmpty = Array.isArray(storedValue)
        ? storedValue.length === 0
        : storedValue === null || storedValue === undefined;

      if (isEmpty) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Memoized setter that handles null (for clearing)
  const setValue = useCallback((value: T | ((prev: T) => T) | null) => {
    if (value === null) {
      setStoredValue(initialValue);
      localStorage.removeItem(key);
    } else if (typeof value === 'function') {
      setStoredValue(prev => (value as (prev: T) => T)(prev));
    } else {
      setStoredValue(value);
    }
  }, [key, initialValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;
