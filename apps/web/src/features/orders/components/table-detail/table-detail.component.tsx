import { Order } from '@/domain/entity';
import { OrderDish } from '@/domain/entity/order-dish';
import { AddDishOrderForm } from '../add-dish-order-form/add-dish-order-form.component';
import { useState } from 'react';
import { EditIcon, SendIcon, XIcon } from 'lucide-react';
import defaultDishImage from '@/assets/default-dish.png';
import { BackButton, Badge, Button, EditableField, QuantityInput } from '@/components/ui';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useCreateOrder, useInitOrderDetail, useOrderDishUpdate } from '../../hooks';
import { TableDetailSummaryPrice } from './summary-price.component';

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
  } = useInitOrderDetail(
    initialOrder?.id || '',
    createParams?.table || '',
    createParams?.customerCount || 0,
  );
  const { createDraftOrder, createAdditionalOrder } = useCreateOrder();
  const { addOrderDishToOrder } = useOrderDishUpdate();
  const router = useRouter();

  // Helper function to remove dish
  const removeDish = (dishId: string) => {
    if (activeOrder) {
      setActiveOrder(activeOrder.removeDish(dishId));
    }
  };

  // Helper function to edit dish
  const handleEditDish = (orderDish: OrderDish) => {
    setSelectedDishForEdit(orderDish);
  };

  const updateDishQuantity = (dishId: string, quantity: number) => {
    if (activeOrder) {
      setActiveOrder(activeOrder.updateDishQuantity(dishId, quantity));
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
    if (activeOrder.isMainOrder()) {
      await createDraftOrder(activeOrder);
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
      const updatedOrder = addOrderDishToOrder(activeOrder, orderDish);
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
        setAdditionalOrder(addOrderDishToOrder(additionalOrder, orderDish));
      }
    }
  };

  if (isPending) {
    return <div>Đang tải đơn hàng...</div>;
  }

  if (isError) {
    return <div>Lỗi tải đơn hàng</div>;
  }

  if (!activeOrder) {
    return <div>Không tìm thấy đơn hàng</div>;
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-white p-4 md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
      {/* Back button */}
      <div className="mb-4">
        <BackButton />
      </div>

      {/* Header with restaurant name */}
      <div className="mb-6 text-center md:mb-10">
        <h1 className="mb-4 text-xl font-bold md:text-2xl lg:text-3xl">Bàn {activeOrder.table}</h1>
        <Badge variant="outline" className="mb-4">
          {activeOrder.status}
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
          activeOrder.dishes.map((dish) => (
            <div
              key={dish.id || dish.dishId}
              className="border-b border-dashed pb-4 last:border-b-0 md:rounded-lg md:p-4 md:pb-6 md:transition-colors md:hover:bg-gray-50"
            >
              <div className="flex items-start gap-4 md:gap-6">
                {/* Dish image */}
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md md:h-20 md:w-20 lg:h-24 lg:w-24">
                  <img
                    src={defaultDishImage}
                    alt={dish.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = defaultDishImage;
                    }}
                  />
                </div>

                {/* Dish details */}
                <div className="flex-1 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium md:text-lg lg:text-xl">
                        {dish.name} {dish.takeAway && '(Mang về)'}
                      </h3>
                      <div className="text-sm text-gray-500 md:mt-1 md:text-base lg:mt-2">
                        {/* Show variant info */}
                        {Object.entries(dish.getDishOptionNameGroupById()).map(
                          ([dishOptionId, dishOptionNameGroup], index) => (
                            <div key={dishOptionId} className={index > 0 ? 'mt-1 md:mt-2' : ''}>
                              <span className="md:font-medium">
                                {dishOptionNameGroup[0].dishOptionName}:{' '}
                              </span>
                              <span className="font-semibold">
                                {dishOptionNameGroup.map((item) => item.itemLabel).join(' - ')}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                      <div className="mt-2 text-gray-700 md:mt-3 md:text-lg lg:text-xl">
                        <span className="font-semibold">
                          {dish.getFormattedPriceWithSelectedOption()}
                        </span>{' '}
                        (x{dish.quantity} = {dish.getFormattedTotalPrice()})
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeDish(dish.id || dish.dishId)}
                      className="text-gray-400 hover:text-gray-600 md:rounded md:p-1 md:hover:bg-gray-100"
                      aria-label="Remove item"
                    >
                      <XIcon size={18} className="md:h-5 md:w-5 lg:h-6 lg:w-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-4 flex items-center justify-between md:mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditDish(dish);
                  }}
                >
                  <EditIcon size={16} />
                  Sửa
                </Button>

                <QuantityInput
                  value={dish.quantity}
                  onChange={(value) => updateDishQuantity(dish.id || dish.dishId, value)}
                  min={1}
                  size="md"
                  className="md:gap-4"
                  valueClassName="md:w-8 md:text-lg lg:text-xl"
                  buttonClassName="md:h-10 md:w-10 lg:h-12 lg:w-12"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Additional order */}
      {!activeOrder.canEdit() && (
        <div className="space-y-6 md:space-y-8">
          <h2 className="mt-6 text-lg font-medium md:text-xl lg:text-2xl">Món gọi thêm</h2>
          <div className="space-y-6 md:space-y-8">
            {additionalOrder?.dishes.map((dish) => (
              <div
                key={dish.id || dish.dishId}
                className="border-b border-dashed pb-4 last:border-b-0 md:rounded-lg md:p-4 md:pb-6 md:transition-colors md:hover:bg-gray-50"
              >
                <div className="flex items-start gap-4 md:gap-6">
                  {/* Dish image */}
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md md:h-20 md:w-20 lg:h-24 lg:w-24">
                    <img
                      src={defaultDishImage}
                      alt={dish.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = defaultDishImage;
                      }}
                    />
                  </div>

                  {/* Dish details */}
                  <div className="flex-1 cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium md:text-lg lg:text-xl">
                          {dish.name} {dish.takeAway && '(Mang về)'}
                        </h3>
                        <div className="text-sm text-gray-500 md:mt-1 md:text-base lg:mt-2">
                          {/* Show variant info */}
                          {Object.entries(dish.getDishOptionNameGroupById()).map(
                            ([dishOptionId, dishOptionNameGroup], index) => (
                              <div key={dishOptionId} className={index > 0 ? 'mt-1 md:mt-2' : ''}>
                                <span className="md:font-medium">
                                  {dishOptionNameGroup[0].dishOptionName}:{' '}
                                </span>
                                <span className="font-semibold">
                                  {dishOptionNameGroup.map((item) => item.itemLabel).join(' - ')}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                        <div className="mt-2 text-gray-700 md:mt-3 md:text-lg lg:text-xl">
                          <span className="font-semibold">
                            {dish.getFormattedPriceWithSelectedOption()}
                          </span>{' '}
                          (x{dish.quantity} = {dish.getFormattedTotalPrice()})
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeDish(dish.id || dish.dishId)}
                        className="text-gray-400 hover:text-gray-600 md:rounded md:p-1 md:hover:bg-gray-100"
                        aria-label="Remove item"
                      >
                        <XIcon size={18} className="md:h-5 md:w-5 lg:h-6 lg:w-6" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="mt-4 flex items-center justify-between md:mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditDish(dish);
                    }}
                  >
                    <EditIcon size={16} />
                    Sửa
                  </Button>

                  <QuantityInput
                    value={dish.quantity}
                    onChange={(value) => updateDishQuantity(dish.id || dish.dishId, value)}
                    min={1}
                    size="md"
                    className="md:gap-4"
                    valueClassName="md:w-8 md:text-lg lg:text-xl"
                    buttonClassName="md:h-10 md:w-10 lg:h-12 lg:w-12"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit dish button */}
      <div className="mt-6 flex justify-center">
        <AddDishOrderForm
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
