// TanStack Query will be used directly in components
import { apiClient } from '@/api/api-client';
import {
  getSettingConfigResponseDTO,
  getSettingOptionsResponseDTO,
} from '@pr80-app/shared-contracts';
import { useQuery } from '@tanstack/react-query';

// Query option factories - use directly with useQuery
export const useSettingOptionsQuery = () => {
  return useQuery<getSettingOptionsResponseDTO, Error, getSettingOptionsResponseDTO>({
    queryKey: ['settings', 'options'] as const,
    queryFn: async () => {
      const response = await apiClient.get<getSettingOptionsResponseDTO>('/settings/option');
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
  });
};

export const useSettingConfigQuery = () => {
  return useQuery<getSettingConfigResponseDTO, Error, getSettingConfigResponseDTO>({
    queryKey: ['settings', 'config'] as const,
    queryFn: async () => {
      const response = await apiClient.get<getSettingConfigResponseDTO>('/settings/config');
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
  });
};

export const useSettingsQuery = () => {
  return useQuery<
    {
      options: getSettingOptionsResponseDTO;
      config: getSettingConfigResponseDTO;
    },
    Error,
    getSettingConfigResponseDTO
  >({
    queryKey: ['settings', 'combined'] as const,
    queryFn: async () => {
      const [options, config] = await Promise.all([
        apiClient.get<getSettingOptionsResponseDTO>('/settings/option'),
        apiClient.get<getSettingConfigResponseDTO>('/settings/config'),
      ]);
      if (options.success && config.success) {
        return { options: options.data, config: config.data };
      }

      throw new Error('Failed to fetch settings');
    },
  });
};
