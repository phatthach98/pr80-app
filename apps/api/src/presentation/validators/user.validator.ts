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
    .isMobilePhone("vi-VN")
    .custom((value) => {
      // Remove any country code prefix if present (e.g., +84)
      const phoneNumberWithoutCountryCode = value.replace(/^\+\d+/, "");

      // Check if the phone number starts with 0
      if (!phoneNumberWithoutCountryCode.startsWith("0")) {
        throw new Error(
          "Phone number must start with 0 when country code is removed"
        );
      }

      return true;
    })
    .withMessage("Phone number must be a valid phone number."),
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
