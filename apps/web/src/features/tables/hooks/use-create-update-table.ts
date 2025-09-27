import { Order } from '@/domain/entity';
import {
  useCreateAdditionalOrderMutation,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
} from '@/hooks/mutation/orders.mutation';
import { OrderResponseDTO } from '@pr80-app/shared-contracts';

export const useCreateUpdateTable = () => {
  const { mutateAsync: createOrderMutation } = useCreateOrderMutation();
  const { mutateAsync: createAdditionalOrderMutation } = useCreateAdditionalOrderMutation();
  const { mutateAsync: updateOrderMutation } = useUpdateOrderMutation();
  const { mutateAsync: updateOrderStatusBasedOnCurrentStatusMutation } =
    useUpdateOrderStatusMutation();
  const createDraftTable = async (order: Order): Promise<OrderResponseDTO> => {
    if (!order.table || order.customerCount <= 0) {
      throw new Error('Invalid table or customer count');
    }

    const createdOrder = await createOrderMutation(order.toCreateOrderDTO());

    return createdOrder;
  };

  const createAdditionalTable = async (order: Order): Promise<OrderResponseDTO> => {
    if (!order.id) {
      throw new Error('Invalid original order');
    }

    if (order.dishes.length === 0) {
      throw new Error('Additional order must have at least one dish');
    }

    const createdOrder = await createAdditionalOrderMutation(order.toCreateAdditionalOrderDTO());

    return createdOrder;
  };

  const updateTable = async (order: Order): Promise<OrderResponseDTO> => {
    if (!order.id) {
      throw new Error('Invalid order');
    }

    const updatedOrder = await updateOrderMutation(order.toUpdateOrderDTO());

    return updatedOrder;
  };

  const updateOrderStatusBasedOnCurrentStatus = async (
    orderId: string,
  ): Promise<OrderResponseDTO> => {
    const updatedOrder = await updateOrderStatusBasedOnCurrentStatusMutation({ orderId });

    return updatedOrder;
  };

  return {
    createDraftTable,
    createAdditionalTable,
    updateTable,
    updateOrderStatusBasedOnCurrentStatus,
  };
};
