import { SocketEvents } from '@/api/socket-events';
import { Order } from '@/domain/entity';

import { useEffect } from 'react';
import { EOrderStatus } from '@pr80-app/shared-contracts';
import { useSocketConnection } from '@/hooks/socket/use-socket-connection';
import { useQueryClient } from '@tanstack/react-query';
import { ordersKeys, useOrdersQuery } from '@/hooks/query/orders.query';
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
          ordersKeys.list({ status: EOrderStatus.COOKING, createdAt: startOfToday() }),
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

    // Handle order updated event
    socket.on(SocketEvents.ORDER.UPDATED, (updatedOrder: any) => {
      // Update any query that might contain this order
      queryClient.invalidateQueries({
        queryKey: ['orders'],
        exact: false,
      });

      // Update specific order in the cooking orders list
      queryClient.setQueryData(
        ordersKeys.list({ status: EOrderStatus.COOKING, createdAt: startOfToday() }),
        (oldData: Order[] = []) => {
          if (!oldData.length) return oldData;

          // Find if the updated order exists in the current list
          const orderIndex = oldData.findIndex((item) => item.id === updatedOrder.id);

          // If order doesn't exist or status changed from COOKING, remove it
          if (orderIndex === -1 || updatedOrder.status !== EOrderStatus.COOKING) {
            return oldData.filter((item) => item.id !== updatedOrder.id);
          }

          // Otherwise, update the order with new data
          const updatedOrderEntity = Order.fromOrderResponse(updatedOrder);
          const newData = [...oldData];
          newData[orderIndex] = updatedOrderEntity;

          return newData;
        },
      );

      // Also update the specific order detail if it's being viewed
      queryClient.setQueryData(
        ['orders', 'detail', updatedOrder.id],
        (oldData: Order | undefined) => {
          if (!oldData) return oldData;
          return Order.fromOrderResponse(updatedOrder);
        },
      );
    });

    return () => {
      socket.off(SocketEvents.ORDER.CREATED);
      socket.off(SocketEvents.ORDER.UPDATED);
    };
  }, [socket, queryClient]);

  return {
    realTimeOrdersQuery,
    socket,
  };
};
