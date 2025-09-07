import { body } from "express-validator";

export const createSettingConfigValidator = [
  body("key")
    .notEmpty()
    .withMessage("Key is required.")
    .isString()
    .withMessage("Key must be a string."),
  body("data")
    .notEmpty()
    .withMessage("Data is required."),
];

export const createTableOptionsValidator = [
  body("options")
    .notEmpty()
    .withMessage("Options are required.")
    .isArray()
    .withMessage("Options must be an array."),
  body("options.*.value")
    .notEmpty()
    .withMessage("Option value is required.")
    .isString()
    .withMessage("Option value must be a string."),
  body("options.*.label")
    .notEmpty()
    .withMessage("Option label is required.")
    .isString()
    .withMessage("Option label must be a string."),
];

export const createOrderStatusOptionsValidator = [
  body("options")
    .notEmpty()
    .withMessage("Options are required.")
    .isArray()
    .withMessage("Options must be an array."),
  body("options.*.value")
    .notEmpty()
    .withMessage("Option value is required.")
    .isString()
    .withMessage("Option value must be a string."),
  body("options.*.label")
    .notEmpty()
    .withMessage("Option label is required.")
    .isString()
    .withMessage("Option label must be a string."),
];

export const updateSettingConfigValidator = [
  body("key")
    .notEmpty()
    .withMessage("Key is required.")
    .isString()
    .withMessage("Key must be a string."),
  body("config")
    .notEmpty()
    .withMessage("Config is required."),
];

export const updateSettingOptionsValidator = [
  body("key")
    .notEmpty()
    .withMessage("Key is required.")
    .isString()
    .withMessage("Key must be a string."),
  body("options")
    .notEmpty()
    .withMessage("Options are required.")
    .isArray()
    .withMessage("Options must be an array."),
  body("options.*.value")
    .notEmpty()
    .withMessage("Option value is required.")
    .isString()
    .withMessage("Option value must be a string."),
  body("options.*.label")
    .notEmpty()
    .withMessage("Option label is required.")
    .isString()
    .withMessage("Option label must be a string."),
];

