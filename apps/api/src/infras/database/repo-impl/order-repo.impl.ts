import {
  OrderRepository,
  OrderFilters,
} from "@application/interface/repository/order-repo.interface";
import { Order } from "@domain/entity/order";
import { OrderSchema } from "../schemas/order-schema";
import { formatDecimal } from "../utils/mongodb.util";
import { TZDate } from "@date-fns/tz";
import { endOfDay, startOfDay } from "date-fns";

export class OrderRepositoryImpl implements OrderRepository {
  // Helper method to create a pipeline with user lookup
  private createUserLookupPipeline(initialMatch?: any): any[] {
    const pipeline: any[] = [];

    // Add initial match stage if provided
    if (initialMatch && Object.keys(initialMatch).length > 0) {
      pipeline.push({ $match: initialMatch });
    }

    // Add lookup stage to get user details
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdByUser",
      },
    });

    // Unwind the createdByUser array to get a single object
    pipeline.push({
      $unwind: {
        path: "$createdByUser",
        preserveNullAndEmptyArrays: true,
      },
    });

    // Project to shape the response - keep only needed user fields
    pipeline.push({
      $project: {
        _id: 1,
        linkedOrderId: 1,
        createdBy: 1,
        status: 1,
        table: 1,
        totalAmount: 1,
        type: 1,
        note: 1,
        dishes: 1,
        customerCount: 1,
        createdAt: 1,
        updatedAt: 1,
        createdByUser: {
          _id: "$createdByUser._id",
          name: "$createdByUser.name",
          phoneNumber: "$createdByUser.phoneNumber",
          roles: "$createdByUser.roles",
        },
      },
    });

    return pipeline;
  }
  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    try {
      // Process filters and build match stage
      const matchStage: any = {};

      if (filters) {
        // Track invalid filter keys for logging
        const invalidFilterKeys: string[] = [];
        const invalidFilterTypes: Record<string, string> = {};

        Object.entries(filters).forEach(([key, value]) => {
          // Skip undefined values and keys starting with '$' (MongoDB operators)
          if (value === undefined || key.startsWith("$")) {
            if (key.startsWith("$")) {
              invalidFilterKeys.push(key);
              invalidFilterTypes[key] = "rejected_operator";
            }
            return;
          }

          // Special handling for createdAt date filter
          if (key === "createdAt") {
            try {
              let tzDate;

              // Handle both string and Date types
              if (typeof value === "string") {
                // Parse YYYY-MM-DD format from frontend
                if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                  // Create a date in the Asia/Ho_Chi_Minh timezone
                  tzDate = new TZDate(`${value}T00:00:00`, "Asia/Ho_Chi_Minh");
                } else {
                  throw new Error("Invalid date format. Expected YYYY-MM-DD");
                }
              } else if (value instanceof Date) {
                // If it's already a Date object
                tzDate = new TZDate(value, "Asia/Ho_Chi_Minh");
              } else {
                throw new Error(
                  `Invalid createdAt value type: ${typeof value}`
                );
              }

              // Create date range in the user's timezone (Asia/Ho_Chi_Minh)
              matchStage[key] = {
                $gte: startOfDay(tzDate),
                $lte: endOfDay(tzDate),
              };
            } catch (error) {
              // Log error type without including the original value
              const errorType =
                error instanceof Error ? "validation_error" : "unknown_error";
              const errorMessage =
                error instanceof Error
                  ? error.message.replace(/:.+/, "")
                  : "Unknown error";

              console.warn(
                `Error processing ${key} filter: ${errorMessage} (${errorType})`
              );

              invalidFilterKeys.push(key);
              invalidFilterTypes[key] = errorType;
            }
          } else {
            // For all other filters, only accept primitive values
            const valueType = typeof value;
            if (
              valueType === "string" ||
              valueType === "number" ||
              valueType === "boolean"
            ) {
              // For all other filters, use direct equality with primitive values only
              matchStage[key] = value;
            } else {
              invalidFilterKeys.push(key);
              invalidFilterTypes[key] = `invalid_type_${valueType}`;
            }
          }
        });

        // Log any invalid filters that were rejected (keys only, no values)
        if (invalidFilterKeys.length > 0) {
          console.warn(
            `Rejected ${
              invalidFilterKeys.length
            } invalid order filters. Keys: [${invalidFilterKeys.join(", ")}]`
          );
        }
      }

      // Get the base pipeline with user lookup
      const pipeline = this.createUserLookupPipeline(matchStage);

      // Add sorting
      pipeline.push({ $sort: { createdAt: 1 } });

      const orders = await OrderSchema.aggregate(pipeline).exec();

      if (!orders || orders.length === 0) {
        return [];
      }

      return orders.map((order) => this.mapToOrderEntity(order));
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      // Use the reusable pipeline with a match for the specific ID
      const pipeline = this.createUserLookupPipeline({ _id: id });

      const orders = await OrderSchema.aggregate(pipeline).exec();

      if (!orders || orders.length === 0) {
        return null;
      }

      return this.mapToOrderEntity(orders[0]);
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      return null;
    }
  }

  async getLinkedOrders(orderId: string): Promise<Order[] | null> {
    try {
      // Use the reusable pipeline with a match for linked orders
      const pipeline = this.createUserLookupPipeline({
        linkedOrderId: orderId,
      });

      const orders = await OrderSchema.aggregate(pipeline).exec();

      if (!orders || orders.length === 0) {
        return [];
      }

      return orders.map((order) => this.mapToOrderEntity(order));
    } catch (error) {
      console.error("Error fetching linked orders:", error);
      return null;
    }
  }

  async create(order: Order): Promise<Order> {
    try {
      // Create with _id set to domain id
      await OrderSchema.create({
        _id: order.id, // Map domain id to MongoDB _id
        linkedOrderId: order.linkedOrderId,
        createdBy: order.createdBy,
        status: order.status,
        table: order.table,
        totalAmount: order.totalAmount,
        type: order.type,
        note: order.note,
        dishes: order.dishes,
        customerCount: order.customerCount,
      });

      return order;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async update(order: Order): Promise<Order | null> {
    try {
      // Find by MongoDB _id
      const updatedOrder = await OrderSchema.findOneAndUpdate(
        { _id: order.id },
        {
          $set: {
            linkedOrderId: order.linkedOrderId,
            status: order.status,
            table: order.table,
            totalAmount: order.totalAmount,
            type: order.type,
            note: order.note,
            dishes: order.dishes,
            customerCount: order.customerCount,
          },
        },
        { new: true }
      ).lean();

      if (!updatedOrder) {
        return null;
      }

      const updatedOrderEntity = this.mapToOrderEntity(updatedOrder);

      return updatedOrderEntity;
    } catch (error) {
      console.error("Error updating order:", error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Delete by MongoDB _id
      const result = await OrderSchema.findOneAndDelete({ _id: id });

      return !!result;
    } catch (error) {
      console.error("Error deleting order:", error);
      return false;
    }
  }

  // Helper method to convert MongoDB document to domain entity
  private mapToOrderEntity(orderDoc: any): Order {
    const orderDishes = orderDoc.dishes.map((orderDishItem: any) => ({
      id: orderDishItem.id,
      basePrice: formatDecimal(orderDishItem.basePrice),
      totalPrice: formatDecimal(orderDishItem.totalPrice),
      name: orderDishItem.name,
      quantity: orderDishItem.quantity,
      takeAway: orderDishItem.takeAway,
      dishId: orderDishItem.dishId,
      selectedOptions: orderDishItem.selectedOptions.map((option: any) => ({
        ...option,
        extraPrice: formatDecimal(option.extraPrice),
      })),
      note: orderDishItem.note,
    }));
    const order = new Order(
      orderDoc._id.toString(), // Use _id as id in domain model
      orderDoc.createdBy,
      orderDoc.table,
      orderDoc.status,
      orderDoc.type,
      orderDishes,
      orderDoc.linkedOrderId,
      orderDoc.note,
      orderDoc.customerCount,
      formatDecimal(orderDoc.totalAmount)
    );

    // Add user details if available
    if (orderDoc.createdByUser) {
      order.createdByUser = {
        id: orderDoc.createdByUser._id,
        name: orderDoc.createdByUser.name,
        phoneNumber: orderDoc.createdByUser.phoneNumber,
        roles: orderDoc.createdByUser.roles,
      };
    }

    // Add timestamps to the order object for use in responses
    (order as any).createdAt = orderDoc.createdAt;
    (order as any).updatedAt = orderDoc.updatedAt;

    return order;
  }

  public mapFromDocument(orderDoc: any): Order {
    return this.mapToOrderEntity(orderDoc);
  }
}
