import { AppSidebar, SiteHeader } from '@/components';
import { SidebarInset, SidebarProvider, Skeleton } from '@/components/ui';
import { authStore, useAuth } from '@/features/auth/hooks';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { useEffect, useState } from 'react';
import { authLocalStorageUtil } from '@/utils/auth-local-storage.util';
import { useSocketConnection } from '@/hooks/socket';

export function AuthLayout() {
  const { getMe, getRefreshToken, logout: authLogout } = useAuth();

  // Wrap the logout function to also clear the token state
  const logout = async () => {
    setAuthToken('');
    await authLogout();
  };
  const { isAuthenticated } = useStore(authStore);
  const navigate = useNavigate();

  // Track the auth token as state to ensure socket reconnects when token changes
  const [authToken, setAuthToken] = useState(authLocalStorageUtil.getToken() || '');
  useSocketConnection(authToken);

  useEffect(() => {
    const initAuth = async () => {
      const userDetail = await getMe();
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
        const newToken = authLocalStorageUtil.getToken();
        setAuthToken(newToken || ''); // Update the token state to trigger socket reconnection
        onRefreshComplete(newToken);
      } else {
        onRefreshComplete(null);
        setAuthToken(''); // Clear token state
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
