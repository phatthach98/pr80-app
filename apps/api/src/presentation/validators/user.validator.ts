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
    .withMessage("Phone number must be a string.")
    .matches(/^(0\d{9}|\+84\d{9})$/)
    .withMessage("Phone number must be a valid Vietnamese number (format: 0XXXXXXXXX or +84XXXXXXXXX)."),
  body("passCode")
    .isLength({ min: 4 })
    .withMessage("Passcode must be at least 4 digits."),
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
