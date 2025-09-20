import { createFileRoute, useParams } from '@tanstack/react-router';
import { TableDetail } from '@/features/orders/components/table-detail';
import { useOrdersQuery } from '@/hooks/query';

// Validation happens automatically by the router

// Component to be used in the route
const TableDetailView = () => {
  const { id } = useParams({ from: '/_auth/tables/$id' });
  const { data: apiOrders = [], isPending } = useOrdersQuery();

  // Find order by ID
  const existingOrder = apiOrders.find((o) => o.id === id);

  if (isPending) {
    return <div>Đang tải đơn hàng...</div>;
  }

  if (!existingOrder) {
    return <div>Không tìm thấy đơn hàng</div>;
  }

  return <TableDetail order={existingOrder} />;
};

export const Route = createFileRoute('/_auth/tables/$id')({
  component: TableDetailView,
});
