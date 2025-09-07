import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from 'axios';
import { ErrorCode } from '@pr80-app/shared-contracts';
import { authLocalStorageUtil } from '@/utils/auth-local-storage.util';

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
        const token = authLocalStorageUtil.getToken();
        console.log('config.url', config.url);
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
      async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        // Don't retry if request was cancelled
        if (error.code === 'ERR_CANCELED') {
          return Promise.reject(error);
        }

        if (
          error.response?.statusText === 'Unauthorized' &&
          error.response?.data.path?.includes('/auth/refresh-token')
        ) {
          return Promise.reject(error);
        }

        // Handle 401 Unauthorized errors with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Create a refresh token promise
          const refreshPromise = new Promise<string | null>((resolve) => {
            // Dispatch event with resolver function
            window.dispatchEvent(
              new CustomEvent('auth:unauthorized', {
                detail: {
                  // Pass a callback that the auth layout can call with the new token
                  onRefreshComplete: (newToken: string | null) => {
                    resolve(newToken);
                  },
                  // Pass the original request for debugging purposes
                  originalRequest,
                },
              }),
            );
          });

          // Wait for the auth layout to resolve the promise
          const newToken = await refreshPromise;
          if (newToken) {
            // If we got a new token, retry the original request
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } else {
            // If token refresh failed, reject the original request
            return Promise.reject(error);
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
  private handleError(error: unknown): ApiErrorResponse {
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
      success: false,
      error: {
        code: ErrorCode.UNEXPECTED_ERROR,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Handle server responses (both API errors and non-API responses)
   */
  private handleServerResponse(error: AxiosError): ApiErrorResponse {
    const response = error.response!;

    // Check if response has proper API error format
    if (response.data && typeof response.data === 'object' && 'error' in response.data) {
      return response.data as ApiErrorResponse;
    }

    // Handle non-API error responses (HTML error pages, plain text, etc.)
    return this.handleHttpStatusError(response.status);
  }

  /**
   * Handle HTTP status errors when server doesn't return proper API format
   */
  private handleHttpStatusError(status: number): ApiErrorResponse {
    switch (status) {
      case 400:
        return {
          success: false,
          error: {
            code: ErrorCode.BAD_REQUEST,
            message: 'Bad request. Please check your input and try again.',
          },
          timestamp: new Date().toISOString(),
        };
      case 401:
        return {
          success: false,
          error: {
            code: ErrorCode.UNAUTHORIZED,
            message: 'Authentication required. Please log in again.',
          },
          timestamp: new Date().toISOString(),
        };
      case 403:
        return {
          success: false,
          error: {
            code: ErrorCode.FORBIDDEN,
            message: 'Access denied. You do not have permission to perform this action.',
          },
          timestamp: new Date().toISOString(),
        };
      case 404:
        return {
          success: false,
          error: {
            code: ErrorCode.NOT_FOUND,
            message: 'The requested resource was not found.',
          },
          timestamp: new Date().toISOString(),
        };
      case 429:
        return {
          success: false,
          error: {
            code: ErrorCode.TOO_MANY_REQUESTS,
            message: 'Too many requests. Please wait a moment and try again.',
          },
          timestamp: new Date().toISOString(),
        };
      case 500:
        return {
          success: false,
          error: {
            code: ErrorCode.INTERNAL_SERVER_ERROR,
            message: 'Internal server error. Please try again later.',
          },
          timestamp: new Date().toISOString(),
        };
      case 502:
        return {
          success: false,
          error: {
            code: ErrorCode.BAD_GATEWAY,
            message: 'Bad gateway. The server is temporarily unavailable.',
          },
          timestamp: new Date().toISOString(),
        };
      case 503:
        return {
          success: false,
          error: {
            code: ErrorCode.SERVICE_UNAVAILABLE,
            message: 'Service temporarily unavailable. Please try again later.',
          },
          timestamp: new Date().toISOString(),
        };
      case 504:
        return {
          success: false,
          error: {
            code: ErrorCode.GATEWAY_TIMEOUT,
            message: 'Gateway timeout. The server took too long to respond.',
          },
          timestamp: new Date().toISOString(),
        };
      default:
        return {
          success: false,
          error: {
            code: ErrorCode.SERVER_ERROR,
            message: `Server error (${status}). Please try again later.`,
          },
          timestamp: new Date().toISOString(),
        };
    }
  }

  /**
   * Handle network, timeout, and connection errors
   */
  private handleNetworkError(error: AxiosError): ApiErrorResponse {
    // Check for specific error types
    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        error: {
          code: ErrorCode.REQUEST_TIMEOUT,
          message: 'Request timed out. Please try again.',
        },
        timestamp: new Date().toISOString(),
      };
    }

    if (error.code === 'ERR_NETWORK') {
      return {
        success: false,
        error: {
          code: ErrorCode.NETWORK_ERROR,
          message: 'Network error. Please check your internet connection and try again.',
        },
        timestamp: new Date().toISOString(),
      };
    }

    if (error.code === 'ERR_CANCELED') {
      return {
        success: false,
        error: {
          code: ErrorCode.REQUEST_CANCELED,
          message: 'Request was cancelled.',
        },
        timestamp: new Date().toISOString(),
      };
    }

    // Network error (no response received) - server unreachable, DNS issues, etc.
    if (error.request) {
      return {
        success: false,
        error: {
          code: ErrorCode.CONNECTION_ERROR,
          message:
            'Unable to connect to the server. Please check your internet connection and try again.',
        },
        timestamp: new Date().toISOString(),
      };
    }

    // Request configuration error
    return {
      success: false,
      error: {
        code: ErrorCode.REQUEST_CONFIG_ERROR,
        message: 'Request configuration error. Please try again.',
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generic API request wrapper with standardized error handling
   */
  private async request<T>(
    requestFn: () => Promise<AxiosResponse<ApiResponse<T>>>,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await requestFn();
      const apiResponse = response.data;

      if (apiResponse.success) {
        return {
          success: true,
          data: apiResponse.data,
        };
      } else {
        return {
          success: false,
          error: apiResponse.error,
          timestamp: new Date().toISOString(),
        };
      }
    } catch (error) {
      const apiError = this.handleError(error);
      return {
        success: false,
        error: apiError.error,
        timestamp: new Date().toISOString(),
      };
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
export const apiClient = new ApiClient('http://localhost:3000/api');
