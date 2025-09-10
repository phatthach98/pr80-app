import { Order, TableView } from '@/domain/entity';
import { useStore } from '@tanstack/react-store';
import {
  getDraftOrders,
  getApiOrders,
  getSelectedOrderId,
  setDraftOrders,
  setSelectedOrderId,
  ordersStore,
  setApiOrders,
} from '../store/orders-store';
import { ordersLocalStorageUtil } from '@/utils/order-local-storage.util';

type UseTablesType = {
  // Data
  orders: Order[];
  tables: TableView[];
  selectedOrder: Order | null;
  selectedTable: TableView | null;
  relatedOrders: Order[];

  // Actions
  addLocalTable: (table: TableView) => void;
  removeTable: (tableId: string) => void;
  clearLocalDraftTables: () => void;
  selectOrderById: (orderId: string | null) => void;
  getOrdersForTableNumber: (tableNumber: string) => Order[];
  updateSelectedOrderToStore: (order: Order) => void;
  setSelectedOrderId: (orderId: string | null) => void;
};

/**
 * Hook for managing tables/orders data
 * @param apiOrders - Optional parameter for compatibility, but internally uses store data
 * @returns Table management functions and data
 */
export const useTables = (_apiOrders?: Order[]): UseTablesType => {
  // Subscribe to the store
  useStore(ordersStore);

  // Get all orders (combined from both sources)
  const getAllOrders = (): Order[] => {
    return [...getDraftOrders(), ...getApiOrders()];
  };

  // Get all tables (combined from both sources, mapped to table view)
  const getAllTables = (): TableView[] => {
    const allOrders = getAllOrders();
    return Order.toTableView(allOrders);
  };

  // Get the selected order
  const getSelectedOrder = (): Order | null => {
    const selectedOrderId = getSelectedOrderId();
    if (!selectedOrderId) return null;
    return getAllOrders().find((order) => order.id === selectedOrderId) || null;
  };

  // Get the selected table view
  const getSelectedTable = (): TableView | null => {
    const selectedOrder = getSelectedOrder();
    if (!selectedOrder) return null;

    const tableViews = Order.toTableView([selectedOrder]);
    return tableViews.length > 0 ? tableViews[0] : null;
  };

  // Get all orders for a specific table number
  const getOrdersForTableNumber = (tableNumber: string): Order[] => {
    const allOrders = getAllOrders();
    return allOrders.filter((order) => order.table === tableNumber);
  };

  // Get related orders for a selected order
  const getRelatedOrders = (): Order[] => {
    const selectedOrder = getSelectedOrder();

    if (!selectedOrder) return [];

    // Get all orders with the same table number from the API orders
    return getApiOrders().filter(
      (order) => order.table === selectedOrder.table && order.id !== selectedOrder.id,
    );
  };

  // Action to add a local table (draft order)
  const addLocalTable = (table: TableView) => {
    const draftOrders = getDraftOrders();
    const existedOrderIndex = draftOrders.findIndex((order) => order.table === table.tableNumber);
    let updatedDraftOrders = [...draftOrders];

    if (existedOrderIndex >= 0) {
      // Update existing order
      const existingOrder = updatedDraftOrders[existedOrderIndex];
      updatedDraftOrders[existedOrderIndex] = new Order({
        ...existingOrder,
        status: table.status,
        customerCount: table.customerCount,
      });
    } else if (table.customerCount > 0 && table.tableNumber) {
      // Add new order
      const newOrder = Order.fromLocalTable(table);
      updatedDraftOrders = [...draftOrders, newOrder];
    }

    // Save to localStorage
    const localTables = updatedDraftOrders.map((order) => order.toLocalOrder());
    ordersLocalStorageUtil.setLocalOrders(localTables);

    // Update state
    setDraftOrders(updatedDraftOrders);
  };

  // Action to remove a local table (draft order)
  const removeLocalTable = (tableId: string) => {
    const draftOrders = getDraftOrders();
    const order = draftOrders.find((o) => o.id === tableId);

    if (!order) return;

    const tableNumber = order.table;
    const updatedDraftOrders = draftOrders.filter((order) => order.table !== tableNumber);

    // Save to localStorage
    const localTables = updatedDraftOrders.map((order) => order.toLocalOrder());
    ordersLocalStorageUtil.setLocalOrders(localTables);

    // Update state
    setDraftOrders(updatedDraftOrders);

    // If the selected order is being removed, unselect it
    const selectedOrderId = getSelectedOrderId();
    if (selectedOrderId === tableId) {
      setSelectedOrderId(null);
    }
  };

  // Action to clear all local tables (draft orders)
  const clearLocalDraftTables = () => {
    ordersLocalStorageUtil.removeLocalOrders();

    // Check if selected order is a draft order
    const selectedOrderId = getSelectedOrderId();
    const draftOrders = getDraftOrders();
    const isSelectedOrderDraft =
      selectedOrderId && draftOrders.some((order) => order.id === selectedOrderId);

    // Update state
    setDraftOrders([]);

    // If the selected order is a draft order, unselect it
    if (isSelectedOrderDraft) {
      setSelectedOrderId(null);
    }
  };

  // Action to select an order
  const selectOrderById = (orderId: string | null) => {
    setSelectedOrderId(orderId);
  };

  const updateSelectedOrderToStore = (order: Order) => {
    if (order.source === 'local') {
      setDraftOrders(getDraftOrders().map((o) => (o.id === order.id ? order : o)));
    } else {
      setApiOrders(getApiOrders().map((o) => (o.id === order.id ? order : o)));
    }
  };

  return {
    orders: getAllOrders(),
    tables: getAllTables(),
    selectedOrder: getSelectedOrder(),
    selectedTable: getSelectedTable(),
    relatedOrders: getRelatedOrders(),
    addLocalTable,
    removeTable: (tableId: string) => {
      // Check if it's a local table (source is local)
      const order = getAllOrders().find((o) => o.id === tableId);
      if (order && order.source === 'local') {
        removeLocalTable(tableId);
      } else {
        console.warn('Cannot remove API orders');
      }
    },
    clearLocalDraftTables,
    selectOrderById,
    getOrdersForTableNumber,
    updateSelectedOrderToStore,
    setSelectedOrderId,
  };
};
