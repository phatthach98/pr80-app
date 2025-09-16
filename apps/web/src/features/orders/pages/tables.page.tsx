import { useOrdersQuery } from '@/hooks/query';
import { ordersStore, resetOrdersState, setOrders } from '../store';
import { useEffect } from 'react';
import { useStore } from '@tanstack/react-store';
import { OrderCardDetail } from '../components';

export function TablesPage() {
  const { orders } = useStore(ordersStore);
  const { data: apiOrders = [] } = useOrdersQuery();

  useEffect(() => {
    resetOrdersState();
    setOrders(apiOrders);
  }, [apiOrders.length]);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
      {orders.map((order, index) => {
        return <OrderCardDetail key={index} order={order} />;
      })}
    </div>
  );
}
