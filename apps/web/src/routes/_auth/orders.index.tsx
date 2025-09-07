import { OrdersPage } from '@/features/orders/pages';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/orders/')({
  component: OrdersPage,
});
