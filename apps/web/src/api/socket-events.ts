/**
 * Socket event names - must match backend event names
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
