import { v4 as uuid } from "uuid";
import { OrderRepository } from "@application/interface/repository/order-repo.interface";
import { Order, OrderStatus, OrderType } from "@domain/entity/order";
import { OrderSchema } from "../schemas/order-schema";

export class OrderRepositoryImpl implements OrderRepository {
  async getOrders(): Promise<Order[]> {
    try {
      const orders = await OrderSchema.find().lean();

      if (!orders) {
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

  async getOrdersByStatus(status: OrderStatus): Promise<Order[] | null> {
    try {
      const orders = await OrderSchema.find({ status }).lean();

      if (!orders) {
        return null;
      }

      return orders.map((order) => this.mapToOrderEntity(order));
    } catch (error) {
      console.error("Error fetching orders by status:", error);
      return null;
    }
  }

  async getOrdersByType(type: OrderType): Promise<Order[] | null> {
    try {
      const orders = await OrderSchema.find({ type }).lean();

      if (!orders) {
        return null;
      }

      return orders.map((order) => this.mapToOrderEntity(order));
    } catch (error) {
      console.error("Error fetching orders by type:", error);
      return null;
    }
  }

  async getOrdersByCreatedBy(userId: string): Promise<Order[] | null> {
    try {
      const orders = await OrderSchema.find({ createdBy: userId }).lean();

      if (!orders) {
        return null;
      }

      return orders.map((order) => this.mapToOrderEntity(order));
    } catch (error) {
      console.error("Error fetching orders by user ID:", error);
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
          },
        },
        { new: true }
      ).lean();

      if (!updatedOrder) {
        return null;
      }

      return this.mapToOrderEntity(updatedOrder);
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
    // Convert Decimal128 to number for each dish price
    const dishes = orderDoc.dishes.map((dish: any) => ({
      ...dish,
      id: dish.id || uuid(), // Keep dish.id as is or generate new UUID
      price: parseFloat(dish.price.toString()),
      selectedOptions: dish.selectedOptions.map((option: any) => ({
        ...option,
        extraPrice: parseFloat(option.extraPrice.toString()),
      })),
    }));

    return new Order(
      orderDoc._id.toString(), // Use _id as id in domain model
      orderDoc.createdBy,
      orderDoc.table,
      orderDoc.status,
      orderDoc.type,
      dishes,
      orderDoc.linkedOrderId,
      orderDoc.note,
      parseFloat(orderDoc.totalAmount.toString())
    );
  }
}
