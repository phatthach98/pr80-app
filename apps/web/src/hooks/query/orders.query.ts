import { apiClient } from '@/api/api-client';
import { Order } from '@/domain/entity';
import { EOrderStatus, OrderResponseDTO } from '@pr80-app/shared-contracts';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

// Query key factory pattern for orders domain
export const ordersKeys = {
  all: ['orders'] as const,
  lists: () => [...ordersKeys.all, 'list'] as const,
  list: (filters?: { status?: EOrderStatus; createdAt?: Date }) => {
    // Ensure we have a stable reference for the filters object by serializing the date
    const stableFilters = filters
      ? {
          ...filters,
          // If createdAt exists, format it as YYYY-MM-DD only
          ...(filters.createdAt && {
            createdAt: filters.createdAt.toISOString(),
          }),
        }
      : undefined;

    return [...ordersKeys.lists(), { filters: stableFilters }] as const;
  },
  details: () => [...ordersKeys.all, 'detail'] as const,
  detail: (id: string) => [...ordersKeys.details(), id] as const,
} as const;

// Fetch functions separated from hooks for reusability
export const fetchOrders = async (filters?: {
  status?: EOrderStatus;
  createdAt?: string;
}): Promise<OrderResponseDTO[]> => {
  const queryParams = new URLSearchParams();

  if (filters?.status) {
    queryParams.append('status', filters.status);
  }

  if (filters?.createdAt) {
    // Ensure we're sending a properly formatted date string to the API
    // If it's already a string, use it; otherwise format it
    const dateStr = filters.createdAt;
    queryParams.append('createdAt', dateStr);
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
  if (!id) {
    throw new Error('Order id is required');
  }
  const response = await apiClient.get<OrderResponseDTO>(`/orders/${id}`);

  if (!response.success) {
    throw new Error(response.error.message || `Failed to fetch order with id: ${id}`);
  }

  return response.data;
};

// Hook for fetching orders list with proper transformation to domain entities
export const useOrdersQuery = (filters?: { status?: EOrderStatus; createdAt?: Date }) => {
  // Process filters to ensure consistent date format with only YYYY-MM-DD
  const processedFilters: { status?: EOrderStatus; createdAt?: string } = {};

  // Only copy defined properties
  if (filters?.status) {
    processedFilters.status = filters.status;
  }

  // Format date to YYYY-MM-DD for API requests
  if (filters?.createdAt) {
    processedFilters.createdAt = filters.createdAt.toISOString();
  }

  return useSuspenseQuery({
    queryKey: ordersKeys.list(filters), // Use original filters for cache key
    queryFn: () => fetchOrders(processedFilters), // Use processed filters for API call
    staleTime: 1 * 60 * 1000, // 2 minutes cache
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
    enabled: !!id,
    // 5s
    staleTime: 5 * 1000, // 5 seconds cache
  });
};
