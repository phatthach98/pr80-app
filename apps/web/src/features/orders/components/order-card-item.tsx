import { Order, OrderDish } from '@/domain/entity';
import { Button } from '@/components/ui/button';
import { EOrderStatus } from '@pr80-app/shared-contracts';
import {
  useUpdateOrderStatusMutation,
  useUpdateOrderToPreviousStatusMutation,
} from '@/hooks/mutation/orders.mutation';
import { formatDate } from '@/utils';
import { OrderStatusFromOrder } from './order-status';
import { useSettingOptionsQuery } from '@/hooks/query';
import { cn } from '@/tailwind/utils';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ordersKeys } from '@/hooks/query/orders.query';
import { startOfToday } from 'date-fns';
import { toast } from 'sonner';

type OrderCardItemProps = {
  order: Order;
  className?: string;
};

export const OrderCardItem = ({ order, className }: OrderCardItemProps) => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateOrderStatus } = useUpdateOrderStatusMutation();
  const { mutateAsync: updateOrderToPreviousStatus } = useUpdateOrderToPreviousStatusMutation();
  const { data: options } = useSettingOptionsQuery();
  const currentTable = options?.tables?.find((status) => status.value === order.table);
  const [isLoading, setIsLoading] = useState(false);
  const [isUndoLoading, setIsUndoLoading] = useState(false);

  const handleUndoStatusChange = async () => {
    if (!order.id) return;

    setIsUndoLoading(true);
    try {
      await updateOrderToPreviousStatus({ orderId: order.id });
      toast.success('Đã hoàn tác trạng thái đơn hàng');
    } catch (error) {
      console.error('Failed to undo status change:', error);
      toast.error('Không thể hoàn tác trạng thái đơn hàng');
    } finally {
      setIsUndoLoading(false);
    }
  };

  const handleMarkAsReady = async () => {
    if (!order.id || order.status !== EOrderStatus.COOKING) return;

    setIsLoading(true);
    const previousOrders = queryClient.getQueryData(
      ordersKeys.list({ status: EOrderStatus.COOKING, createdAt: startOfToday() }),
    ) as Order[] | undefined;
    try {
      await updateOrderStatus({
        orderId: order.id,
      });

      // Optimistically update the UI by removing this order from the cooking list
      queryClient.setQueryData(
        ordersKeys.list({ status: EOrderStatus.COOKING, createdAt: startOfToday() }),
        (oldData: Order[] = []) => oldData.filter((item) => item.id !== order.id),
      );

      // Show toast with undo button
      toast('Đơn hàng đã sẵn sàng', {
        description: 'Trạng thái đã được cập nhật từ "Đang nấu" sang "Sẵn sàng"',
        action: {
          label: isUndoLoading ? 'Đang hoàn tác...' : 'Hoàn tác',
          onClick: handleUndoStatusChange,
        },
        duration: 5000, // Show for 5 seconds
        position: 'top-center',
      });
    } catch (error) {
      // On error, rollback to previous state
      if (previousOrders) {
        queryClient.setQueryData(
          ordersKeys.list({ status: EOrderStatus.COOKING, createdAt: startOfToday() }),
          previousOrders,
        );
      }
      console.error('Failed to update order status:', error);
      toast.error('Không thể cập nhật trạng thái đơn hàng');
    } finally {
      setIsLoading(false);
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
        <div key={index} className="text-md ml-2 text-gray-500">
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
            <h3 className="text-lg font-bold">{currentTable?.label}</h3>
            <p className="text-md text-gray-500">
              {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
            </p>
            <p className="text-md text-gray-500">
              Nhân viên: <span className="font-bold">{order.createdByUser?.name}</span>
            </p>
          </div>
          <div className="flex flex-col items-end">
            <OrderStatusFromOrder order={order} variant="dot" size="sm" />
            <p className="text-sm font-bold">#{order.getDisplayOrderId()}</p>
          </div>
        </div>

        {order.note && (
          <div className="mb-3 rounded bg-gray-100 p-2">
            <p className="text-md italic">Ghi chú bàn:</p>
            <p className="text-md font-bold text-red-500 italic">{order.note}</p>
          </div>
        )}

        <div className="space-y-3 mt-4">
          {order.dishes.map((dish) => (
            <div key={dish.id} className="rounded-lg bg-gray-200 p-4">
              <div className="flex justify-between">
                <div className="text-md flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{dish.name} </span>
                    <span className="rounded py-0.5 text-base font-bold">x{dish.quantity}</span>
                    {dish.takeAway && <span className="text-red-500">Mang về</span>}
                  </div>
                  {dish.note && (
                    <div className="pb-1 text-gray-500">
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
        <div className="mt-8 flex justify-end">
          <Button onClick={handleMarkAsReady} size="lg" isLoading={isLoading}>
            Sẵn sàng
          </Button>
        </div>
      )}
    </div>
  );
};
