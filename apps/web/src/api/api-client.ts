import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from 'axios';
import { getErrorMessage } from './error-message-mapper';
import { localStorageUtil } from '@/utils';

// Types matching the backend API response format
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    [key: string]: any;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  path?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Token storage keys
const TOKEN_KEY = 'pr-80.auth.token';
const REFRESH_TOKEN_KEY = 'pr-80.auth.refreshToken';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:3000') {
    // Create axios instance
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add authentication token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorageUtil.getItem(TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor for error handling and token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Don't retry if request was cancelled
        if (error.code === 'ERR_CANCELED') {
          return Promise.reject(error);
        }

        // Handle 401 Unauthorized errors with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const refreshToken = localStorageUtil.getItem(REFRESH_TOKEN_KEY);
          if (refreshToken) {
            try {
              // Attempt to refresh the token
              const refreshResponse = await axios.post(
                `${this.client.defaults.baseURL}/api/auth/refresh`,
                {
                  refreshToken,
                },
              );

              const { token, refreshToken: newRefreshToken } = refreshResponse.data.data;
              localStorageUtil.setItem(TOKEN_KEY, token);
              localStorageUtil.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

              // Emit event for token refresh so auth provider can update user data
              window.dispatchEvent(new CustomEvent('auth:token-refreshed'));

              // Retry the original request with the new token
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            } catch (refreshError) {
              // Refresh failed, clear tokens and redirect to login
              localStorageUtil.removeItem(TOKEN_KEY);
              localStorageUtil.removeItem(REFRESH_TOKEN_KEY);
              window.dispatchEvent(new CustomEvent('auth:logout'));
              return Promise.reject(refreshError);
            }
          } else {
            // No refresh token available, clear tokens and redirect to login
            localStorageUtil.removeItem(TOKEN_KEY);
            localStorageUtil.removeItem(REFRESH_TOKEN_KEY);
            window.dispatchEvent(new CustomEvent('auth:logout'));
          }
        }

        return Promise.reject(error);
      },
    );
  }

  /**
   * Centralized error handler for API requests
   * Handles two main categories: API errors and Network/Timeout errors
   */
  private handleError(error: unknown): { data: null; error: string; success: false } {
    // Log error for debugging (in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error);
    }

    if (axios.isAxiosError(error)) {
      // Category 1: API Errors - Server responded with data
      if (error.response) {
        return this.handleServerResponse(error);
      }

      // Category 2: Network/Timeout Errors - No response or connection issues
      return this.handleNetworkError(error);
    }

    // Handle non-axios errors (unexpected errors)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      success: false,
    };
  }

  /**
   * Handle server responses (both API errors and non-API responses)
   */
  private handleServerResponse(error: AxiosError): { data: null; error: string; success: false } {
    const response = error.response!;

    // Check if response has proper API error format
    if (response.data && typeof response.data === 'object' && 'error' in response.data) {
      return this.handleApiError(response.data as ApiErrorResponse);
    }

    // Handle non-API error responses (HTML error pages, plain text, etc.)
    return this.handleHttpStatusError(response.status);
  }

  /**
   * Handle HTTP status errors when server doesn't return proper API format
   */
  private handleHttpStatusError(status: number): { data: null; error: string; success: false } {
    switch (status) {
      case 400:
        return {
          data: null,
          error: 'Bad request. Please check your input and try again.',
          success: false,
        };
      case 401:
        return {
          data: null,
          error: 'Authentication required. Please log in again.',
          success: false,
        };
      case 403:
        return {
          data: null,
          error: 'Access denied. You do not have permission to perform this action.',
          success: false,
        };
      case 404:
        return {
          data: null,
          error: 'The requested resource was not found.',
          success: false,
        };
      case 429:
        return {
          data: null,
          error: 'Too many requests. Please wait a moment and try again.',
          success: false,
        };
      case 500:
        return {
          data: null,
          error: 'Internal server error. Please try again later.',
          success: false,
        };
      case 502:
        return {
          data: null,
          error: 'Bad gateway. The server is temporarily unavailable.',
          success: false,
        };
      case 503:
        return {
          data: null,
          error: 'Service temporarily unavailable. Please try again later.',
          success: false,
        };
      case 504:
        return {
          data: null,
          error: 'Gateway timeout. The server took too long to respond.',
          success: false,
        };
      default:
        return {
          data: null,
          error: `Server error (${status}). Please try again later.`,
          success: false,
        };
    }
  }

  /**
   * Handle API errors with proper error codes and messages
   */
  private handleApiError(apiError: ApiErrorResponse): {
    data: null;
    error: string;
    success: false;
  } {
    const errorCode = apiError.error?.code;

    if (errorCode) {
      // Use the error message mapper for consistent messaging
      let errorMessage = getErrorMessage(errorCode, apiError.error?.message);

      // Special handling for validation errors with details
      if (errorCode === 'VALIDATION_ERROR' && apiError.error.details) {
        errorMessage = `Validation failed: ${JSON.stringify(apiError.error.details)}`;
      }

      return {
        data: null,
        error: errorMessage,
        success: false,
      };
    }

    // Fallback to original message if no error code
    return {
      data: null,
      error: apiError.error?.message || 'An error occurred',
      success: false,
    };
  }

  /**
   * Handle network, timeout, and connection errors
   */
  private handleNetworkError(error: AxiosError): { data: null; error: string; success: false } {
    // Check for specific error types
    if (error.code === 'ECONNABORTED') {
      return {
        data: null,
        error: 'Request timed out. Please try again.',
        success: false,
      };
    }

    if (error.code === 'ERR_NETWORK') {
      return {
        data: null,
        error: 'Network error. Please check your internet connection and try again.',
        success: false,
      };
    }

    if (error.code === 'ERR_CANCELED') {
      return {
        data: null,
        error: 'Request was cancelled.',
        success: false,
      };
    }

    // Network error (no response received) - server unreachable, DNS issues, etc.
    if (error.request) {
      return {
        data: null,
        error:
          'Unable to connect to the server. Please check your internet connection and try again.',
        success: false,
      };
    }

    // Request configuration error
    return {
      data: null,
      error: 'Request configuration error. Please try again.',
      success: false,
    };
  }

  /**
   * Generic API request wrapper with standardized error handling
   */
  private async request<T>(
    requestFn: () => Promise<AxiosResponse<ApiResponse<T>>>,
  ): Promise<{ data: T | null; error: string | null; success: boolean }> {
    try {
      const response = await requestFn();
      const apiResponse = response.data;

      if (apiResponse.success) {
        return {
          data: apiResponse.data,
          error: null,
          success: true,
        };
      } else {
        return {
          data: null,
          error: apiResponse.error.message,
          success: false,
        };
      }
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * GET request wrapper
   */
  async get<T>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>(() => this.client.get(url, config));
  }

  /**
   * POST request wrapper
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>(() => this.client.post(url, data, config));
  }

  /**
   * PUT request wrapper
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>(() => this.client.put(url, data, config));
  }

  /**
   * PATCH request wrapper
   */
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>(() => this.client.patch(url, data, config));
  }

  /**
   * DELETE request wrapper
   */
  async delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>(() => this.client.delete(url, config));
  }

  /**
   * Create a cancellation token for request cancellation
   */
  createCancelToken() {
    return axios.CancelToken.source();
  }

  /**
   * Check if an error is a cancellation error
   */
  static isCancelError(error: any): boolean {
    return axios.isCancel(error);
  }
}

// Create and export a default instance
export const apiClient = new ApiClient();
