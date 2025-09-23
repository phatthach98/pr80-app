import { createFileRoute } from '@tanstack/react-router';
import { TablesDetailPage } from '@/features/tables';

export const Route = createFileRoute('/_auth/tables/$id')({
  component: TablesDetailPage,
});
