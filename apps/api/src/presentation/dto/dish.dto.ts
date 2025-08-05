import { body } from "express-validator";

export interface DishDto {
  id: string;
  name: string;
  description: string;
  price: number;
  options: { id: string }[];
}

export interface CreateDishDto {
  name: string;
  description: string;
  price: number;
  options?: { id: string }[];
}

export interface UpdateDishDto {
  name?: string;
  description?: string;
  price?: number;
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
    .isNumeric()
    .withMessage("Price must be a number.")
    .custom((value) => value >= 0)
    .withMessage("Price cannot be negative."),
  body("options")
    .optional()
    .isArray()
    .withMessage("Options must be an array.")
];

export const updateDishValidator = [
  body("name")
    .optional()
    .isString()
    .withMessage("Dish name must be a string."),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string."),
  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number.")
    .custom((value) => value >= 0)
    .withMessage("Price cannot be negative."),
  body("options")
    .optional()
    .isArray()
    .withMessage("Options must be an array.")
];