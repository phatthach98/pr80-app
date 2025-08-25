import { Router } from "express";
import { asyncHandler } from "@presentation/middleware/async-handler.middleware";
import { AuthController } from "@presentation/auth.controller";
import { loginValidator } from "@presentation/validators/auth.validator";
import { requestValidator } from "@presentation/middleware/request-validator.middleware";

export const authRouter = Router();

authRouter.post(
  "/login",
  loginValidator,
  requestValidator,
  asyncHandler(AuthController.login)
);

authRouter.get("/me", asyncHandler(AuthController.getMe));
