import { Order } from '@/domain/entity';
import { OrderDish } from '@/domain/entity/order-dish';
import {
  useCreateAdditionalOrderMutation,
  useCreateOrderMutation,
} from '@/hooks/mutation/orders.mutation';
import { OrderResponseDTO } from '@pr80-app/shared-contracts';

export const useCreateOrder = () => {
  const { mutateAsync: createOrderMutation } = useCreateOrderMutation();
  const { mutateAsync: createAdditionalOrderMutation } = useCreateAdditionalOrderMutation();
  useCreateAdditionalOrderMutation();

  const createDraftOrder = async (order: Order): Promise<OrderResponseDTO> => {
    if (!order.table || order.customerCount <= 0) {
      throw new Error('Invalid table or customer count');
    }

    const createdOrder = await createOrderMutation(order.toCreateOrderDTO());

    return createdOrder;
  };

  const createAdditionalOrder = async (
    mainOrder: Order,
    newDishes: OrderDish[],
    note: string,
  ): Promise<OrderResponseDTO> => {
    if (!mainOrder.id) {
      throw new Error('Invalid original order');
    }

    if (newDishes.length === 0) {
      throw new Error('Additional order must have at least one dish');
    }

    const newOrder = Order.fromAdditionalOrder(mainOrder, newDishes, note);

    const createdOrder = await createAdditionalOrderMutation(newOrder.toCreateAdditionalOrderDTO());

    return createdOrder;
  };

  return {
    createDraftOrder,
    createAdditionalOrder,
  };
};
