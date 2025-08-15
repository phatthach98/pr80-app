import { Request, Response, NextFunction } from "express";
import { ApiResponseUtil } from "@application/utils";

/**
 * Middleware that intercepts all responses and formats them according to the standard API response format.
 * This middleware overrides the res.json method to automatically wrap responses in the standard format.
 */
export const responseInterceptor = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Store the original res.json method
  const originalJson = res.json;

  // Override res.json method
  res.json = function (body: any): Response {
    // Don't format if it's already formatted (has success property)
    if (body && typeof body === "object" && "success" in body) {
      const isStandardSuccess = body.success === true && "data" in body;
      const isStandardError = body.success === false && "error" in body;
      if (isStandardSuccess || isStandardError) {
        return originalJson.call(this, body);
      }
    }
    // Format the response
    return originalJson.call(this, ApiResponseUtil.success(body));
  };

  // Continue to the next middleware
  next();
};
