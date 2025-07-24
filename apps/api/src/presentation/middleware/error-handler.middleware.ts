import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "@application/errors";

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
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // Fallback for unexpected or unhandled errors (Programmer/System Errors)
  // We send a generic message to the client to avoid leaking implementation details.
  const message =
    process.env.NODE_ENV === "production"
      ? "An internal server error occurred"
      : err.message; // Show detailed message only in development

  return res.status(500).json({ message });
};
