import { body, param } from "express-validator";

export const createDishOptionValidator = [
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("description")
    .isString()
    .notEmpty()
    .withMessage("Description is required"),
  body("options").isArray().withMessage("Options must be an array"),
  body("options.*.label")
    .isString()
    .notEmpty()
    .withMessage("Option label is required"),
  body("options.*.value")
    .isString()
    .notEmpty()
    .withMessage("Option value is required"),
  body("options.*.extraPrice")
    .isString()
    .withMessage("Extra price must be a string"),
];

export const updateDishOptionValidator = [
  param("id")
    .isString()
    .notEmpty()
    .withMessage("Valid dish option ID is required"),
  body("name").optional().isString().withMessage("Name must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("options").optional().isArray().withMessage("Options must be an array"),
  body("options.*.label")
    .optional()
    .isString()
    .withMessage("Option label must be a string"),
  body("options.*.value")
    .optional()
    .isString()
    .withMessage("Option value must be a string"),
  body("options.*.extraPrice")
    .isString()
    .withMessage("Extra price must be a string"),
];

export const dishOptionIdValidator = [
  param("id")
    .isString()
    .notEmpty()
    .withMessage("Valid dish option ID is required"),
];
