import { useOrdersQuery } from '@/hooks/query';
import { ETableStatus } from '@/domain/entity/order';
import { CreateDraftTableForm, OrderStatusSelect, TableCardDetail } from '../components';
import { useState } from 'react';
import { startOfToday } from 'date-fns';
import { EmptyState } from '@/components';

export function TablesPage() {
  const { data: orders = [], isError } = useOrdersQuery({
    createdAt: startOfToday(),
  });
  const [orderStatus, setOrderStatus] = useState<ETableStatus>(ETableStatus.ALL);
  const mainOrders = orders.filter((order) => order.isMainOrder());

  if (isError) {
    return <div>Lỗi tải đơn hàng</div>;
  }

  const handleOrderStatusChange = (value: ETableStatus) => {
    setOrderStatus(value);
  };

  const filteredOrders =
    orderStatus === ETableStatus.ALL
      ? mainOrders
      : mainOrders.filter((order) => order.tableStatus === orderStatus);

  return (
    <div className="mt-4 flex flex-1 flex-col gap-8">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-2xl font-bold">Danh Sách Bàn</h1>
        <OrderStatusSelect
          className="mb-4 min-h-[40px] min-w-[200px]"
          defaultStatus={ETableStatus.ALL}
          onChange={handleOrderStatusChange}
        />
      </div>

      {filteredOrders.length === 0 && (
        <EmptyState title="Không có đơn hàng">
          <CreateDraftTableForm size="lg" />
        </EmptyState>
      )}

      {filteredOrders.length > 0 && (
        <div className="flex flex-col items-center gap-4 md:flex-row md:flex-wrap">
          {filteredOrders.map((order, index) => {
            return <TableCardDetail key={index} order={order} />;
          })}
        </div>
      )}
    </div>
  );
}
