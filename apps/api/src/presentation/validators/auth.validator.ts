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
