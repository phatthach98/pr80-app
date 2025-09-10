import { localStorageUtil } from './local-storage.util';

export const ORDERS_LOCAL_STORAGE_KEY = 'pr-80.orders';

export const ordersLocalStorageUtil = {
  getLocalOrders: () => localStorageUtil.getItem(ORDERS_LOCAL_STORAGE_KEY),
  setLocalOrders: (localOrders: any[]) => {
    localStorageUtil.setItem(ORDERS_LOCAL_STORAGE_KEY, JSON.stringify(localOrders));
  },
  removeLocalOrders: () => {
    localStorageUtil.removeItem(ORDERS_LOCAL_STORAGE_KEY);
  },
};
