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
    .withMessage("Base price must be a string.")
    .matches(/^\d+(\.\d{1,2})?$/)
    .withMessage("Base price must be a numeric string (e.g. '10' or '10.99')."),
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
    .withMessage("Base price must be a string.")
    .if(body("basePrice").exists())
    .matches(/^\d+(\.\d{1,2})?$/)
    .withMessage("Base price must be a numeric string (e.g. '10' or '10.99')."),
  body("options").optional().isArray().withMessage("Options must be an array."),
];
