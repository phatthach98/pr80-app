import { useOrdersQuery } from '@/hooks/query';
import { ETableStatus } from '@/domain/entity/order';
import { OrderStatusSelect, TableCardDetail } from '../components';
import { useState } from 'react';

export function TablesPage() {
  const { data: orders = [], isPending, isError } = useOrdersQuery();
  const [orderStatus, setOrderStatus] = useState<ETableStatus>(ETableStatus.ALL);
  const mainOrders = orders.filter((order) => order.isMainOrder());

  if (isPending) {
    return <div>Đang tải đơn hàng...</div>;
  }

  if (isError) {
    return <div>Lỗi tải đơn hàng</div>;
  }

  if (mainOrders.length === 0) {
    return <div>Không có đơn hàng</div>;
  }

  const handleOrderStatusChange = (value: ETableStatus) => {
    setOrderStatus(value);
  };

  const filteredOrders =
    orderStatus === ETableStatus.ALL
      ? mainOrders
      : mainOrders.filter((order) => order.tableStatus === orderStatus);

  return (
    <>
      <div>
        <OrderStatusSelect defaultStatus={ETableStatus.ALL} onChange={handleOrderStatusChange} />
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
        {filteredOrders.map((order, index) => {
          return <TableCardDetail key={index} order={order} />;
        })}
      </div>
    </>
  );
}
