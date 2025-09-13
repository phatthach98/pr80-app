import { createFileRoute } from '@tanstack/react-router';
import { TableCreatePage } from '@/features/orders';

export const Route = createFileRoute('/_auth/tables/create')({
  component: TableCreatePage,
});
