import { Order } from "@domain/entity/order";

/**
 * Socket event source configuration
 */
export enum SocketEventSource {
  USE_CASE = 'use_case',
  CHANGE_STREAM = 'change_stream'
}

/**
 * Socket event names
 */
export const SocketEvents = {
  // Order events
  ORDER: {
    CREATED: 'order:created',
    UPDATED: 'order:updated',
    DELETED: 'order:deleted'
  },
  // Room names
  ROOMS: {
    ORDERS: 'orders'
  }
} as const;

/**
 * Socket service interface for real-time communication
 */
export interface SocketService {
  /**
   * Initialize the socket server
   * @param server HTTP server instance
   * @param eventSource The source of socket events (use case or change stream)
   */
  initialize(server: any, eventSource?: SocketEventSource): void;
  
  /**
   * Get the current event source
   */
  getEventSource(): SocketEventSource;

  /**
   * Emit order created event
   * @param order The created order
   * @param source The source of the event (use case or change stream)
   */
  emitOrderCreated(order: Order, source?: SocketEventSource): void;

  /**
   * Emit order updated event
   * @param order The updated order
   * @param source The source of the event (use case or change stream)
   */
  emitOrderUpdated(order: Order, source?: SocketEventSource): void;

  /**
   * Emit order deleted event
   * @param orderId The ID of the deleted order
   * @param source The source of the event (use case or change stream)
   */
  emitOrderDeleted(orderId: string, source?: SocketEventSource): void;

  /**
   * Get the socket server instance
   */
  getSocketServer(): any;

  /**
   * Close the socket server
   */
  close(): void;
}
