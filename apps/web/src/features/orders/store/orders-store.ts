import { ordersLocalStorageUtil } from '@/utils/order-local-storage.util';
import { Store } from '@tanstack/react-store';
import { Order, TableView } from '@/domain/entity';

/**
 * TablesState represents the state of tables in the application
 * It only stores data, with no business logic
 */
interface OrdersState {
  draftOrders: Order[];
  apiOrders: Order[];
  selectedOrderId: string | null;
}

// Initialize state
const initialState: OrdersState = {
  draftOrders: [],
  apiOrders: [],
  selectedOrderId: null,
};

// Load initial state from localStorage if available
const loadInitialState = (): OrdersState => {
  if (typeof window === 'undefined') return initialState;

  try {
    const storedOrders = ordersLocalStorageUtil.getLocalOrders();
    if (storedOrders) {
      const localOrders: TableView[] = JSON.parse(storedOrders);
      return {
        ...initialState,
        draftOrders: Order.fromLocalOrderList(localOrders),
      };
    }
  } catch (error) {
    console.error('Failed to load orders from localStorage:', error);
  }

  return initialState;
};

// Create the store
export const ordersStore = new Store<OrdersState>(loadInitialState());

// Basic state setters
export const setDraftOrders = (draftOrders: Order[]) => {
  ordersStore.setState((state) => ({
    ...state,
    draftOrders,
  }));
};

export const setApiOrders = (apiOrders: Order[]) => {
  ordersStore.setState((state) => ({
    ...state,
    apiOrders,
  }));
};

export const setSelectedOrderId = (selectedOrderId: string | null) => {
  ordersStore.setState((state) => ({
    ...state,
    selectedOrderId,
  }));
};

// Basic state getters
export const getDraftOrders = (): Order[] => {
  return ordersStore.state.draftOrders;
};

export const getApiOrders = (): Order[] => {
  return ordersStore.state.apiOrders;
};

export const getSelectedOrderId = (): string | null => {
  return ordersStore.state.selectedOrderId;
};
