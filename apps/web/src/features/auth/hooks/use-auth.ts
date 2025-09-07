import { apiClient } from '@/api/api-client';
import { UserEntity } from '@/domain/entity';
import { authLocalStorageUtil } from '@/utils/auth-local-storage.util';
import { LoginResponseDTO, UserResponseDTO } from '@pr80-app/shared-contracts';
import { Store } from '@tanstack/react-store';

type UseAuthType = {
  login: (phoneNumber: string, passCode: string) => Promise<boolean>;
  getMe: () => Promise<UserEntity | null>;
  logout: () => Promise<void>;
  getRefreshToken: () => Promise<boolean>;
};

type AuthStoreType = {
  userDetail: UserEntity | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export const authStore = new Store<AuthStoreType>({
  userDetail: null,
  isLoading: false,
  isAuthenticated: false,
});

export const resetAuthStore = () => {
  authStore.setState({
    userDetail: null,
    isLoading: false,
    isAuthenticated: false,
  });
};

export const useAuth = (): UseAuthType => {
  const login = async (phoneNumber: string, passCode: string): Promise<boolean> => {
    const response = await apiClient.post<LoginResponseDTO>('/auth/login', {
      phoneNumber,
      passCode,
    });

    if (response.success) {
      authLocalStorageUtil.setTokens(response.data.token, response.data.refreshToken);
      return true;
    }

    authLocalStorageUtil.resetTokens();
    return false;
  };

  const getMe = async (): Promise<UserEntity | null> => {
    const response = await apiClient.get<UserResponseDTO>('/auth/me');
    authStore.setState((state) => ({
      ...state,
      isLoading: true,
    }));
    if (response.success) {
      const userDetail = UserEntity.fromResponseDTO(response.data);
      authStore.setState((state) => ({
        ...state,
        userDetail,
        isLoading: false,
        isAuthenticated: true,
      }));
      return userDetail;
    }
    return null;
  };

  const logout = async (): Promise<void> => {
    authLocalStorageUtil.resetTokens();
    resetAuthStore();
  };

  const refreshToken = async (): Promise<boolean> => {
    const response = await apiClient.post<LoginResponseDTO>('/auth/refresh-token', {
      refreshToken: authLocalStorageUtil.getRefreshToken(),
    });

    if (response.success) {
      authLocalStorageUtil.setTokens(response.data.token, response.data.refreshToken);
      return true;
    }
    authLocalStorageUtil.resetTokens();
    return false;
  };

  const refreshTokenClosure = (): (() => Promise<boolean>) => {
    let isPending = false;
    let refreshTokenPromise: Promise<boolean> | null = null;

    return async (): Promise<boolean> => {
      if (isPending && refreshTokenPromise) {
        return await refreshTokenPromise;
      }
      isPending = true;
      refreshTokenPromise = new Promise(async (resolve) => {
        const result = await refreshToken();
        isPending = false;
        refreshTokenPromise = null;
        resolve(result);
      });
      return await refreshTokenPromise;
    };
  };

  return { login, getMe, logout, getRefreshToken: refreshTokenClosure() };
};
