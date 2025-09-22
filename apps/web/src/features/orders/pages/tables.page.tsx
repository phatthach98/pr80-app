import { useOrdersQuery } from '@/hooks/query';
import { OrderCardDetail } from '../components';

export function TablesPage() {
  const { data: orders = [] } = useOrdersQuery();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
      {orders.map((order, index) => {
        return <OrderCardDetail key={index} order={order} />;
      })}
    </div>
  );
}
