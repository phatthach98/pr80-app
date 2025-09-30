import { useOrdersSocket } from '../hooks';
import { OrderCardItem } from '../components';
import { EmptyState, SocketStatus } from '@/components';

export const OrdersPage = () => {
  const { realTimeOrdersQuery } = useOrdersSocket();
  const { data: cookingOrders, error } = realTimeOrdersQuery;

  if (error) {
    return <div>Lỗi tải danh sách đơn hàng: {error.message}</div>;
  }

  return (
    <div className="mt-4 flex flex-1 flex-col gap-8">
      <div className="flex flex-col items-center justify-between">
        <h1 className="text-2xl font-bold">Đơn Đang Chờ</h1>
        <SocketStatus className="mt-4" />
      </div>
      {cookingOrders.length === 0 && <EmptyState title="Không có đơn hàng đang chờ"></EmptyState>}

      {cookingOrders.length > 0 && (
        <div className="flex flex-col flex-wrap gap-4 md:flex-row">
          {cookingOrders.map((order) => (
            <OrderCardItem key={order.id} order={order} className="w-[48%]" />
          ))}
        </div>
      )}
    </div>
  );
};
