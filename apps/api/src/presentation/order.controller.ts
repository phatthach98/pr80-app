import { Request, Response } from "express";
import { OrderUseCase } from "@application/use-case";
import { ORDER_USE_CASE } from "@infras/di/tokens";
import { container } from "@infras/di";
import { OrderStatus } from "@domain/entity/order";
import {
  OrderResponse,
  CreateOrderRequest,
  UpdateOrderRequest,
  CreateAdditionalOrderRequest,
  AddOrderItemRequest,
  UpdateOrderItemQuantityRequest,
} from "./dto/order.dto";

// Resolve use case at the top level outside the class
const orderUseCase = container.resolve<OrderUseCase>(ORDER_USE_CASE);

export class OrderController {
  static async getAllOrders(req: Request, res: Response<OrderResponse[]>) {
    const orders = await orderUseCase.getOrders();
    res.json(orders ? orders.map((order) => order.toJSON()) : []);
  }

  static async getOrderById(
    req: Request<{ id: string }>,
    res: Response<OrderResponse>
  ) {
    const { id } = req.params;
    const order = await orderUseCase.getOrderById(id);
    res.json(order.toJSON());
  }

  static async getOrdersByStatus(
    req: Request<{}, {}, {}, { status: OrderStatus }>,
    res: Response<OrderResponse[]>
  ) {
    const { status } = req.query;
    const orders = await orderUseCase.getOrdersByStatus(status);
    res.json(orders ? orders.map((order) => order.toJSON()) : []);
  }

  static async getOrdersByCreatedBy(
    req: Request<{}, {}, {}, { userId: string }>,
    res: Response<OrderResponse[]>
  ) {
    const { userId } = req.query;
    const orders = await orderUseCase.getOrdersByCreatedBy(userId);
    res.json(orders ? orders.map((order) => order.toJSON()) : []);
  }

  static async getOrderWithLinkedOrders(
    req: Request<{ id: string }>,
    res: Response<{ mainOrder: OrderResponse; linkedOrders: OrderResponse[] }>
  ) {
    const { id } = req.params;
    const result = await orderUseCase.getOrderWithLinkedOrders(id);

    res.json({
      mainOrder: result.mainOrder.toJSON(),
      linkedOrders: result.linkedOrders.map((order) => order.toJSON()),
    });
  }

  static async createOrder(
    req: Request<{}, {}, CreateOrderRequest>,
    res: Response<OrderResponse>
  ) {
    const { table, type, dishes = [], linkedOrderId, note } = req.body;
    // Get user ID from authenticated request
    const userId = req.user?.userId || "";

    // Process dishes if provided
    const processedDishes = [];
    if (dishes && dishes.length > 0) {
      for (const dish of dishes) {
        const processedDish = await orderUseCase.calculateDishWithOptions(
          dish.dishId,
          dish.selectedOptions,
          dish.quantity,
          dish.takeAway
        );
        processedDishes.push(processedDish);
      }
    }

    const order = await orderUseCase.createOrder(
      userId,
      table,
      type,
      processedDishes,
      linkedOrderId,
      note
    );

    res.status(201).json(order.toJSON());
  }

  static async createAdditionalOrder(
    req: Request<{}, {}, CreateAdditionalOrderRequest>,
    res: Response<OrderResponse>
  ) {
    const { originalOrderId, dishes, note } = req.body;
    // Get user ID from authenticated request
    const userId = req.user?.userId || "";

    const order = await orderUseCase.createAdditionalOrder(
      originalOrderId,
      userId,
      dishes,
      note
    );

    res.status(201).json(order.toJSON());
  }

  static async updateOrder(
    req: Request<{ id: string }, {}, UpdateOrderRequest>,
    res: Response<OrderResponse>
  ) {
    const { id } = req.params;
    const changes = req.body;

    const order = await orderUseCase.updateOrder(id, changes);
    if (order) {
      res.json(order.toJSON());
    } else {
      res.status(404).json({ message: "Order not found" } as any);
    }
  }

  static async updateOrderStatus(
    req: Request<{ id: string }, {}, { status: OrderStatus }>,
    res: Response<OrderResponse>
  ) {
    const { id } = req.params;
    const { status } = req.body;

    const order = await orderUseCase.updateOrderStatus(id, status);
    if (order) {
      res.json(order.toJSON());
    } else {
      res.status(404).json({ message: "Order not found" } as any);
    }
  }

  static async updateOrderTable(
    req: Request<{ id: string }, {}, { table: string }>,
    res: Response<OrderResponse>
  ) {
    const { id } = req.params;
    const { table } = req.body;

    const order = await orderUseCase.updateOrderTable(id, table);
    if (order) {
      res.json(order.toJSON());
    } else {
      res.status(404).json({ message: "Order not found" } as any);
    }
  }

  static async deleteOrder(
    req: Request<{ id: string }>,
    res: Response<{ success: boolean; message: string }>
  ) {
    const { id } = req.params;
    const result = await orderUseCase.deleteOrder(id);
    res.json(result);
  }

  static async addOrUpdateOrderItem(
    req: Request<{}, {}, AddOrderItemRequest>,
    res: Response<OrderResponse>
  ) {
    const { orderId, dishId, quantity, selectedOptions, takeAway, table } =
      req.body;
    // Get user ID from authenticated request
    const userId = req.user?.userId || "";

    const order = await orderUseCase.addOrUpdateOrderItem(
      orderId || null,
      userId,
      { dishId, quantity, selectedOptions, takeAway },
      table
    );

    res.status(orderId ? 200 : 201).json(order.toJSON());
  }

  static async removeOrderItem(
    req: Request<{ id: string; dishItemId: string }>,
    res: Response<OrderResponse>
  ) {
    const { id, dishItemId } = req.params;

    const order = await orderUseCase.removeOrderItem(id, dishItemId);
    res.json(order.toJSON());
  }

  static async updateOrderItemQuantity(
    req: Request<
      { id: string; itemId: string },
      {},
      UpdateOrderItemQuantityRequest
    >,
    res: Response<OrderResponse>
  ) {
    const { id, itemId } = req.params;
    const { quantity } = req.body;

    const order = await orderUseCase.updateOrderItemQuantity(
      id,
      itemId,
      quantity
    );
    res.json(order.toJSON());
  }
}
