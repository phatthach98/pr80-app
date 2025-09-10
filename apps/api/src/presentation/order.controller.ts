import { Request, Response } from "express";
import { OrderUseCase } from "@application/use-case";
import { ORDER_USE_CASE } from "@infras/di/tokens";
import { container } from "@infras/di";
import { EOrderStatus, EOrderType } from "@pr80-app/shared-contracts";
import {
  OrderResponseDTO,
  CreateOrderRequestDTO,
  UpdateOrderRequestDTO,
  CreateAdditionalOrderRequestDTO,
  AddOrderItemRequestDTO,
  UpdateOrderItemQuantityRequestDTO,
} from "@pr80-app/shared-contracts";
import { NotFoundError, UnauthorizedError } from "@application/errors";

// Resolve use case at the top level outside the class
const orderUseCase = container.resolve<OrderUseCase>(ORDER_USE_CASE);

export class OrderController {
  static async getAllOrders(req: Request, res: Response<OrderResponseDTO[]>) {
    const orders = await orderUseCase.getOrders();
    res.json(orders ? orders.map((order) => order.toJSON()) : []);
  }

  static async getOrderById(
    req: Request<{ orderId: string }>,
    res: Response<OrderResponseDTO>
  ) {
    const { orderId } = req.params;
    const order = await orderUseCase.getOrderById(orderId);
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    res.json(order.toJSON());
  }

  static async getOrdersByStatus(
    req: Request<{}, {}, {}, { status: EOrderStatus }>,
    res: Response<OrderResponseDTO[]>
  ) {
    const { status } = req.query;
    const orders = await orderUseCase.getOrdersByStatus(status);
    res.json(orders ? orders.map((order) => order.toJSON()) : []);
  }

  static async getOrdersByType(
    req: Request<{}, {}, {}, { type: EOrderType }>,
    res: Response<OrderResponseDTO[]>
  ) {
    const { type } = req.query;
    const orders = await orderUseCase.getOrdersByType(type);
    res.json(orders ? orders.map((order) => order.toJSON()) : []);
  }

  static async getOrdersByCreatedBy(
    req: Request<{}, {}, {}, { userId: string }>,
    res: Response<OrderResponseDTO[]>
  ) {
    const { userId } = req.query;
    const orders = await orderUseCase.getOrdersByCreatedBy(userId);
    res.json(orders ? orders.map((order) => order.toJSON()) : []);
  }

  static async getOrderWithLinkedOrders(
    req: Request<{ orderId: string }>,
    res: Response<{
      mainOrder: OrderResponseDTO;
      linkedOrders: OrderResponseDTO[];
    }>
  ) {
    const { orderId } = req.params;
    const result = await orderUseCase.getOrderWithLinkedOrders(orderId);

    res.json({
      mainOrder: result.mainOrder.toJSON(),
      linkedOrders: result.linkedOrders.map((order) => order.toJSON()),
    });
  }

  static async createOrder(
    req: Request<{}, {}, CreateOrderRequestDTO>,
    res: Response<OrderResponseDTO>
  ) {
    const { table, type, dishes = [], linkedOrderId, note } = req.body;
    // Get user ID from authenticated request
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedError("User not authenticated");
    }

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
    console.log("processedDishes", processedDishes[0].selectedOptions);
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
    req: Request<{}, {}, CreateAdditionalOrderRequestDTO>,
    res: Response<OrderResponseDTO>
  ) {
    const { originalOrderId, dishes, note } = req.body;
    // Get user ID from authenticated request
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedError("User not authenticated");
    }

    const order = await orderUseCase.createAdditionalOrder(
      originalOrderId,
      userId,
      dishes,
      note
    );

    res.status(201).json(order.toJSON());
  }

  static async updateOrder(
    req: Request<{ orderId: string }, {}, UpdateOrderRequestDTO>,
    res: Response<OrderResponseDTO>
  ) {
    const { orderId } = req.params;
    const changes = req.body;

    const order = await orderUseCase.updateOrder(orderId, changes);
    if (order) {
      res.json(order.toJSON());
    } else {
      res.status(404).json({ message: "Order not found" } as any);
    }
  }

  static async updateOrderStatus(
    req: Request<{ orderId: string }, {}, { status: EOrderStatus }>,
    res: Response<OrderResponseDTO>
  ) {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await orderUseCase.updateOrderStatus(orderId, status);
    if (order) {
      res.json(order.toJSON());
    } else {
      res.status(404).json({ message: "Order not found" } as any);
    }
  }

  static async updateOrderTable(
    req: Request<{ orderId: string }, {}, { table: string }>,
    res: Response<OrderResponseDTO>
  ) {
    const { orderId } = req.params;
    const { table } = req.body;

    const order = await orderUseCase.updateOrderTable(orderId, table);
    if (order) {
      res.json(order.toJSON());
    } else {
      res.status(404).json({ message: "Order not found" } as any);
    }
  }

  static async deleteOrder(
    req: Request<{ orderId: string }>,
    res: Response<{ success: boolean; message: string }>
  ) {
    const { orderId } = req.params;
    const result = await orderUseCase.deleteOrder(orderId);
    res.json(result);
  }

  static async addOrUpdateOrderItem(
    req: Request<{ orderId?: string }, {}, AddOrderItemRequestDTO>,
    res: Response<OrderResponseDTO>
  ) {
    // Get orderId from URL params if available, otherwise from body for backward compatibility
    const orderId = req.params.orderId || req.body.orderId;
    const { dishId, quantity, selectedOptions, takeAway, table } = req.body;

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
    req: Request<{ orderId: string; dishItemId: string }>,
    res: Response<OrderResponseDTO>
  ) {
    const { orderId, dishItemId } = req.params;

    const order = await orderUseCase.removeOrderItem(orderId, dishItemId);
    res.json(order.toJSON());
  }

  static async updateOrderItemQuantity(
    req: Request<
      { orderId: string; dishItemId: string },
      {},
      UpdateOrderItemQuantityRequestDTO
    >,
    res: Response<OrderResponseDTO>
  ) {
    const { orderId, dishItemId } = req.params;
    const { quantity } = req.body;

    const order = await orderUseCase.updateOrderItemQuantity(
      orderId,
      dishItemId,
      quantity
    );
    res.json(order.toJSON());
  }
}
