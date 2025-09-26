import { createFileRoute } from '@tanstack/react-router';
import { OrdersPage } from '@/features/orders';

export const Route = createFileRoute('/_auth/orders')({
  component: OrdersPage,
});
