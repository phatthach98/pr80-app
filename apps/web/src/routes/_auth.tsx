import { AuthLayout } from '@/components/layouts';
import { Skeleton } from '@/components/ui';
import { authStore, useAuth } from '@/hooks/use-auth';
import { authLocalStorageUtil } from '@/utils/auth-local-storage.util';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
  beforeLoad: async () => {
    if (!authLocalStorageUtil.getToken()) {
      throw redirect({
        to: '/login',
        replace: true,
      });
    }
    if (!authStore.state.isAuthenticated) {
      const { getMe } = useAuth();
      const userDetail = await getMe();

      if (!userDetail) {
        throw redirect({
          to: '/login',
          replace: true,
        });
      }
    }
  },
  pendingComponent: () => (
    <>
      <div className="space-y-2 pb-6">
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="flex flex-row flex-wrap items-center justify-around gap-4 p-4">
        <Skeleton className="mb-4 h-[184px] w-[48%] rounded-xl" />
        <Skeleton className="mb-4 h-[184px] w-[48%] rounded-xl" />
        <Skeleton className="mb-4 h-[184px] w-[48%] rounded-xl" />
        <Skeleton className="mb-4 h-[184px] w-[48%] rounded-xl" />
        <Skeleton className="mb-4 h-[184px] w-[48%] rounded-xl" />
        <Skeleton className="mb-4 h-[184px] w-[48%] rounded-xl" />
      </div>
    </>
  ),
});
