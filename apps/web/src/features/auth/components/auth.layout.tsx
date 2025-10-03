import { AppSidebar, SiteHeader } from '@/components';
import { SidebarInset, SidebarProvider } from '@/components/ui';
import { authStore, useAuth } from '@/features/auth/hooks';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import { Suspense, useEffect } from 'react';
import { authLocalStorageUtil } from '@/utils/auth-local-storage.util';
import { FullPageLoader } from '@/components/ui/loading-spinner';

export function AuthLayout() {
  const { getMe, getRefreshToken, logout: authLogout } = useAuth();

  // Wrap the logout function to also clear the token state
  const logout = async () => {
    await authLogout();
  };
  const { isAuthenticated } = useStore(authStore);
  const navigate = useNavigate();

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
        onRefreshComplete(newToken);
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
    return <FullPageLoader />;
  }

  return (
    <Suspense fallback={<FullPageLoader />}>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col" defaultOpen={false}>
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
    </Suspense>
  );
}
