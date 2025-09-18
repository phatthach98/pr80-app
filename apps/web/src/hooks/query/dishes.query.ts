import { apiClient } from '@/api/api-client';
import { GetDishResponseDTO } from '@pr80-app/shared-contracts';
import { useQuery } from '@tanstack/react-query';
import { Dish } from '@/domain/entity';

// Query key factory pattern for dishes domain
export const dishesKeys = {
  all: ['dishes'] as const,
  lists: () => [...dishesKeys.all, 'list'] as const,
  list: (filters?: { category?: string; search?: string }) =>
    [...dishesKeys.lists(), { filters }] as const,
  details: () => [...dishesKeys.all, 'detail'] as const,
  detail: (id: string) => [...dishesKeys.details(), id] as const,
} as const;

// Fetch functions separated from hooks for reusability
export const fetchDishes = async (filters?: {
  category?: string;
  search?: string;
}): Promise<GetDishResponseDTO[]> => {
  const queryParams = new URLSearchParams();

  if (filters?.category) {
    queryParams.append('category', filters.category);
  }

  if (filters?.search) {
    queryParams.append('search', filters.search);
  }

  const queryString = queryParams.toString();
  const url = `/dishes${queryString ? `?${queryString}` : ''}`;

  const response = await apiClient.get<GetDishResponseDTO[]>(url);

  if (!response.success) {
    throw new Error(response.error.message || 'Failed to fetch dishes');
  }

  return response.data;
};

// Hook for fetching dish list with proper transformation to domain entities
export const useDishesQuery = (filters?: { category?: string; search?: string }) => {
  return useQuery({
    queryKey: dishesKeys.list(filters),
    queryFn: () => fetchDishes(filters),
    select: (data: GetDishResponseDTO[]): Dish[] => {
      return Dish.fromResponseDTOList(data);
    },
  });
};
