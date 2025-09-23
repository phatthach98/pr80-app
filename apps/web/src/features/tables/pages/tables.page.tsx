import { useOrdersQuery } from '@/hooks/query';
import { TableCardDetail } from '../components';

export function TablesPage() {
  const { data: orders = [], isPending, isError } = useOrdersQuery();
  const mainOrders = orders.filter((order) => order.isMainOrder());

  if (isPending) {
    return <div>Đang tải đơn hàng...</div>;
  }

  if (isError) {
    return <div>Lỗi tải đơn hàng</div>;
  }

  if (mainOrders.length === 0) {
    return <div>Không có đơn hàng</div>;
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
      {mainOrders.map((order, index) => {
        return <TableCardDetail key={index} order={order} />;
      })}
    </div>
  );
}
