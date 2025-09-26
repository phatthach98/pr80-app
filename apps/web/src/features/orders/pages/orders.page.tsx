import { Badge } from '@/components/ui';
import { useOrdersSocket } from '../hooks';
import { useStore } from '@tanstack/react-store';
import { socketStore } from '@/store/socket.store';
import { OrderCardItem } from '../components';

export const OrdersPage = () => {
  // Use the page-specific socket hook
  const { realTimeOrdersQuery } = useOrdersSocket();
  const { data: cookingOrders, error, isPending } = realTimeOrdersQuery;
  const { connectionStatus } = useStore(socketStore);
  if (isPending) {
    return <div>Đang tải danh sách đơn hàng...</div>;
  }
  if (error) {
    return <div>Lỗi tải danh sách đơn hàng: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Đơn hàng đang chờ</h1>
        <Badge variant="success" className="text-sm">
          {connectionStatus === 'connected' ? 'Cập nhật thời gian thực' : 'Đang kết nối...'}
        </Badge>
      </div>

      {cookingOrders && cookingOrders.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cookingOrders.map((order) => (
            <OrderCardItem key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">No orders currently in kitchen</div>
      )}
    </div>
  );
};
