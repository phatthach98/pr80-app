import { AuthLayout } from '@/features/auth/components';
import { authLocalStorageUtil } from '@/utils/auth-local-storage.util';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
  beforeLoad: async () => {
    const isExistedToken = authLocalStorageUtil.getToken();
    if (!isExistedToken) {
      throw redirect({
        to: '/login',
      });
    }
  },
});
