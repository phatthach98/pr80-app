import { useOrdersQuery } from '@/hooks/query';
import { TableCardDetail } from '../components';

export function TablesPage() {
  const { data: orders = [] } = useOrdersQuery();
  const mainOrders = orders.filter((order) => order.isMainOrder());
  return (
    <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
      {mainOrders.map((order, index) => {
        return <TableCardDetail key={index} order={order} />;
      })}
    </div>
  );
}
