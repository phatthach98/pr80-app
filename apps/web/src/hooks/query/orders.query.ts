import { apiClient } from '@/api/api-client';
import { Order, TableView } from '@/domain/entity';
import { EOrderStatus, OrderResponseDTO } from '@pr80-app/shared-contracts';
import { useQuery } from '@tanstack/react-query';

// Query key factory pattern for orders domain
export const ordersKeys = {
  all: ['orders'] as const,
  lists: () => [...ordersKeys.all, 'list'] as const,
  list: (filters?: { status?: EOrderStatus }) =>
    [...ordersKeys.lists(), { filters }] as const,
  details: () => [...ordersKeys.all, 'detail'] as const,
  detail: (id: string) => [...ordersKeys.details(), id] as const,
} as const;

// Fetch functions separated from hooks for reusability
export const fetchOrders = async (filters?: {
  status?: EOrderStatus;
}): Promise<OrderResponseDTO[]> => {
  const queryParams = new URLSearchParams();

  if (filters?.status) {
    queryParams.append('status', filters.status);
  }

  const queryString = queryParams.toString();
  const url = `/orders${queryString ? `?${queryString}` : ''}`;

  const response = await apiClient.get<OrderResponseDTO[]>(url);

  if (!response.success) {
    throw new Error(response.error.message || 'Failed to fetch orders');
  }

  return response.data;
};

export const fetchOrderById = async (id: string): Promise<OrderResponseDTO> => {
  const response = await apiClient.get<OrderResponseDTO>(`/orders/${id}`);

  if (!response.success) {
    throw new Error(response.error.message || `Failed to fetch order with id: ${id}`);
  }

  return response.data;
};

// Hook for fetching orders list with proper transformation to domain entities
export const useOrdersQuery = (filters?: { status?: EOrderStatus }) => {
  return useQuery({
    queryKey: ordersKeys.list(filters),
    queryFn: () => fetchOrders(filters),
    select: (data: OrderResponseDTO[]): Order[] => {
      return Order.fromOrderResponseList(data);
    },
  });
};

// Hook for fetching a single order with transformation to Order entity
export const useOrderQuery = (id: string) => {
  return useQuery({
    queryKey: ordersKeys.detail(id),
    queryFn: () => fetchOrderById(id),
    select: (data: OrderResponseDTO): Order => {
      return Order.fromOrderResponse(data);
    },
    enabled: !!id, // Only run query when ID is available
  });
};

// Hook for fetching orders list with transformation to TableView
export const useTablesQuery = (filters?: { status?: EOrderStatus }) => {
  return useQuery({
    queryKey: [...ordersKeys.list(filters), 'tableView'],
    queryFn: () => fetchOrders(filters),
    select: (data: OrderResponseDTO[]): TableView[] => {
      const orders = Order.fromOrderResponseList(data);
      return Order.toTableView(orders);
    },
  });
};