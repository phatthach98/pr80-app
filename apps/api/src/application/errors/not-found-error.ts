import { AppError } from "./app-error";
import { EErrorCode } from "./error-codes";

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, EErrorCode.NOT_FOUND);
  }
}
