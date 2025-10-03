import { SocketEvents } from '@/api/socket-events';
import { Order } from '@/domain/entity';

import { useEffect } from 'react';
import { EOrderStatus } from '@pr80-app/shared-contracts';
import { useSocketConnection } from '@/hooks/socket/use-socket-connection';
import { useQueryClient } from '@tanstack/react-query';
import { useOrdersQuery } from '@/hooks/query/orders.query';
import { startOfToday } from 'date-fns';

/**
 * Hook to manage socket connection specifically for the Orders page
 * Creates a socket instance when the hook is used and destroys it when the component unmounts
 */
export const useOrdersSocket = () => {
  const socket = useSocketConnection();
  const queryClient = useQueryClient();
  const realTimeOrdersQuery = useOrdersQuery({
    status: EOrderStatus.COOKING,
    createdAt: startOfToday(),
  });
  useEffect(() => {
    // Handle order created event
    socket.on(SocketEvents.ORDER.CREATED, (order: any) => {
      // If the new order has COOKING status, update the query cache
      if (order.status === EOrderStatus.COOKING) {
        queryClient.setQueryData(
          ['orders', 'list', { filters: { status: EOrderStatus.COOKING } }],
          (oldData: Order[] = []) => {
            // Convert the new order to domain entity
            const newOrder = Order.fromOrderResponse(order);
            // Check if the order already exists in the list
            const exists = oldData.some((item) => item.id === newOrder.id);
            if (exists) return oldData;
            // Add the new order to the list
            return [...oldData, newOrder];
          },
        );
      }
    });

    return () => {
      socket.off(SocketEvents.ORDER.CREATED);
    };
  }, [socket]);
  return {
    realTimeOrdersQuery,
    socket,
  };
};
