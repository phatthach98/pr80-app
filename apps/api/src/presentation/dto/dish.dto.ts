import { body } from "express-validator";
import { DishOption } from "@domain/entity/dish-option";

export interface DishResponse {
  id: string;
  name: string;
  description: string;
  price: string;
  options: { id: string }[];
}

export interface DishWithOptionsResponse extends DishResponse {
  optionDetails: DishOption[];
}

export interface CreateDishRequest {
  name: string;
  description: string;
  price: string;
  options?: { id: string }[];
}

export interface UpdateDishRequest {
  name?: string;
  description?: string;
  price?: string;
  options?: { id: string }[];
}

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
