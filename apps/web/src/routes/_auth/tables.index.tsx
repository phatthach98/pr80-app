import { TablesPage } from '@/features/orders/pages';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/tables/')({
  component: TablesPage,
});
