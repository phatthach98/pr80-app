import { Order } from '@/domain/entity';
import { OrderDish } from '@/domain/entity/order-dish';
import { AddDishToTableForm } from '../add-dish-to-table-form/add-dish-to-table-form.component';
import { useState } from 'react';
import { CreditCardIcon, SendIcon } from 'lucide-react';
import { BackButton, Button, EditableField } from '@/components/ui';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useCreateUpdateTable, useInitTableDetail, useOrderDishUpdate } from '../../hooks';
import { TableDetailSummaryPrice } from './summary-price.component';
import { TableDishItem } from './table-dish-item.component';
import { useSettingOptionsQuery } from '@/hooks/query';
import { OrderStatusFromOrder } from '@/features/orders/components';
import { formatDate } from '@/utils';
import { FullPageLoader } from '@/components/ui/loading-spinner';

export interface TableDetailProps {
  order?: Order;
  createParams?: {
    table: string;
    customerCount: number;
  };
}

export const TableDetail = ({ order: initialOrder, createParams }: TableDetailProps) => {
  const [selectedDishForEdit, setSelectedDishForEdit] = useState<OrderDish | null>(null);
  const [additionalOrder, setAdditionalOrder] = useState<Order | null>(null);
  const {
    order: activeOrder,
    isPending,
    isError,
    setOrder: setActiveOrder,
  } = useInitTableDetail(
    initialOrder?.id || '',
    createParams?.table || '',
    createParams?.customerCount || 0,
  );
  const {
    createDraftTable,
    createAdditionalTable,
    updateTable,
    updateOrderStatusBasedOnCurrentStatus,
  } = useCreateUpdateTable();
  const { addOrderDishToTable } = useOrderDishUpdate();
  const { data: tableOptions } = useSettingOptionsQuery();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  // Helper function to remove dish
  const removeDish = (dishId: string) => {
    if (activeOrder?.canEdit()) {
      setActiveOrder(activeOrder.removeDish(dishId));
    }
    if (additionalOrder?.canEdit()) {
      setAdditionalOrder(additionalOrder.removeDish(dishId));
    }
  };

  // Helper function to edit dish
  const handleEditDish = (orderDish: OrderDish) => {
    setSelectedDishForEdit(orderDish);
  };

  const updateDishQuantity = (dishId: string, quantity: number) => {
    if (activeOrder?.canEdit()) {
      setActiveOrder(activeOrder.updateDishQuantity(dishId, quantity));
    }
    if (additionalOrder?.canEdit()) {
      setAdditionalOrder(additionalOrder.updateDishQuantity(dishId, quantity));
    }
  };

  // Helper function to update note
  const handleUpdateNote = (value: string) => {
    if (activeOrder) {
      setActiveOrder(activeOrder.updateNote(value));
    }
  };

  const handleUpdateCustomerCount = (value: string) => {
    const count = parseInt(value, 10);
    if (count > 0 && activeOrder) {
      setActiveOrder(activeOrder.updateCustomerCount(count));
    }
  };

  const handleSubmitOrder = async () => {
    setIsLoading(true);
    if (!activeOrder) {
      toast.error('Không tìm thấy đơn hàng');
      return;
    }
    if (activeOrder.canEdit()) {
      await createDraftTable(activeOrder);
    }
    if (additionalOrder && additionalOrder.canEdit()) {
      await createAdditionalTable(additionalOrder);
    }

    if (!activeOrder.canEdit()) {
      await updateTable(activeOrder);
    }
    setIsLoading(false);
    toast.success('Đơn hàng đã được gửi');
    router.navigate({ to: '/tables' });
  };

  const handleMakePayment = async () => {
    try {
      setIsLoading(true);
      if (!activeOrder) {
        toast.error('Không tìm thấy đơn hàng');
        return;
      }
      await updateOrderStatusBasedOnCurrentStatus(activeOrder.id);
      toast.success('Đơn hàng đã được thanh toán');
      router.navigate({ to: '/tables' });
    } catch {
      toast.error('Thanh toán thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrderDishToOrder = (orderDish: OrderDish) => {
    if (!orderDish) {
      toast.error('Không tìm thấy món ăn');
      return;
    }
    if (activeOrder && activeOrder.canEdit()) {
      const updatedOrder = addOrderDishToTable(activeOrder, orderDish);
      if (updatedOrder) {
        setActiveOrder(updatedOrder);
      }
    }

    // For add more dishes on pending order, create additional order
    if (activeOrder && !activeOrder.canEdit()) {
      if (!additionalOrder) {
        const additionalOrder = Order.fromAdditionalOrder(
          activeOrder,
          [orderDish],
          activeOrder.note,
        );
        setAdditionalOrder(additionalOrder);
      } else {
        setAdditionalOrder(addOrderDishToTable(additionalOrder, orderDish));
      }
    }
  };

  if (isPending) {
    return <FullPageLoader />;
  }

  if (isError) {
    return <div>Lỗi tải đơn hàng</div>;
  }

  const currentTable = tableOptions?.tables.find((table) => table.value === activeOrder?.table) || {
    label: activeOrder.table,
    value: activeOrder.table,
  };
  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-white md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
      {/* Back button */}
      <div className="mb-4">
        <BackButton />
      </div>

      {/* Header with table name */}
      <div className="mb-4 text-center md:mb-10">
        <h1 className="mb-2 text-xl font-bold md:text-2xl lg:text-3xl">{currentTable.label}</h1>
        <div className="flex items-center justify-center">
          <EditableField
            value={activeOrder.customerCount.toString()}
            onSave={handleUpdateCustomerCount}
            type="number"
            placeholder="Số lượng khách"
            displayClassName="text-gray-600 md:text-lg text-center"
            inputClassName="w-20 text-center mx-auto"
          />{' '}
          khách
        </div>
      </div>

      <div className="bg-secondary/50 mb-6 rounded-md border border-dashed border-gray-400 p-4 md:mb-10">
        <EditableField
          label="Ghi chú bàn"
          value={activeOrder.note || ''}
          onSave={handleUpdateNote}
          type="textarea"
          placeholder="Không có ghi chú. Nhấp để thêm ghi chú."
          displayClassName="text-sm text-gray-600 md:text-base"
          labelClassName="font-medium mb-2"
        />
      </div>

      {/* All orders (main + linked) */}
      <div>
        {/* Render each order with its dishes */}
        {(() => {
          // Concatenate active order and linked orders
          const allOrders = [activeOrder, ...(activeOrder.linkedOrders || [])];

          if (
            allOrders.length === 0 ||
            (allOrders.length === 1 && activeOrder.dishes.length === 0)
          ) {
            return (
              <p className="text-muted-foreground py-6 text-center md:py-12 md:text-lg">
                Chưa có món nào
              </p>
            );
          }

          return allOrders.map((order, index) => {
            // Skip rendering if there are no dishes
            if (order.dishes.length === 0) return null;

            return (
              <div key={order.id} className={index > 0 ? 'border-t border-gray-600' : ''}>
                {/* Order header with ID, date and status */}
                <div className="flex items-center justify-between pt-4 pb-2">
                  <div>
                    <div className="font-bold text-gray-700">#{order.getDisplayOrderId()}</div>
                    <div className="text-sm font-light text-gray-700 italic">
                      {formatDate(order.createdAt || new Date())}
                    </div>
                  </div>
                  <div className="py-2">
                    <OrderStatusFromOrder order={order} variant="dot" size="md" />
                  </div>
                </div>

                {/* Dishes for this order */}
                {order.dishes.map((dish) => (
                  <TableDishItem
                    key={dish.id}
                    isEditable={order.canEdit()}
                    dish={dish}
                    removeDish={removeDish}
                    handleEditDish={handleEditDish}
                    updateDishQuantity={updateDishQuantity}
                  />
                ))}
              </div>
            );
          });
        })()}
      </div>

      {/* Additional order */}
      {!activeOrder.canEdit() && (
        <div>
          <h2 className="mt-6 text-lg font-medium md:text-xl lg:text-2xl">Món gọi thêm</h2>
          <div className="space-y-6 md:space-y-8">
            {additionalOrder?.dishes.map((dish) => {
              return (
                <TableDishItem
                  isEditable={additionalOrder.canEdit()}
                  dish={dish}
                  removeDish={removeDish}
                  handleEditDish={handleEditDish}
                  updateDishQuantity={updateDishQuantity}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Add/Edit dish button */}
      <div className="mt-6 flex justify-center">
        <AddDishToTableForm
          orderDish={selectedDishForEdit}
          onOrderDishUpdate={handleAddOrderDishToOrder}
          onClose={() => setSelectedDishForEdit(null)}
          disabled={activeOrder.isPaid()}
        />
      </div>

      {/* Order summary */}
      <TableDetailSummaryPrice activeOrder={activeOrder} additionalOrder={additionalOrder} />
      <div className="mt-8 flex justify-center">
        <Button
          className="w-full"
          variant="default"
          size="lg"
          onClick={handleSubmitOrder}
          disabled={activeOrder.isPaid() || isLoading}
          isLoading={isLoading}
        >
          <SendIcon className="size-4" />
          Gửi
        </Button>
      </div>

      {activeOrder.canMakePayment() && (
        <div className="mt-4 flex justify-center">
          <Button
            className="w-full"
            variant="default"
            size="lg"
            onClick={handleMakePayment}
            isLoading={isLoading}
          >
            <CreditCardIcon className="size-4" />
            Thanh toán
          </Button>
        </div>
      )}
    </div>
  );
};
