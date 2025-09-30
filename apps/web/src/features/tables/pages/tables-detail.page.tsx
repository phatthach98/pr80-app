import { useOrdersQuery } from '@/hooks/query';
import { useParams } from '@tanstack/react-router';
import { TableDetail } from '../components';

export function TablesDetailPage() {
  const { id } = useParams({ from: '/_auth/tables/$id' });
  const { data: apiOrders = [] } = useOrdersQuery();

  // Find order by ID
  const existingOrder = apiOrders.find((o) => o.id === id);

  if (!existingOrder) {
    return <div>Không tìm thấy đơn hàng</div>;
  }

  return <TableDetail order={existingOrder} />;
}
