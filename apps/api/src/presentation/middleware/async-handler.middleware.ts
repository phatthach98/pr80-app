import { type Request, type Response, type NextFunction } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

/**
 * Wraps an async function and catches any errors, passing them to the Express error-handling middleware.
 * @param execution The async controller function to execute.
 */
export const asyncHandler =
  (execution: AsyncRequestHandler) =>
  (req: Request, res: Response, next: NextFunction) => {
    execution(req, res, next).catch(next);
  };
