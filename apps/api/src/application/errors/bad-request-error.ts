import { AppError } from './app-error';
import { ErrorCode } from './error-codes';

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request') {
    super(message, 400, ErrorCode.INVALID_INPUT);
  }
} 