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
import { TableSelector } from './table-selector.component';
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
    initialOrder || null,
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
    if (activeOrder?.canEditOrderDish()) {
      setActiveOrder(activeOrder.removeDish(dishId));
    }
    if (additionalOrder?.canEditOrderDish()) {
      setAdditionalOrder(additionalOrder.removeDish(dishId));
    }
  };

  // Helper function to edit dish
  const handleEditDish = (orderDish: OrderDish) => {
    setSelectedDishForEdit(orderDish);
  };

  const updateDishQuantity = (dishId: string, quantity: number) => {
    if (activeOrder?.canEditOrderDish()) {
      setActiveOrder(activeOrder.updateDishQuantity(dishId, quantity));
    }
    if (additionalOrder?.canEditOrderDish()) {
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
    try {
      setIsLoading(true);
      if (!activeOrder) {
        toast.error('Không tìm thấy đơn hàng');
        return;
      }
      if (activeOrder.canEditOrderDish()) {
        await createDraftTable(activeOrder);
      }
      if (additionalOrder && additionalOrder.canEditOrderDish()) {
        await createAdditionalTable(additionalOrder);
      }

      if (!activeOrder.canEditOrderDish()) {
        await updateTable(activeOrder);
      }
      toast.success('Đơn hàng đã được gửi');
      router.navigate({ to: '/tables' });
    } catch {
      toast.error('Gửi đơn hàng thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
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
    if (activeOrder && activeOrder.canEditOrderDish()) {
      const updatedOrder = addOrderDishToTable(activeOrder, orderDish);
      if (updatedOrder) {
        setActiveOrder(updatedOrder);
      }
    }

    // For add more dishes on pending order, create additional order
    if (activeOrder && !activeOrder.canEditOrderDish()) {
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
        <div className="mb-2 flex flex-col items-center justify-center gap-2 md:flex-row">
          <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">{currentTable.label}</h1>
          {activeOrder.id && !activeOrder.isPaid() && !activeOrder.isDraft() && (
            <TableSelector
              orderId={activeOrder.id}
              currentTable={activeOrder.table}
              disabled={!activeOrder.canEditOrder()}
            />
          )}
        </div>
        <div className="text-sm font-light text-gray-700 italic">
          Nhân viên: <span className="font-bold">{activeOrder.createdByUser?.name}</span>
        </div>

        <div className="flex items-center justify-center">
          <EditableField
            value={activeOrder.customerCount.toString()}
            onSave={handleUpdateCustomerCount}
            disabled={!activeOrder.canEditOrder()}
            type="number"
            placeholder="Số lượng khách"
            displayClassName="text-gray-600 text-center"
            inputClassName="w-20 text-center mx-auto"
          />{' '}
          khách
        </div>
      </div>

      <div className="bg-secondary/50 mb-4 rounded-md border border-dashed border-gray-400 px-4 py-2 md:mb-6 md:p-4">
        <EditableField
          label="Ghi chú bàn"
          value={activeOrder.note || ''}
          onSave={handleUpdateNote}
          disabled={!activeOrder.canEditOrder()}
          type="textarea"
          placeholder="Không có ghi chú. Nhấp để thêm ghi chú."
          displayClassName=" text-gray-600"
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
                    isEditable={order.canEditOrderDish()}
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
      {!activeOrder.canEditOrderDish() && (
        <div>
          <h2 className="mt-6 text-lg font-medium md:text-xl lg:text-2xl">Món gọi thêm</h2>
          <div className="space-y-6 md:space-y-8">
            {additionalOrder?.dishes.map((dish) => {
              return (
                <TableDishItem
                  isEditable={additionalOrder.canEditOrderDish()}
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
          disabled={activeOrder.isPaid() || !activeOrder.canEditOrder()}
        />
      </div>

      {/* Order summary */}
      <TableDetailSummaryPrice activeOrder={activeOrder} additionalOrder={additionalOrder} />

      <div className="mt-8 flex flex-col items-center justify-center gap-6">
        <Button
          className={'w-full'}
          variant="default"
          size="xl"
          onClick={handleSubmitOrder}
          disabled={activeOrder.isPaid() || isLoading}
          isLoading={isLoading}
        >
          <SendIcon className="size-4" />
          Gửi
        </Button>

        {activeOrder.canMakePayment() && (
          <Button
            className="w-full"
            variant="default"
            size="xl"
            onClick={handleMakePayment}
            isLoading={isLoading}
          >
            <CreditCardIcon className="size-4" />
            Thanh toán
          </Button>
        )}
      </div>
    </div>
  );
};
