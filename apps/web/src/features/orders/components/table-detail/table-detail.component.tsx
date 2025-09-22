import { Order } from '@/domain/entity';
import { OrderDish } from '@/domain/entity/order-dish';
import { ordersStore, setCurrentDraftOrder } from '../../store';
import { AddDishOrderForm } from '../add-dish-order-form/add-dish-order-form.component';
import { useStore } from '@tanstack/react-store';
import { useEffect, useState } from 'react';
import { EditIcon, XIcon } from 'lucide-react';
import defaultDishImage from '@/assets/default-dish.png';
import { BackButton, Badge, Button, EditableField, QuantityInput } from '@/components/ui';
import { SubmitOrderButton } from '../submit-order-button.component';

export interface TableDetailProps {
  /**
   * The order to display. If provided, component will be in "view/edit" mode.
   */
  order?: Order;

  /**
   * Create mode parameters. If provided, component will be in "create" mode.
   */
  createParams?: {
    table: string;
    customerCount: number;
  };

  /**
   * Optional callback when order is updated (in either create or view/edit mode)
   */
  onOrderUpdate?: (order: Order) => void;
}

/**
 * TableDetail component that can be used for both creating tables and viewing table details
 */
export const TableDetail = ({
  order: initialOrder,
  createParams,
  onOrderUpdate,
}: TableDetailProps) => {
  const [selectedDishForEdit, setSelectedDishForEdit] = useState<OrderDish | undefined>();
  const isCreate = !initialOrder && !!createParams;

  // For create mode
  const { currentDraftOrder } = useStore(ordersStore);

  // For view/edit mode
  const [order, setOrder] = useState<Order | null>(initialOrder || null);

  useEffect(() => {
    if (isCreate && createParams) {
      // Create mode - use the provided create params
      if (!currentDraftOrder) {
        const newDraftOrder = Order.fromDraftOrder({
          table: createParams.table,
          customerCount: createParams.customerCount,
        });
        setCurrentDraftOrder(newDraftOrder);
        if (onOrderUpdate) {
          onOrderUpdate(newDraftOrder);
        }
      }
    } else if (initialOrder) {
      // View/edit mode - use the provided order
      setOrder(initialOrder);
    }
  }, [isCreate, createParams, initialOrder]);

  // Use either the current draft order (for create) or the loaded order (for view/edit)
  const activeOrder = isCreate ? currentDraftOrder : order;

  if (!activeOrder) {
    return <div>Không tìm thấy đơn hàng</div>;
  }

  // Helper function to update dish quantity
  const updateDishQuantity = (dishId: string, quantity: number) => {
    if (isCreate && currentDraftOrder) {
      const updatedOrder = currentDraftOrder.updateDishQuantity(dishId, quantity);
      setCurrentDraftOrder(updatedOrder);
      if (onOrderUpdate) {
        onOrderUpdate(updatedOrder);
      }
    } else if (order) {
      const updatedOrder = order.updateDishQuantity(dishId, quantity);
      setOrder(updatedOrder);
      if (onOrderUpdate) {
        onOrderUpdate(updatedOrder);
      }
    }
  };

  // Helper function to remove dish
  const removeDish = (dishId: string) => {
    if (isCreate && currentDraftOrder) {
      const updatedOrder = currentDraftOrder.removeDish(dishId);
      setCurrentDraftOrder(updatedOrder);
      if (onOrderUpdate) {
        onOrderUpdate(updatedOrder);
      }
    } else if (order) {
      const updatedOrder = order.removeDish(dishId);
      setOrder(updatedOrder);
      if (onOrderUpdate) {
        onOrderUpdate(updatedOrder);
      }
    }
  };

  // Helper function to edit dish
  const handleEditDish = (dish: OrderDish) => {
    setSelectedDishForEdit(dish);
  };

  // Helper function to update note
  const handleUpdateNote = (value: string) => {
    if (isCreate && currentDraftOrder) {
      const updatedOrder = currentDraftOrder.updateNote(value);
      setCurrentDraftOrder(updatedOrder);
      if (onOrderUpdate) {
        onOrderUpdate(updatedOrder);
      }
    } else if (order) {
      const updatedOrder = order.updateNote(value);
      setOrder(updatedOrder);
      if (onOrderUpdate) {
        onOrderUpdate(updatedOrder);
      }
    }
  };

  // Helper function to update customer count
  const handleUpdateCustomerCount = (value: string) => {
    const count = parseInt(value, 10);
    if (count > 0) {
      if (isCreate && currentDraftOrder) {
        const updatedOrder = new Order({
          ...currentDraftOrder,
          customerCount: count,
        });
        setCurrentDraftOrder(updatedOrder);
        if (onOrderUpdate) {
          onOrderUpdate(updatedOrder);
        }
      } else if (order) {
        const updatedOrder = new Order({
          ...order,
          customerCount: count,
        });
        setOrder(updatedOrder);
        if (onOrderUpdate) {
          onOrderUpdate(updatedOrder);
        }
      }
    }
  };

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

      {/* Dish list */}
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
                      <h3 className="font-medium md:text-lg lg:text-xl">{dish.name}</h3>
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

      {/* Add/Edit dish button */}
      <div className="mt-6 flex justify-center">
        <AddDishOrderForm
          orderDish={selectedDishForEdit}
          onClose={() => setSelectedDishForEdit(undefined)}
        />
      </div>

      {/* Order summary */}
      <div className="mt-8 space-y-3 border-t border-dashed pt-6 text-lg md:mx-auto md:mt-12 md:pt-6">
        <div className="flex justify-between md:text-lg">
          <span className="text-gray-600">Tổng tiền</span>
          <span className="font-medium">{activeOrder.getFormattedTotalAmount()}</span>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <SubmitOrderButton order={isCreate ? undefined : order || undefined} />
      </div>
    </div>
  );
};
