import { Order } from '@/domain/entity';
import { OrderDish } from '@/domain/entity/order-dish';
import { toast } from 'sonner';

export const useOrderDishUpdate = () => {
  const addOrderDishToTable = (order: Order, orderDish: OrderDish): Order | null => {
    if (!order.id) {
      toast.error('Order ID is required');
      return null;
    }
    const existingOrderDish = order.dishes.find((dish) => dish.id === orderDish.id);
    if (existingOrderDish) {
      const newOrder = order.removeDish(existingOrderDish.id);
      return newOrder.addDish(orderDish);
    }

    return order.addDish(orderDish);
  };

  return { addOrderDishToTable };
};
