import { Order } from '@/domain/entity';
import { useOrderQuery } from '@/hooks/query';
import { useEffect, useState } from 'react';

export const useInitTableDetail = (
  initialOrder: Order | null,
  table: string,
  customerCount: number,
) => {
  const [order, setOrder] = useState<Order | null>(null);
  const {
    data: orderDetail,
    isPending: isOrderDetailPending,
    isError: isOrderDetailError,
  } = useOrderQuery(initialOrder?.id || '');

  useEffect(() => {
    if (initialOrder?.id && orderDetail) {
      if (orderDetail) {
        setOrder(orderDetail);
      }
    }
  }, [JSON.stringify(initialOrder), orderDetail?.id]);

  useEffect(() => {
    if (table && customerCount) {
      setOrder(Order.fromDraftOrder({ table, customerCount }));
    }
  }, [table, customerCount]);

  return {
    order: order || Order.fromDraftOrder({ table, customerCount }),
    setOrder,
    isPending: initialOrder?.id ? isOrderDetailPending : false,
    isError: initialOrder?.id ? isOrderDetailError : false,
  };
};
