import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "@application/errors";
import { ApiResponseUtil } from "@application/utils";
import { ErrorCode } from "@application/errors/error-codes";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // In a real app, you would use a dedicated logger like Winston or Pino
  console.error("--- Unhandled Error ---");
  console.error(err);

  // Check if the error is a known, custom error from our application
  if (err instanceof AppError) {
    return ApiResponseUtil.sendError(
      res,
      err.message,
      err.errorCode,
      err.statusCode,
      undefined,
      req.originalUrl
    );
  }

  // Fallback for unexpected or unhandled errors (Programmer/System Errors)
  // We send a generic message to the client to avoid leaking implementation details.
  const message =
    process.env.NODE_ENV === "production"
      ? "An internal server error occurred"
      : err.message; // Show detailed message only in development
  
  // Log the error stack for server-side observation
  if (err.stack) {
    console.error("Error stack:", err.stack);
  }
  
  return ApiResponseUtil.sendError(
    res,
    message,
    ErrorCode.INTERNAL_SERVER_ERROR,
    500,
    process.env.NODE_ENV !== "production" ? { stack: err.stack } : undefined,
    req.originalUrl
  );
};
