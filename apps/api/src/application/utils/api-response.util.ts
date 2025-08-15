import { Response } from 'express';

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
    [key: string]: any; // For additional metadata
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;       // Application-specific error code
    message: string;    // User-friendly error message
    details?: any;      // Additional error details (validation errors, etc.)
  };
  timestamp: string;    // ISO timestamp of when the error occurred
  path?: string;        // Request path that caused the error
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ApiResponseUtil {
  static success<T>(data: T, meta?: Record<string, any>): ApiSuccessResponse<T> {
    return {
      success: true,
      data,
      ...(meta ? { meta } : {})
    };
  }

  static paginated<T>(
    data: T[], 
    page: number, 
    limit: number, 
    total: number,
    additionalMeta?: Record<string, any>
  ): ApiSuccessResponse<T[]> {
    return {
      success: true,
      data,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        ...(additionalMeta || {})
      }
    };
  }

  static error(
    message: string, 
    code: string, 
    details?: any,
    path?: string
  ): ApiErrorResponse {
    return {
      success: false,
      error: {
        code,
        message,
        ...(details ? { details } : {})
      },
      timestamp: new Date().toISOString(),
      ...(path ? { path } : {})
    };
  }

  /**
   * Send a success response
   */
  static sendSuccess<T>(res: Response, data: T, statusCode: number = 200, meta?: Record<string, any>): Response {
    return res.status(statusCode).json(this.success(data, meta));
  }

  /**
   * Send a paginated response
   */
  static sendPaginated<T>(
    res: Response, 
    data: T[], 
    page: number, 
    limit: number, 
    total: number, 
    statusCode: number = 200,
    additionalMeta?: Record<string, any>
  ): Response {
    return res.status(statusCode).json(this.paginated(data, page, limit, total, additionalMeta));
  }

  /**
   * Send an error response
   */
  static sendError(
    res: Response,
    message: string,
    code: string,
    statusCode: number = 400,
    details?: any,
    path?: string
  ): Response {
    return res.status(statusCode).json(this.error(message, code, details, path));
  }
}

// Add to index.ts
export * from './api-response.util';
