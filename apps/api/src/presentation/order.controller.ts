import { Request, Response } from "express";
import { OrderUseCase } from "@application/use-case";
import { ORDER_USE_CASE } from "@infras/di/tokens";
import { container } from "@infras/di";
import { EOrderStatus, EOrderType } from "@pr80-app/shared-contracts";
import { OrderFilters } from "@application/interface/repository/order-repo.interface";
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
  static async getAllOrders(
    req: Request<
      {},
      {},
      {},
      {
        status?: EOrderStatus;
        type?: EOrderType;
        userId?: string;
        table?: string;
        createdAt?: string;
      }
    >,
    res: Response<OrderResponseDTO[]>
  ) {
    // Build filters object based on query parameters using a mapping object
    const filterMapping: Record<string, keyof OrderFilters> = {
      status: "status",
      type: "type",
      userId: "createdBy",
      createdAt: "createdAt",
      table: "table",
    };

    // Create filters object by mapping query params to filter properties
    const filters: OrderFilters = Object.entries(req.query)
      .filter(
        ([key, value]) =>
          key in filterMapping && value !== undefined && value !== ""
      )
      .reduce((acc, [key, value]) => {
        const filterKey = filterMapping[key];
        
        // Pass createdAt directly as a string (YYYY-MM-DD format)
        // The repository will handle the date range creation
        if (key === 'createdAt' && typeof value === 'string') {
          // Validate that the string looks like a date (simple check)
          if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
            return { ...acc, [filterKey]: value };
          }
          // If invalid date format, skip this filter
          console.warn(`Invalid date format for createdAt: ${value}`);
          return acc;
        }
        
        return { ...acc, [filterKey]: value };
      }, {});

    const orders = await orderUseCase.getOrders(
      Object.keys(filters).length > 0 ? filters : undefined
    );
    res.json(orders ? orders.map((order) => order.toJSON()) : []);
  }

  static async getOrderById(
    req: Request<{ orderId: string }>,
    res: Response<OrderResponseDTO>
  ) {
    const { orderId } = req.params;
    const order = await orderUseCase.getOrderWithLinkedOrders(orderId);
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    res.json({
      ...order.mainOrder.toJSON(),
      linkedOrders: order.linkedOrders.map((order) => order.toJSON()),
    });
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
    const {
      table,
      type,
      dishes: orderDishes = [],
      linkedOrderId,
      note,
      customerCount,
    } = req.body;
    // Get user ID from authenticated request
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedError("User not authenticated");
    }

    // Process dishes if provided
    const processedDishes = [];
    if (orderDishes && orderDishes.length > 0) {
      for (const orderDish of orderDishes) {
        const processedDish = await orderUseCase.calculateDishWithOptions(
          orderDish.dishId,
          orderDish.selectedOptions,
          orderDish.quantity,
          orderDish.takeAway,
          orderDish.note
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
      note,
      customerCount
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

  static async updateOrderStatusBasedOnCurrentStatus(
    req: Request<{ orderId: string }>,
    res: Response<OrderResponseDTO>
  ) {
    const { orderId } = req.params;

    const order = await orderUseCase.updateOrderStatusBasedOnCurrentStatus(
      orderId
    );
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
    const { dishId, quantity, selectedOptions, takeAway, table, note } =
      req.body;

    // Get user ID from authenticated request
    const userId = req.user?.userId || "";

    const order = await orderUseCase.addOrUpdateOrderItem(
      orderId || null,
      userId,
      { dishId, quantity, selectedOptions, takeAway, note: note || "" },
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
