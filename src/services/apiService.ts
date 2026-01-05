/**
 * Base API Service
 * Provides reusable HTTP methods for all API integrations
 * Extensible for multiple endpoints and services
 */

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface ErrorResponse {
  status: number;
  statusText?: string;
  data?: any;
  message: string;
  originalError?: Error;
}

class ApiService {
  protected baseURL: string;
  protected defaultHeaders: Record<string, string>;

  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Set base URL for the service
   */
  setBaseURL(url: string): this {
    this.baseURL = url;
    return this;
  }

  /**
   * Set default headers for all requests
   */
  setHeaders(headers: Record<string, string>): this {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
    return this;
  }

  /**
   * Add authorization token to headers
   */
  setAuthToken(token: string): this {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
    return this;
  }

  /**
   * Generic request method
   */
  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestOptions = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        throw {
          status: response.status,
          statusText: response.statusText,
          data,
          message: data?.message || data?.error || 'Request failed',
        } as ErrorResponse;
      }

      return data as T;
    } catch (error) {
      // Network error or parsing error
      const err = error as ErrorResponse;
      if (err.status) {
        throw err;
      }
      throw {
        status: 0,
        message: (error as Error).message || 'Network error occurred',
        originalError: error as Error,
      } as ErrorResponse;
    }
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    params: Record<string, any> = {},
    options: RequestOptions = {}
  ): Promise<T> {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request<T>(url, {
      method: 'GET',
      ...options,
    });
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    data: any = {},
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    data: any = {},
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    data: any = {},
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export class for creating new instances
export default ApiService;
