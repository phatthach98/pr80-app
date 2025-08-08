import { Order, OrderStatus } from "@domain/entity/order";

export interface OrderRepository {
  getOrders(): Promise<Order[] | null>;
  getOrderById(id: string): Promise<Order | null>;
  getOrdersByStatus(status: OrderStatus): Promise<Order[] | null>;
  getOrdersByCreatedBy(userId: string): Promise<Order[] | null>;
  getLinkedOrders(orderId: string): Promise<Order[] | null>;
  create(order: Order): Promise<Order>;
  update(order: Order): Promise<Order | null>;
  delete(id: string): Promise<boolean>;
}
