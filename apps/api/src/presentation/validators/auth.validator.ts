import { body } from "express-validator";

export const loginValidator = [
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required.")
    .isString()
    .withMessage("Phone number must be a string."),
  body("passCode")
    .isLength({ min: 4, max: 4 })
    .withMessage("Passcode must be 4 digits."),
];

export const refreshTokenValidator = [
  body("refreshToken")
    .notEmpty()
    .withMessage("Refresh token is required.")
    .isString()
    .withMessage("Refresh token must be a string."),
];
