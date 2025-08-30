import { authLocalStorageUtil } from '@/utils/auth-local-storage.util';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: () => {
    console.log('beforeLoad index route');
    if (authLocalStorageUtil.getToken()) {
      throw redirect({
        to: '/orders',
      });
    }

    throw redirect({
      to: '/login',
    });
  },
});

function RouteComponent() {
  return <div></div>;
}
