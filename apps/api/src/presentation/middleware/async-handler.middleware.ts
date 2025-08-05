import { type Request, type Response, type NextFunction } from "express";

/**
 * A more flexible AsyncRequestHandler type that allows for generic request and response types
 */
type AsyncRequestHandler<
  P = any,
  ResBody = any,
  ReqBody = any,
  Query = any
> = (
  req: Request<P, ResBody, ReqBody, Query>,
  res: Response<ResBody>,
  next: NextFunction
) => Promise<any>;

/**
 * Wraps an async function and catches any errors, passing them to the Express error-handling middleware.
 * This version supports generic request and response types.
 * @param execution The async controller function to execute.
 */
export const asyncHandler = <
  P = any,
  ResBody = any,
  ReqBody = any,
  Query = any
>(
  execution: AsyncRequestHandler<P, ResBody, ReqBody, Query>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    execution(req as any, res as any, next).catch(next);
  };
};