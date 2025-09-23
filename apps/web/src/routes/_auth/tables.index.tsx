import { TablesPage } from '@/features/tables/pages';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/tables/')({
  component: TablesPage,
});
