import { AppSidebar, SiteHeader } from '@/components';
import { SidebarInset, SidebarProvider, Skeleton } from '@/components/ui';
import { authStore, useAuth } from '@/features/auth/hooks';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { useEffect } from 'react';
import { authLocalStorageUtil } from '@/utils/auth-local-storage.util';

export function AuthLayout() {
  const { getMe, getRefreshToken, logout } = useAuth();
  const { isAuthenticated } = useStore(authStore);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const userDetail = await getMe();
      console.log('userDetail', userDetail);
      if (!userDetail) {
        navigate({
          to: '/login',
          replace: true,
        });
      }
    };

    if (!isAuthenticated) {
      initAuth();
    }

    // Handle unauthorized requests (token refresh)
    const handleUnauthorized = async (
      event: CustomEvent<{ onRefreshComplete: (newToken: string | null) => void }>,
    ) => {
      const { onRefreshComplete } = event.detail;

      // Try to refresh the token
      const refreshToken = authLocalStorageUtil.getRefreshToken();
      if (!refreshToken) {
        // If no refresh token, signal failure
        onRefreshComplete(null);
        logout();
        navigate({
          to: '/login',
          replace: true,
        });
        return;
      }

      const isSuccess = await getRefreshToken();
      if (isSuccess) {
        onRefreshComplete(authLocalStorageUtil.getToken());
        // const userDetail = await getMe();
        // console.log('userDetail', userDetail);
        // if (!userDetail) {
        //   navigate({
        //     to: '/login',
        //     replace: true,
        //   });
        // }
      } else {
        onRefreshComplete(null);
        logout();
        navigate({
          to: '/login',
          replace: true,
        });
      }
    };

    // Add event listener for unauthorized requests
    window.addEventListener('auth:unauthorized', handleUnauthorized as unknown as EventListener);

    return () => {
      window.removeEventListener(
        'auth:unauthorized',
        handleUnauthorized as unknown as EventListener,
      );
    };
  }, []);

  if (!isAuthenticated) {
    return (
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
    );
  }

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
