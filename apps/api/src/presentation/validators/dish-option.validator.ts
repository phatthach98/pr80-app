import { body, param } from "express-validator";

export const createDishOptionValidator = [
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("description")
    .isString()
    .notEmpty()
    .withMessage("Description is required"),
  body("optionItems").isArray().withMessage("Options must be an array"),
  body("optionItems.*.label")
    .isString()
    .notEmpty()
    .withMessage("Option label is required"),
  body("optionItems.*.value")
    .isString()
    .notEmpty()
    .withMessage("Option value is required"),
  body("optionItems.*.extraPrice")
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
  body("optionItems")
    .optional()
    .isArray()
    .withMessage("Options must be an array"),
  body("optionItems.*.label")
    .optional()
    .isString()
    .withMessage("Option label must be a string"),
  body("optionItems.*.value")
    .optional()
    .isString()
    .withMessage("Option value must be a string"),
  body("optionItems.*.extraPrice")
    .optional()
    .isString()
    .withMessage("Extra price must be a string"),
];

export const dishOptionIdValidator = [
  param("id")
    .isString()
    .notEmpty()
    .withMessage("Valid dish option ID is required"),
];
