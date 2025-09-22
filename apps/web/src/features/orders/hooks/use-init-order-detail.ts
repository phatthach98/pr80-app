import { Order } from '@/domain/entity';
import { useOrdersQuery } from '@/hooks/query';
import { useEffect, useState } from 'react';

export const useInitOrderDetail = (orderId: string, table: string, customerCount: number) => {
  const [order, setOrder] = useState<Order | null>(null);
  const { data: orders, isPending, isError } = useOrdersQuery();

  useEffect(() => {
    if (orderId && orders) {
      const existingOrder = orders.find((o) => o.id === orderId);
      if (existingOrder) {
        setOrder(existingOrder);
      }
    }
  }, [orderId]);

  useEffect(() => {
    if (table && customerCount) {
      setOrder(Order.fromDraftOrder({ table, customerCount }));
    }
  }, [table, customerCount]);

  return { order, setOrder, isPending, isError };
};
