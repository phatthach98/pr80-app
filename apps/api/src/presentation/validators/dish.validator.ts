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
  body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isString()
    .withMessage("Price must be a string.")
    .matches(/^\d+(\.\d{1,2})?$/)
    .withMessage("Price must be a numeric string (e.g. '10' or '10.99')."),
  body("options").optional().isArray().withMessage("Options must be an array."),
];

export const updateDishValidator = [
  body("name").optional().isString().withMessage("Dish name must be a string."),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string."),
  body("price")
    .optional()
    .isString()
    .withMessage("Price must be a string.")
    .if(body("price").exists())
    .matches(/^\d+(\.\d{1,2})?$/)
    .withMessage("Price must be a numeric string (e.g. '10' or '10.99')."),
  body("options").optional().isArray().withMessage("Options must be an array."),
];
