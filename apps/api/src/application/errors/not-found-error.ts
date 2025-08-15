import { AppError } from './app-error';
import { ErrorCode } from './error-codes';

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, ErrorCode.NOT_FOUND);
  }
} 