import { Order, OrderDish } from '@/domain/entity';
import { Button } from '@/components/ui/button';
import { EOrderStatus } from '@pr80-app/shared-contracts';
import { useUpdateOrderStatusMutation } from '@/hooks/mutation/orders.mutation';
import { formatDate } from '@/utils';
import { OrderStatusFromOrder } from './order-status';
import { useSettingOptionsQuery } from '@/hooks/query';
import { cn } from '@/tailwind/utils';
import { useState } from 'react';

type OrderCardItemProps = {
  order: Order;
  className?: string;
};

export const OrderCardItem = ({ order, className }: OrderCardItemProps) => {
  const { mutateAsync: updateOrderStatus } = useUpdateOrderStatusMutation();
  const { data: options } = useSettingOptionsQuery();
  const currentTable = options?.tables?.find((status) => status.value === order.table);
  const [isLoading, setIsLoading] = useState(false);
  const handleMarkAsReady = async () => {
    setIsLoading(true);
    if (order.id && order.status === EOrderStatus.COOKING) {
      await updateOrderStatus({
        orderId: order.id,
      });
    }
    setIsLoading(false);
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
        <div key={index} className="ml-2 text-sm text-gray-500">
          {dishOptionName}: <span className="font-bold text-gray-700">{optionText}</span>
        </div>
      );
    });
  };

  return (
    <div
      className={cn(
        'mb-4 flex flex-col justify-between rounded-lg border p-4 shadow-sm',
        className,
      )}
    >
      <div>
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="font-bold">{currentTable?.label}</h3>
            <p className="text-sm font-bold">#{order.getDisplayOrderId()}</p>
            <p className="text-sm text-gray-500">
              {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <OrderStatusFromOrder order={order} variant="dot" size="md" />
          </div>
        </div>

        {order.note && (
          <div className="mb-3 rounded bg-gray-100 p-2">
            <p className="text-sm italic">Ghi chú bàn:</p>
            <p className="text-sm font-bold text-red-500 italic">{order.note}</p>
          </div>
        )}

        <div className="space-y-3">
          {order.dishes.map((dish) => (
            <div key={dish.id} className="rounded-lg bg-gray-200 p-4">
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{dish.name} </span>
                    <span className="rounded py-0.5 text-base font-bold">x{dish.quantity}</span>
                    {dish.takeAway && <span className="text-sm text-red-500">Mang về</span>}
                  </div>
                  {dish.note && (
                    <div className="pb-1 text-sm text-gray-500">
                      <span className="italic">Ghi chú: </span>
                      <span className="font-bold text-red-500 italic">{dish.note}</span>
                    </div>
                  )}
                  {renderSelectedOptions(dish)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {order.status === EOrderStatus.COOKING && (
        <div className="mt-4 flex justify-end">
          <Button onClick={handleMarkAsReady} size="lg" isLoading={isLoading}>
            Sẵn sàng
          </Button>
        </div>
      )}
    </div>
  );
};
