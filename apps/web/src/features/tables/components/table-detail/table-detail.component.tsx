import { Order } from '@/domain/entity';
import { OrderDish } from '@/domain/entity/order-dish';
import { AddDishToTableForm } from '../add-dish-to-table-form/add-dish-to-table-form.component';
import { useState } from 'react';
import { SendIcon } from 'lucide-react';
import { BackButton, Badge, Button, EditableField } from '@/components/ui';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useCreateUpdateTable, useInitTableDetail, useOrderDishUpdate } from '../../hooks';
import { TableDetailSummaryPrice } from './summary-price.component';
import { TableDishItem } from './table-dish-item.component';
import { useSettingOptionsQuery } from '@/hooks/query';

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
  const { createDraftTable, createAdditionalTable, updateTable } = useCreateUpdateTable();
  const { addOrderDishToTable } = useOrderDishUpdate();
  const { data: tableOptions } = useSettingOptionsQuery();

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
    toast.success('Đơn hàng đã được gửi');
    router.navigate({ to: '/tables' });
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
    return <div>Đang tải đơn hàng...</div>;
  }

  if (isError) {
    return <div>Lỗi tải đơn hàng</div>;
  }

  const currentTable = tableOptions?.tables.find((table) => table.value === activeOrder?.table) || {
    label: activeOrder.table,
    value: activeOrder.table,
  };
  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-white p-4 md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
      {/* Back button */}
      <div className="mb-4">
        <BackButton />
      </div>

      {/* Header with restaurant name */}
      <div className="mb-6 text-center md:mb-10">
        <h1 className="mb-4 text-xl font-bold md:text-2xl lg:text-3xl">{currentTable.label}</h1>
        <Badge variant="outline" className="mb-4">
          {activeOrder.getDisplayStatus()}
        </Badge>
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
          label="Ghi chú"
          value={activeOrder.note || ''}
          onSave={handleUpdateNote}
          type="textarea"
          placeholder="Không có ghi chú. Nhấp để thêm ghi chú."
          displayClassName="text-sm text-gray-600 md:text-base min-h-[40px]"
          labelClassName="font-medium mb-2"
        />
      </div>

      {/* Dish list  */}
      <div className="space-y-6 md:space-y-8">
        {activeOrder.dishes.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center md:py-12 md:text-lg">
            Chưa có món nào
          </p>
        ) : (
          activeOrder.dishes.map((dish) => {
            return (
              <TableDishItem
                isEditable={activeOrder.canEdit()}
                dish={dish}
                removeDish={removeDish}
                handleEditDish={handleEditDish}
                updateDishQuantity={updateDishQuantity}
              />
            );
          })
        )}
      </div>

      {/* Linked orders */}
      {activeOrder.linkedOrders && (
        <div className="space-y-6 md:space-y-8">
          {activeOrder.linkedOrders.map((order) => {
            return (
              <div key={order.id} className="border-t border-gray-600 pt-6">
                <div className="space-y-6 md:space-y-8">
                  {order.dishes.map((dish) => {
                    return (
                      <TableDishItem
                        isEditable={order.canEdit()}
                        dish={dish}
                        removeDish={removeDish}
                        handleEditDish={handleEditDish}
                        updateDishQuantity={updateDishQuantity}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Additional order */}
      {!activeOrder.canEdit() && (
        <div className="space-y-6 md:space-y-8">
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
        />
      </div>

      {/* Order summary */}
      <TableDetailSummaryPrice activeOrder={activeOrder} additionalOrder={additionalOrder} />
      <div className="mt-8 flex justify-center">
        <Button className="w-full" variant="default" size="lg" onClick={handleSubmitOrder}>
          <SendIcon className="size-4" />
          Gửi
        </Button>
      </div>
    </div>
  );
};
