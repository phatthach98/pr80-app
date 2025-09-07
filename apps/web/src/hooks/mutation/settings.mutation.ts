import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/api-client';
import { 
  CreateSettingConfigRequestDTO,
  CreateTableOptionsRequestDTO,
  CreateOrderStatusOptionsRequestDTO,
  SettingConfigResponseDTO,
  SettingOptionsResponseDTO
} from '@pr80-app/shared-contracts';

// Mutation functions
const createSettingConfig = async (data: CreateSettingConfigRequestDTO): Promise<SettingConfigResponseDTO> => {
  const response = await apiClient.post<SettingConfigResponseDTO>('/settings/config', data);
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const createTableOptions = async (data: CreateTableOptionsRequestDTO): Promise<SettingOptionsResponseDTO> => {
  const response = await apiClient.post<SettingOptionsResponseDTO>('/settings/option/tables', data);
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const createOrderStatusOptions = async (data: CreateOrderStatusOptionsRequestDTO): Promise<SettingOptionsResponseDTO> => {
  const response = await apiClient.post<SettingOptionsResponseDTO>('/settings/option/order-statuses', data);
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

// Mutation hooks
export const useCreateSettingConfigMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSettingConfig,
    onSuccess: () => {
      // Invalidate and refetch settings queries
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (error) => {
      console.error('Failed to create setting config:', error);
    },
  });
};

export const useCreateTableOptionsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTableOptions,
    onSuccess: () => {
      // Invalidate and refetch settings queries
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (error) => {
      console.error('Failed to create table options:', error);
    },
  });
};

export const useCreateOrderStatusOptionsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrderStatusOptions,
    onSuccess: () => {
      // Invalidate and refetch settings queries
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (error) => {
      console.error('Failed to create order status options:', error);
    },
  });
};
