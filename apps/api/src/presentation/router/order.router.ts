import { Router } from "express";
import { asyncHandler } from "@presentation/middleware/async-handler.middleware";
import { OrderController } from "@presentation/order.controller";
import { requestValidator } from "@presentation/middleware/request-validator.middleware";
import {
  createOrderValidator,
  updateOrderValidator,
  createAdditionalOrderValidator,
  addOrderItemValidator,
  updateOrderItemQuantityValidator,
  updateOrderStatusValidator,
  updateOrderTableValidator,
  orderIdParamValidator,
  dishItemIdParamValidator,
} from "@presentation/validators/order.validator";

export const orderRouter = Router();

// Get all orders
orderRouter.get("/orders", asyncHandler(OrderController.getAllOrders));

// Get orders by status
orderRouter.get(
  "/orders/status",
  asyncHandler(OrderController.getOrdersByStatus)
);

// Get orders by type
orderRouter.get("/orders/type", asyncHandler(OrderController.getOrdersByType));

// Get orders by created by
orderRouter.get(
  "/orders/user",
  asyncHandler(OrderController.getOrdersByCreatedBy)
);

// Get order by ID
orderRouter.get(
  "/orders/:orderId",
  orderIdParamValidator,
  requestValidator,
  asyncHandler(OrderController.getOrderById)
);

// Get order with linked orders
orderRouter.get(
  "/orders/:orderId/linked",
  orderIdParamValidator,
  requestValidator,
  asyncHandler(OrderController.getOrderWithLinkedOrders)
);

// Create a new order
orderRouter.post(
  "/orders",
  createOrderValidator,
  requestValidator,
  asyncHandler(OrderController.createOrder)
);

// Create an additional order
orderRouter.post(
  "/orders/additional",
  createAdditionalOrderValidator,
  requestValidator,
  asyncHandler(OrderController.createAdditionalOrder)
);

// Add a new order item to an existing order
orderRouter.post(
  "/orders/:orderId/items",
  orderIdParamValidator,
  addOrderItemValidator,
  requestValidator,
  asyncHandler(OrderController.addOrUpdateOrderItem)
);

// Update an order
orderRouter.put(
  "/orders/:orderId",
  orderIdParamValidator,
  updateOrderValidator,
  requestValidator,
  asyncHandler(OrderController.updateOrder)
);

// Update order status based on current status
orderRouter.patch(
  "/orders/:orderId/status",
  orderIdParamValidator,
  requestValidator,
  asyncHandler(OrderController.updateOrderStatusBasedOnCurrentStatus)
);

// Update order table
orderRouter.patch(
  "/orders/:orderId/table",
  orderIdParamValidator,
  updateOrderTableValidator,
  requestValidator,
  asyncHandler(OrderController.updateOrderTable)
);

// Update order item quantity
orderRouter.patch(
  "/orders/:orderId/items/:dishItemId/quantity",
  [...orderIdParamValidator, ...dishItemIdParamValidator],
  updateOrderItemQuantityValidator,
  requestValidator,
  asyncHandler(OrderController.updateOrderItemQuantity)
);

// Remove order item
orderRouter.delete(
  "/orders/:orderId/items/:dishItemId",
  [...orderIdParamValidator, ...dishItemIdParamValidator],
  requestValidator,
  asyncHandler(OrderController.removeOrderItem)
);

// Delete an order
orderRouter.delete(
  "/orders/:orderId",
  orderIdParamValidator,
  requestValidator,
  asyncHandler(OrderController.deleteOrder)
);
