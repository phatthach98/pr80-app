import { body, param } from "express-validator";
import { OrderStatus, OrderType } from "@pr80-app/shared-contracts";

// Validators
export const createOrderValidator = [
  body("table")
    .notEmpty()
    .withMessage("Table is required.")
    .isString()
    .withMessage("Table must be a string."),
  body("type")
    .optional()
    .isIn(Object.values(OrderType))
    .withMessage("Type must be a valid OrderType."),
  body("dishes")
    .isArray({ min: 1 })
    .withMessage("At least one dish is required."),
  body("dishes.*.dishId")
    .optional()
    .isString()
    .withMessage("Dish ID must be a string."),
  body("dishes.*.quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer."),
  body("dishes.*.selectedOptions")
    .optional()
    .isArray()
    .withMessage("Selected options must be an array."),
  body("dishes.*.selectedOptions.*.name")
    .optional()
    .isString()
    .withMessage("Option name must be a string."),
  body("dishes.*.selectedOptions.*.value")
    .optional()
    .isString()
    .withMessage("Option value must be a string."),
  body("dishes.*.takeAway")
    .optional()
    .isBoolean()
    .withMessage("Take away must be a boolean."),
  body("linkedOrderId")
    .optional()
    .isString()
    .withMessage("Linked order ID must be a string."),
  body("note").optional().isString().withMessage("Note must be a string."),
];

export const createAdditionalOrderValidator = [
  body("originalOrderId")
    .notEmpty()
    .withMessage("Original order ID is required.")
    .isString()
    .withMessage("Original order ID must be a string."),
  body("dishes")
    .notEmpty()
    .withMessage("Dishes are required.")
    .isArray()
    .withMessage("Dishes must be an array."),
  body("dishes.*.dishId")
    .notEmpty()
    .withMessage("Dish ID is required.")
    .isString()
    .withMessage("Dish ID must be a string."),
  body("dishes.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required.")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer."),
  body("dishes.*.selectedOptions")
    .optional()
    .isArray()
    .withMessage("Selected options must be an array."),
  body("dishes.*.selectedOptions.*.name")
    .optional()
    .isString()
    .withMessage("Option name must be a string."),
  body("dishes.*.selectedOptions.*.value")
    .optional()
    .isString()
    .withMessage("Option value must be a string."),
  body("dishes.*.takeAway")
    .optional()
    .isBoolean()
    .withMessage("Take away must be a boolean."),
  body("note").optional().isString().withMessage("Note must be a string."),
];

export const updateOrderValidator = [
  body("table").optional().isString().withMessage("Table must be a string."),
  body("status")
    .optional()
    .isIn(Object.values(OrderStatus))
    .withMessage("Status must be a valid OrderStatus."),
  body("type")
    .optional()
    .isIn(Object.values(OrderType))
    .withMessage("Type must be a valid OrderType."),
  body("note").optional().isString().withMessage("Note must be a string."),
];

export const addOrderItemValidator = [ 
  body("dishId")
    .notEmpty()
    .withMessage("Dish ID is required.")
    .isString()
    .withMessage("Dish ID must be a string."),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required.")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer."),
  body("selectedOptions")
    .optional()
    .isArray()
    .withMessage("Selected options must be an array."),
  body("selectedOptions.*.name")
    .optional()
    .isString()
    .withMessage("Option name must be a string."),
  body("selectedOptions.*.value")
    .optional()
    .isString()
    .withMessage("Option value must be a string."),
  body("takeAway")
    .optional()
    .isBoolean()
    .withMessage("Take away must be a boolean."),
  body("table").optional().isString().withMessage("Table must be a string."),
];

export const updateOrderItemQuantityValidator = [
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required.")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer."),
];

export const updateOrderStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required.")
    .isIn(Object.values(OrderStatus))
    .withMessage("Status must be a valid OrderStatus."),
];

export const updateOrderTableValidator = [
  body("table")
    .notEmpty()
    .withMessage("Table is required.")
    .isString()
    .withMessage("Table must be a string."),
];

export const orderIdParamValidator = [
  param("orderId")
    .notEmpty()
    .withMessage("Order ID is required.")
    .isString()
    .withMessage("Order ID must be a string."),
];

export const dishIdParamValidator = [
  param("dishId")
    .notEmpty()
    .withMessage("Dish ID is required.")
    .isString()
    .withMessage("Dish ID must be a string."),
];

export const dishItemIdParamValidator = [
  param("dishItemId")
    .notEmpty()
    .withMessage("Dish Item ID is required.")
    .isString()
    .withMessage("Dish Item ID must be a string."),
];
