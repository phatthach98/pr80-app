import { body, param } from "express-validator";
import { Permission } from "@domain/entity/permission";
import { ROLE_NAME_VALUES } from "@pr80-app/shared-contracts";

export const createRoleValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Role name is required.")
    .isIn(ROLE_NAME_VALUES)
    .withMessage(`Role name must be one of: ${ROLE_NAME_VALUES.join(", ")}`),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .isString()
    .withMessage("Description must be a string.")
    .isLength({ min: 5, max: 255 })
    .withMessage("Description must be between 5 and 255 characters."),

  body("permissions")
    .isArray({ min: 1 })
    .withMessage("At least one permission is required.")
    .custom((permissions: string[]) => {
      try {
        // Domain validation logic stays in API layer
        permissions.forEach(Permission.fromString);
        return true;
      } catch (error: any) {
        throw new Error(`Invalid permission format found. ${error.message}`);
      }
    }),
];

export const updateRolePermissionsValidator = [
  body("roleId")
    .trim()
    .notEmpty()
    .withMessage("Role ID is required.")
    .isString()
    .withMessage("Role ID must be a string."),

  body("permissions")
    .isArray({ min: 1 })
    .withMessage("At least one permission is required.")
    .custom((permissions: string[]) => {
      try {
        // Domain validation logic stays in API layer
        permissions.forEach(Permission.fromString);
        return true;
      } catch (error: any) {
        throw new Error(`Invalid permission format found. ${error.message}`);
      }
    }),
];
