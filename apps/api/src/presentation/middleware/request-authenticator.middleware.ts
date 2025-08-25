import { Request, Response, NextFunction } from "express";
import { JwtTokenService } from "@application/interface/service";
import { UnauthorizedError } from "@application/errors";

export const authMiddlewareFactory = (jwtService: JwtTokenService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (req.originalUrl.includes("/auth/login")) {
      return next();
    }
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Unauthorized");
    }
    try {
      const token = authHeader.split(" ")[1];
      const decoded = await jwtService.verifyToken<{
        userId: string;
        roleIds: string[];
      }>(token);

      if (!decoded || !decoded.userId) {
        throw new UnauthorizedError("Unauthorized");
      }

      // Attach user information to the request for subsequent handlers.
      req.user = { userId: decoded.userId, roleIds: decoded.roleIds };

      next();
    } catch {
      throw new UnauthorizedError("Unauthorized");
    }
  };
};
