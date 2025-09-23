import { Order } from '@/domain/entity';
import { useOrderQuery } from '@/hooks/query';
import { useEffect, useState } from 'react';

export const useInitTableDetail = (orderId: string, table: string, customerCount: number) => {
  const [order, setOrder] = useState<Order | null>(null);
  const {
    data: orderDetail,  
    isPending: isOrderDetailPending,
    isError: isOrderDetailError,
  } = useOrderQuery(orderId);

  useEffect(() => {
    if (orderId && orderDetail) {
      if (orderDetail) {
        setOrder(orderDetail);
      }
    }
  }, [orderId, orderDetail?.id]);

  useEffect(() => {
    if (table && customerCount) {
      setOrder(Order.fromDraftOrder({ table, customerCount }));
    }
  }, [table, customerCount]);

  return {
    order: order || Order.fromDraftOrder({ table, customerCount }),
    setOrder,
    isPending: orderId ? isOrderDetailPending : false,
    isError: orderId ? isOrderDetailError : false,
  };
};
