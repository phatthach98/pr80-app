import { body } from "express-validator";

export const createDishValidator = [
  body("name")
    .notEmpty()
    .withMessage("Dish name is required.")
    .isString()
    .withMessage("Dish name must be a string."),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string."),
  body("basePrice")
    .notEmpty()
    .withMessage("Base price is required.")
    .isString()
    .withMessage("Base price must be a string."),
  body("options").optional().isArray().withMessage("Options must be an array."),
];

export const updateDishValidator = [
  body("name").optional().isString().withMessage("Dish name must be a string."),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string."),
  body("basePrice")
    .optional()
    .isString()
    .withMessage("Base price must be a string."),
  body("options").optional().isArray().withMessage("Options must be an array."),
];

export const addOptionToDishValidator = [
  body("maxSelectionCount")
    .notEmpty()
    .withMessage("Max selection count is required.")
    .isInt()
    .withMessage("Max selection count must be an integer."),
  body("defaultOptionValues")
    .optional()
    .isArray()
    .withMessage("Default option values must be an array."),
];
