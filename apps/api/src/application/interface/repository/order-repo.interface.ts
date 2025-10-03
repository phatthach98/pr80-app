import { Order } from "@domain/entity/order";
import { EOrderStatus, EOrderType } from "@pr80-app/shared-contracts";

export interface OrderFilters {
  status?: EOrderStatus;
  type?: EOrderType;
  createdBy?: string;
  table?: string;
  createdAt?: string | Date;
}

export interface OrderRepository {
  getOrders(filters?: OrderFilters): Promise<Order[] | null>;
  getOrderById(id: string): Promise<Order | null>;
  getLinkedOrders(orderId: string): Promise<Order[] | null>;
  create(order: Order): Promise<Order>;
  update(order: Order): Promise<Order | null>;
  delete(id: string): Promise<boolean>;
}
