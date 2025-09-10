import { Order } from "@domain/entity/order";
import { EOrderStatus, EOrderType } from "@pr80-app/shared-contracts";

export interface OrderRepository {
  getOrders(): Promise<Order[] | null>;
  getOrderById(id: string): Promise<Order | null>;
  getOrdersByStatus(status: EOrderStatus): Promise<Order[] | null>;
  getOrdersByType(type: EOrderType): Promise<Order[] | null>;
  getOrdersByCreatedBy(userId: string): Promise<Order[] | null>;
  getLinkedOrders(orderId: string): Promise<Order[] | null>;
  create(order: Order): Promise<Order>;
  update(order: Order): Promise<Order | null>;
  delete(id: string): Promise<boolean>;
}
