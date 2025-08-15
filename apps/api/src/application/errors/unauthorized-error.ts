import { AppError } from './app-error';
import { ErrorCode } from './error-codes';

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, ErrorCode.UNAUTHORIZED);
  }
} 