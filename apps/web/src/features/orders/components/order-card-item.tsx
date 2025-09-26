import { Order, OrderDish } from '@/domain/entity';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EOrderStatus } from '@pr80-app/shared-contracts';
import { useUpdateOrderStatusMutation } from '@/hooks/mutation/orders.mutation';
import { formatDate } from '@/utils';

type OrderCardItemProps = {
  order: Order;
};

export const OrderCardItem = ({ order }: OrderCardItemProps) => {
  const { mutate: updateOrderStatus } = useUpdateOrderStatusMutation();

  const handleMarkAsReady = () => {
    if (order.id && order.status === EOrderStatus.COOKING) {
      updateOrderStatus({
        orderId: order.id,
        status: EOrderStatus.READY,
      });
    }
  };

  const renderStatusBadge = (status: EOrderStatus) => {
    switch (status) {
      case EOrderStatus.COOKING:
        return <Badge variant="secondary">Đang nấu</Badge>;
      case EOrderStatus.READY:
        return <Badge variant="success">Sẵn sàng</Badge>;
      case EOrderStatus.SERVING:
        return <Badge>Đang phục vụ</Badge>;
      case EOrderStatus.PAID:
        return <Badge variant="outline">Đã thanh toán</Badge>;
      case EOrderStatus.CANCELLED:
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{order.getDisplayStatus()}</Badge>;
    }
  };

  const renderSelectedOptions = (dish: OrderDish) => {
    const optionGroups = dish.getDishOptionNameGroupById();
    
    return Object.values(optionGroups).map((options, index) => {
      const optionText = options.map((option: { itemLabel: string }) => option.itemLabel).join(', ');
      const dishOptionName = options[0]?.dishOptionName || '';
      
      return (
        <div key={index} className="text-sm">
          <span className="font-medium">{dishOptionName}:</span> {optionText}
        </div>
      );
    });
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold">Order #{order.id.substring(0, 8)}</h3>
          <p className="text-sm text-gray-500">
            {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
          </p>
        </div>
        <div className="flex flex-col items-end">
          {renderStatusBadge(order.status)}
          <p className="text-sm mt-1">Bàn: {order.table}</p>
        </div>
      </div>

      {order.note && (
        <div className="bg-gray-50 p-2 rounded mb-3">
          <p className="text-sm font-medium">Ghi chú đơn hàng:</p>
          <p className="text-sm">{order.note}</p>
        </div>
      )}

      <div className="space-y-3">
        {order.dishes.map((dish) => (
          <div key={dish.id} className="border-t pt-3">
            <div className="flex justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{dish.name}</span>
                  <span className="text-sm bg-gray-100 px-2 py-0.5 rounded">x{dish.quantity}</span>
                  {dish.takeAway && (
                    <Badge variant="outline" className="text-xs">Mang về</Badge>
                  )}
                </div>
                
                {renderSelectedOptions(dish)}
                
                {dish.note && (
                  <div className="text-sm mt-1">
                    <span className="font-medium">Ghi chú:</span> {dish.note}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {order.status === EOrderStatus.COOKING && (
        <div className="mt-4 flex justify-end">
          <Button onClick={handleMarkAsReady} size="sm">
            Đánh dấu sẵn sàng
          </Button>
        </div>
      )}
    </div>
  );
};
