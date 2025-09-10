import { AppError } from "./app-error";
import { EErrorCode } from "./error-codes";

export class ConflictError extends AppError {
  constructor(message: string = "Conflict") {
    super(message, 409, EErrorCode.CONFLICT);
  }
}
