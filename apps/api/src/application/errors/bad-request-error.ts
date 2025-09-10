import { AppError } from "./app-error";
import { EErrorCode } from "./error-codes";

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request") {
    super(message, 400, EErrorCode.INVALID_INPUT);
  }
}
