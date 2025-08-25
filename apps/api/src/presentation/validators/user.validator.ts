import { ROLE_NAME_VALUES } from "@pr80-app/shared-contracts";
import { body, param, query } from "express-validator";

export const createUserValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required.")
    .isString()
    .withMessage("Name must be a string."),
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required.")
    .isString()
    .withMessage("Phone number must be a string."),
  body("passCode")
    .isLength({ min: 4, max: 4 })
    .withMessage("Passcode must be 4 digits."),
  body("roleIds")
    .isArray({ min: 1 })
    .withMessage("At least one roleId is required."),
  body("roleIds.*").isString().withMessage("Each roleId must be a string."),
];

export const getUserDetailValidator = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required.")
    .isString()
    .withMessage("User ID must be a string."),
];

export const assignRoleValidator = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required.")
    .isString()
    .withMessage("User ID must be a string."),
  body("roleName")
    .notEmpty()
    .withMessage("Role name is required.")
    .isIn(ROLE_NAME_VALUES)
    .withMessage(`Role name must be one of: ${ROLE_NAME_VALUES.join(", ")}`),
];

export const getAllUserValidator = [
  query("page").isInt().optional().withMessage("Page must be an integer."),
  query("limit").isInt().optional().withMessage("Limit must be an integer."),
];
