import { OrdersPage } from '@/pages/orders';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/orders')({
  component: OrdersPage,
});
