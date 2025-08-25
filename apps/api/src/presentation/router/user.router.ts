import { Router } from "express";
import { asyncHandler } from "@presentation/middleware/async-handler.middleware";
import { UserController } from "@presentation/user.controller";
import {
  assignRoleValidator,
  createUserValidator,
  getAllUserValidator,
  getUserDetailValidator,
} from "@presentation/validators/user.validator";
import { requestValidator } from "@presentation/middleware/request-validator.middleware";

export const userRouter = Router();

userRouter.get(
  "/users",
  getAllUserValidator,
  requestValidator,
  asyncHandler(UserController.getAll)
);

userRouter.get(
  "/users/:userId",
  getUserDetailValidator,
  requestValidator,
  asyncHandler(UserController.getUserDetail)
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
