import { ErrorCode } from './error-codes';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;

  constructor(message: string, statusCode: number = 400, errorCode: string = ErrorCode.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
} 