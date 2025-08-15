import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ApiResponseUtil } from "@application/utils";

export const requestValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponseUtil.sendError(
      res,
      "Validation failed",
      "ValidationError",
      400,
      errors.array(),
      req.originalUrl
    );
  }
  next();
}; 