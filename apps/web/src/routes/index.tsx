import { authLocalStorageUtil } from '@/utils/auth-local-storage.util';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
  beforeLoad: () => {
    if (authLocalStorageUtil.getToken()) {
      throw redirect({
        to: '/tables',
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
