import type { AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse, ApiError } from '../types/api.types';

/**
 * Wraps an API call with consistent error handling.
 * Eliminates repetitive try-catch blocks in service files.
 *
 * @param fn - The async function that makes the API call
 * @param errorMessage - Default error message if specific error is not available
 * @returns Standardized ApiResponse object
 *
 * @example
 * async getDimensions(): Promise<ApiResponse<Dimension[]>> {
 *   return wrapApiCall(
 *     () => api.get('/v1/questions/dimensions'),
 *     'Failed to fetch dimensions',
 *     (response) => response.data.data.dimensions
 *   );
 * }
 */
export async function wrapApiCall<T, R = T>(
  fn: () => Promise<AxiosResponse<{ status: string; data: R }>>,
  errorMessage: string,
  transformer?: (data: R) => T
): Promise<ApiResponse<T>> {
  try {
    const response = await fn();
    const data = response.data.data;
    return {
      success: true,
      data: transformer ? transformer(data) : (data as unknown as T)
    };
  } catch (error) {
    return handleApiError(error, errorMessage);
  }
}

/**
 * Wraps an API call that returns the data directly in response.data
 * (Not wrapped in { status, data } format)
 */
export async function wrapDirectApiCall<T>(
  fn: () => Promise<AxiosResponse<T>>,
  errorMessage: string
): Promise<ApiResponse<T>> {
  try {
    const response = await fn();
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error, errorMessage);
  }
}

/**
 * Wraps an API call that doesn't return data (void operations)
 */
export async function wrapVoidApiCall(
  fn: () => Promise<AxiosResponse<any>>,
  errorMessage: string
): Promise<ApiResponse<void>> {
  try {
    await fn();
    return {
      success: true,
      data: undefined
    };
  } catch (error) {
    return handleApiError(error, errorMessage);
  }
}

/**
 * Standard error handler for API calls
 */
function handleApiError<T>(error: unknown, defaultMessage: string): ApiResponse<T> {
  const axiosError = error as AxiosError<{ error?: string; message?: string }>;

  // Handle 404 specially - often used for "not found" which isn't always an error
  if (axiosError.response?.status === 404) {
    return {
      success: false,
      error: {
        status: 404,
        message: axiosError.response.data?.error ||
                 axiosError.response.data?.message ||
                 'Resource not found',
        details: axiosError.response.data
      }
    };
  }

  return {
    success: false,
    error: {
      status: axiosError.response?.status || 0,
      message: axiosError.response?.data?.error ||
               axiosError.response?.data?.message ||
               (error instanceof Error ? error.message : defaultMessage),
      details: axiosError.response?.data
    }
  };
}

/**
 * Creates an error response manually
 * Useful when you need to return an error without making an API call
 */
export function createErrorResponse<T>(
  message: string,
  status: number = 0,
  details?: any
): ApiResponse<T> {
  return {
    success: false,
    error: {
      status,
      message,
      details
    }
  };
}

/**
 * Creates a success response manually
 * Useful when you need to return success without making an API call
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data
  };
}

export default wrapApiCall;
