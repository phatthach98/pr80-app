import { useOrdersQuery } from '@/hooks/query';
import { useParams } from '@tanstack/react-router';
import { TableDetail } from '../components';
import { EmptyState } from '@/components';
import { startOfToday } from 'date-fns';

export function TablesDetailPage() {
  const { id } = useParams({ from: '/_auth/tables/$id' });
  const { data: apiOrders = [] } = useOrdersQuery({
    createdAt: startOfToday(),
  });

  // Find order by ID
  const existingOrder = apiOrders.find((o) => o.id === id);
  if (!existingOrder) {
    return <EmptyState title="Không tìm thấy đơn hàng" />;
  }

  return <TableDetail order={existingOrder} />;
}
