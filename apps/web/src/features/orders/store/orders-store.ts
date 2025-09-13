import { Store } from '@tanstack/react-store';
import { Order } from '@/domain/entity';

/**
 * TablesState represents the state of tables in the application
 * It only stores data, with no business logic
 */
interface OrdersState {
  orders: Order[];
  selectedOrderId: string | null;
  currentDraftOrder: Order | null;
}

// Initialize state
const initialState: OrdersState = {
  orders: [],
  selectedOrderId: null,
  currentDraftOrder: null,
};

// Create the store
export const ordersStore = new Store<OrdersState>(initialState);

// Basic state setters
export const setOrders = (orders: Order[]) => {
  ordersStore.setState((state) => ({
    ...state,
    orders,
  }));
};

export const setSelectedOrderId = (selectedOrderId: string | null) => {
  ordersStore.setState((state) => ({
    ...state,
    selectedOrderId,
  }));
};

export const getOrders = (): Order[] => {
  return ordersStore.state.orders;
};

export const getCurrentDraftOrder = (): Order | null => {
  return ordersStore.state.currentDraftOrder;
};

export const setCurrentDraftOrder = (currentDraftOrder: Order | null) => {
  ordersStore.setState((state) => ({
    ...state,
    currentDraftOrder,
  }));
};

export const getSelectedOrder = (selectedOrderId: string | null): Order | null => {
  if (!selectedOrderId) return null;
  const selectedOrder = getOrders().find((order) => order.id === selectedOrderId) || null;
  return selectedOrder;
};

export const resetOrdersState = () => {
  ordersStore.setState(initialState);
};
