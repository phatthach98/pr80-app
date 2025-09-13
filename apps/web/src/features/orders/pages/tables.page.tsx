import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { useOrdersQuery } from '@/hooks/query';
import { ordersStore, resetOrdersState, setOrders } from '../store';
import { useEffect } from 'react';
import { useStore } from '@tanstack/react-store';

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
        return (
          <Card key={index} className="w-full md:w-[calc(50%-1rem)]">
            <CardHeader>
              <CardTitle>{order.table}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{order.customerCount} khách</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
