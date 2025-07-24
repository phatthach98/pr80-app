import { Router } from "express";
import { asyncHandler } from "@presentation/middleware/async-handler.middleware";
import { UserController } from "@presentation/user.controller";
import {
  assignRoleValidator,
  createUserValidator,
  getAllUserValidator,
} from "@presentation/dto/user.dto";
import { requestValidator } from "@presentation/middleware/request-validator.middleware";

export const userRouter = Router();

userRouter.get(
  "/users",
  getAllUserValidator,
  requestValidator,
  asyncHandler(UserController.getAll)
);

userRouter.post(
  "/user",
  createUserValidator,
  requestValidator,
  asyncHandler(UserController.create)
);

userRouter.post(
  "/user/role",
  assignRoleValidator,
  requestValidator,
  asyncHandler(UserController.assignRole)
);
