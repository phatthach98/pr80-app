import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/api-client';
import {
  CreateOrderRequestDTO,
  OrderResponseDTO,
  UpdateOrderRequestDTO,
  CreateAdditionalOrderRequestDTO,
  AddOrderItemRequestDTO,
  EOrderStatus,
} from '@pr80-app/shared-contracts';
import { ordersKeys } from '../query/orders.query';

// Mutation functions
const createOrder = async (data: CreateOrderRequestDTO): Promise<OrderResponseDTO> => {
  const response = await apiClient.post<OrderResponseDTO>('/orders', data);
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const updateOrder = async ({
  orderId,
  data,
}: {
  orderId: string;
  data: UpdateOrderRequestDTO;
}): Promise<OrderResponseDTO> => {
  const response = await apiClient.put<OrderResponseDTO>(`/orders/${orderId}`, data);
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const updateOrderStatus = async ({
  orderId,
  status,
}: {
  orderId: string;
  status: EOrderStatus;
}): Promise<OrderResponseDTO> => {
  const response = await apiClient.patch<OrderResponseDTO>(`/orders/${orderId}/status`, { status });
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const updateOrderTable = async ({
  orderId,
  table,
}: {
  orderId: string;
  table: string;
}): Promise<OrderResponseDTO> => {
  const response = await apiClient.patch<OrderResponseDTO>(`/orders/${orderId}/table`, { table });
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const createAdditionalOrder = async (
  data: CreateAdditionalOrderRequestDTO,
): Promise<OrderResponseDTO> => {
  const response = await apiClient.post<OrderResponseDTO>('/orders/additional', data);
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const addOrderItem = async (data: AddOrderItemRequestDTO): Promise<OrderResponseDTO> => {
  const response = await apiClient.post<OrderResponseDTO>(`/orders/${data.orderId}/items`, data);
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const updateOrderItemQuantity = async ({
  orderId,
  dishItemId,
  quantity,
}: {
  orderId: string;
  dishItemId: string;
  quantity: number;
}): Promise<OrderResponseDTO> => {
  const response = await apiClient.patch<OrderResponseDTO>(
    `/orders/${orderId}/items/${dishItemId}/quantity`,
    { quantity },
  );
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const removeOrderItem = async ({
  orderId,
  dishItemId,
}: {
  orderId: string;
  dishItemId: string;
}): Promise<OrderResponseDTO> => {
  const response = await apiClient.delete<OrderResponseDTO>(
    `/orders/${orderId}/items/${dishItemId}`,
  );
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

// Mutation hooks
export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      // Invalidate orders queries to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ordersKeys.all });

      // Optionally add the new order to the cache
      queryClient.setQueryData(ordersKeys.detail(data.id), data);
    },
    onError: (error) => {
      console.error('Failed to create order:', error);
    },
  });
};

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrder,
    onSuccess: (data) => {
      // Invalidate the specific order query
      queryClient.invalidateQueries({ queryKey: ordersKeys.detail(data.id) });

      // Invalidate the orders list query
      queryClient.invalidateQueries({ queryKey: ordersKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update order:', error);
    },
  });
};

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (data) => {
      // Invalidate the specific order query
      queryClient.invalidateQueries({ queryKey: ordersKeys.detail(data.id) });

      // Invalidate the orders list query
      queryClient.invalidateQueries({ queryKey: ordersKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update order status:', error);
    },
  });
};

export const useUpdateOrderTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderTable,
    onSuccess: (data) => {
      // Invalidate the specific order query
      queryClient.invalidateQueries({ queryKey: ordersKeys.detail(data.id) });

      // Invalidate the orders list query
      queryClient.invalidateQueries({ queryKey: ordersKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update order table:', error);
    },
  });
};

export const useCreateAdditionalOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdditionalOrder,
    onSuccess: (data) => {
      // Invalidate orders queries to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ordersKeys.all });

      // Optionally add the new order to the cache
      queryClient.setQueryData(ordersKeys.detail(data.id), data);
    },
    onError: (error) => {
      console.error('Failed to create additional order:', error);
    },
  });
};

export const useAddOrderItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrderItem,
    onSuccess: (data) => {
      // Invalidate the specific order query
      queryClient.invalidateQueries({ queryKey: ordersKeys.detail(data.id) });
    },
    onError: (error) => {
      console.error('Failed to add order item:', error);
    },
  });
};

export const useUpdateOrderItemQuantityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderItemQuantity,
    onSuccess: (data) => {
      // Invalidate the specific order query
      queryClient.invalidateQueries({ queryKey: ordersKeys.detail(data.id) });
    },
    onError: (error) => {
      console.error('Failed to update order item quantity:', error);
    },
  });
};

export const useRemoveOrderItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeOrderItem,
    onSuccess: (data) => {
      // Invalidate the specific order query
      queryClient.invalidateQueries({ queryKey: ordersKeys.detail(data.id) });
    },
    onError: (error) => {
      console.error('Failed to remove order item:', error);
    },
  });
};
