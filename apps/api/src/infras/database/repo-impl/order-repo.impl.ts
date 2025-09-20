import { v4 as uuid } from "uuid";
import { OrderRepository } from "@application/interface/repository/order-repo.interface";
import { Order } from "@domain/entity/order";
import { OrderSchema } from "../schemas/order-schema";
import { formatDecimal } from "../utils/mongodb.util";
import { EOrderStatus, EOrderType } from "@pr80-app/shared-contracts";

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

  async getOrdersByStatus(status: EOrderStatus): Promise<Order[] | null> {
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

  async getOrdersByType(type: EOrderType): Promise<Order[] | null> {
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
    const dishes = orderDoc.dishes.map((orderDishItem: any) => ({
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
    }));
    const order = new Order(
      orderDoc._id.toString(), // Use _id as id in domain model
      orderDoc.createdBy,
      orderDoc.table,
      orderDoc.status,
      orderDoc.type,
      dishes,
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
