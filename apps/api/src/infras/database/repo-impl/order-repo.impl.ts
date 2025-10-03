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
  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    try {
      // Build aggregation pipeline
      const pipeline: any[] = [];

      // Match stage for filtering
      if (filters) {
        const matchStage: any = {};

        // Track invalid filters for logging
        const invalidFilters: string[] = [];

        Object.entries(filters).forEach(([key, value]) => {
          // Skip undefined values and keys starting with '$' (MongoDB operators)
          if (value === undefined || key.startsWith('$')) {
            if (key.startsWith('$')) {
              invalidFilters.push(`Rejected operator key: ${key}`);
            }
            return;
          }

          // Special handling for createdAt date filter
          if (key === "createdAt") {
            try {
              let tzDate;
              
              // Handle both string and Date types
              if (typeof value === 'string') {
                // Parse YYYY-MM-DD format from frontend
                if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                  // Create a date in the Asia/Ho_Chi_Minh timezone
                  tzDate = new TZDate(`${value}T00:00:00`, "Asia/Ho_Chi_Minh");
                } else {
                  throw new Error(`Invalid date format: ${value}. Expected YYYY-MM-DD`);
                }
              } else if (value instanceof Date) {
                // If it's already a Date object
                tzDate = new TZDate(value, "Asia/Ho_Chi_Minh");
              } else {
                throw new Error(`Invalid createdAt value type: ${typeof value}`);
              }
              
              // Create date range in the user's timezone (Asia/Ho_Chi_Minh)
              matchStage[key] = {
                $gte: startOfDay(tzDate),
                $lte: endOfDay(tzDate),
              };
            } catch (error) {
              console.warn(`Error processing createdAt filter: ${error instanceof Error ? error.message : 'Unknown error'}`);
              invalidFilters.push(`Invalid createdAt value: ${value}`);
            }
          } else {
            // For all other filters, only accept primitive values
            const valueType = typeof value;
            if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') {
              // For all other filters, use direct equality with primitive values only
              matchStage[key] = value;
            } else {
              invalidFilters.push(`Invalid value type for ${key}: ${valueType}`);
            }
          }
        });
        
        // Log any invalid filters that were rejected
        if (invalidFilters.length > 0) {
          console.warn(`Rejected invalid order filters: ${invalidFilters.join(', ')}`);
        }

        if (Object.keys(matchStage).length > 0) {
          pipeline.push({ $match: matchStage });
        }
      }

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
      // Find by MongoDB _id
      const order = await OrderSchema.findOne({ _id: id }).lean();

      if (!order) {
        return null;
      }

      return this.mapToOrderEntity(order);
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      return null;
    }
  }

  async getLinkedOrders(orderId: string): Promise<Order[] | null> {
    try {
      const orders = await OrderSchema.find({ linkedOrderId: orderId }).lean();

      if (!orders) {
        return null;
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

    // Add timestamps to the order object for use in responses
    (order as any).createdAt = orderDoc.createdAt;
    (order as any).updatedAt = orderDoc.updatedAt;

    return order;
  }

  public mapFromDocument(orderDoc: any): Order {
    return this.mapToOrderEntity(orderDoc);
  }
}
