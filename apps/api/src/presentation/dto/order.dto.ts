import { body, param } from "express-validator";
import { OrderStatus, OrderType } from "@domain/entity/order";

// Selected option in a request
export interface SelectedOptionRequest {
  optionId: string;
  valueId: string;
}

// Order item in a request
export interface OrderItemRequest {
  dishId: string;
  quantity: number;
  selectedOptions: SelectedOptionRequest[];
  takeAway: boolean;
}

// Response DTO for order dish items
export interface OrderDishItemResponse {
  id: string; // Unique identifier for this specific dish item
  dishId: string;
  name: string;
  quantity: number;
  price: number;
  selectedOptions: {
    name: string;
    value: string;
    extraPrice: number;
  }[];
  takeAway: boolean;
}

// Response DTO for orders
export interface OrderResponse {
  id: string;
  linkedOrderId: string | null;
  createdBy: string;
  status: OrderStatus;
  table: string;
  totalAmount: number;
  type: OrderType;
  note: string;
  dishes: OrderDishItemResponse[];
}

// DTO for creating a new order
export interface CreateOrderRequest {
  table: string;
  type?: OrderType;
  dishes?: OrderItemRequest[];
  linkedOrderId?: string;
  note?: string;
}

// DTO for creating an additional order
export interface CreateAdditionalOrderRequest {
  originalOrderId: string;
  dishes: OrderItemRequest[];
  note?: string;
}

// DTO for updating an order
export interface UpdateOrderRequest {
  table?: string;
  status?: OrderStatus;
  type?: OrderType;
  note?: string;
}

// DTO for adding or updating an order item
export interface AddOrderItemRequest {
  orderId?: string;
  dishId: string;
  quantity: number;
  selectedOptions: SelectedOptionRequest[];
  takeAway: boolean;
  table?: string;
}

// DTO for updating order item quantity
export interface UpdateOrderItemQuantityRequest {
  quantity: number;
}

// DTO for updating order status
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// DTO for updating order table
export interface UpdateOrderTableRequest {
  table: string;
}

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
    .optional()
    .isArray()
    .withMessage("Dishes must be an array."),
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
  body("dishes.*.selectedOptions.*.optionId")
    .optional()
    .isString()
    .withMessage("Option ID must be a string."),
  body("dishes.*.selectedOptions.*.valueId")
    .optional()
    .isString()
    .withMessage("Value ID must be a string."),
  body("dishes.*.takeAway")
    .optional()
    .isBoolean()
    .withMessage("Take away must be a boolean."),
  body("linkedOrderId")
    .optional()
    .isString()
    .withMessage("Linked order ID must be a string."),
  body("note")
    .optional()
    .isString()
    .withMessage("Note must be a string.")
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
  body("dishes.*.selectedOptions.*.optionId")
    .optional()
    .isString()
    .withMessage("Option ID must be a string."),
  body("dishes.*.selectedOptions.*.valueId")
    .optional()
    .isString()
    .withMessage("Value ID must be a string."),
  body("dishes.*.takeAway")
    .optional()
    .isBoolean()
    .withMessage("Take away must be a boolean."),
  body("note")
    .optional()
    .isString()
    .withMessage("Note must be a string.")
];

export const updateOrderValidator = [
  body("table")
    .optional()
    .isString()
    .withMessage("Table must be a string."),
  body("status")
    .optional()
    .isIn(Object.values(OrderStatus))
    .withMessage("Status must be a valid OrderStatus."),
  body("type")
    .optional()
    .isIn(Object.values(OrderType))
    .withMessage("Type must be a valid OrderType."),
  body("note")
    .optional()
    .isString()
    .withMessage("Note must be a string.")
];

export const addOrderItemValidator = [
  body("orderId")
    .optional()
    .isString()
    .withMessage("Order ID must be a string."),
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
  body("selectedOptions.*.optionId")
    .optional()
    .isString()
    .withMessage("Option ID must be a string."),
  body("selectedOptions.*.valueId")
    .optional()
    .isString()
    .withMessage("Value ID must be a string."),
  body("takeAway")
    .optional()
    .isBoolean()
    .withMessage("Take away must be a boolean."),
  body("table")
    .optional()
    .isString()
    .withMessage("Table must be a string.")
];

export const updateOrderItemQuantityValidator = [
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required.")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer.")
];

export const updateOrderStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required.")
    .isIn(Object.values(OrderStatus))
    .withMessage("Status must be a valid OrderStatus.")
];

export const updateOrderTableValidator = [
  body("table")
    .notEmpty()
    .withMessage("Table is required.")
    .isString()
    .withMessage("Table must be a string.")
];

export const orderIdParamValidator = [
  param("id")
    .notEmpty()
    .withMessage("Order ID is required.")
    .isString()
    .withMessage("Order ID must be a string.")
];

export const dishIdParamValidator = [
  param("dishId")
    .notEmpty()
    .withMessage("Dish ID is required.")
    .isString()
    .withMessage("Dish ID must be a string.")
];

export const dishItemIdParamValidator = [
  param("dishItemId")
    .notEmpty()
    .withMessage("Dish Item ID is required.")
    .isString()
    .withMessage("Dish Item ID must be a string.")
];