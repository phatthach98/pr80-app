import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ApiResponseUtil } from "@application/utils";
import { EErrorCode } from "@application/errors/error-codes";

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
      EErrorCode.VALIDATION_ERROR,
      400,
      errors.array(),
      req.originalUrl
    );
  }
  next();
};
