import { AppError } from "./app-error";
import { EErrorCode } from "./error-codes";

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, EErrorCode.UNAUTHORIZED);
  }
}
