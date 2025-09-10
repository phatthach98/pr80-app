import { AppError } from "./app-error";
import { EErrorCode } from "./error-codes";

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403, EErrorCode.FORBIDDEN);
  }
}
