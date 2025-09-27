import { Order, OrderDish } from '@/domain/entity';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EOrderStatus } from '@pr80-app/shared-contracts';
import { useUpdateOrderStatusMutation } from '@/hooks/mutation/orders.mutation';
import { formatDate } from '@/utils';
import { OrderStatusFromOrder } from './order-status';

type OrderCardItemProps = {
  order: Order;
};

export const OrderCardItem = ({ order }: OrderCardItemProps) => {
  const { mutate: updateOrderStatus } = useUpdateOrderStatusMutation();

  const handleMarkAsReady = () => {
    if (order.id && order.status === EOrderStatus.COOKING) {
      updateOrderStatus({
        orderId: order.id,
      });
    }
  };

  // Using the OrderStatus component instead of renderStatusBadge

  const renderSelectedOptions = (dish: OrderDish) => {
    const optionGroups = dish.getDishOptionNameGroupById();

    return Object.values(optionGroups).map((options, index) => {
      const optionText = options
        .map((option: { itemLabel: string }) => option.itemLabel)
        .join(', ');
      const dishOptionName = options[0]?.dishOptionName || '';

      return (
        <div key={index} className="text-sm">
          <span className="font-medium">{dishOptionName}:</span> {optionText}
        </div>
      );
    });
  };

  return (
    <div className="mb-4 rounded-lg border p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h3 className="font-semibold">Order #{order.id.substring(0, 8)}</h3>
          <p className="text-sm text-gray-500">
            {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <OrderStatusFromOrder order={order} variant="badge" />
          <p className="mt-1 text-sm">Bàn: {order.table}</p>
        </div>
      </div>

      {order.note && (
        <div className="mb-3 rounded bg-gray-50 p-2">
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
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-sm">x{dish.quantity}</span>
                  {dish.takeAway && (
                    <Badge variant="outline" className="text-xs">
                      Mang về
                    </Badge>
                  )}
                </div>

                {renderSelectedOptions(dish)}

                {dish.note && (
                  <div className="mt-1 text-sm">
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
