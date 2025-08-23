import { Router } from "express";
import { asyncHandler } from "@presentation/middleware/async-handler.middleware";
import { RoleController } from "@presentation/role.controller";
import {
  createRoleValidator,
  updateRolePermissionsValidator,
} from "@presentation/validators/role.validator";
import { requestValidator } from "@presentation/middleware/request-validator.middleware";

export const roleRouter = Router();

roleRouter.get("/roles", asyncHandler(RoleController.getRoles));

roleRouter.post(
  "/role",
  createRoleValidator,
  requestValidator,
  asyncHandler(RoleController.createRole)
);

roleRouter.put(
  "/role/permissions",
  updateRolePermissionsValidator,
  requestValidator,
  asyncHandler(RoleController.updatePermissions)
);
