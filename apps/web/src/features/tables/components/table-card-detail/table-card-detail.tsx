import { Order } from '@/domain/entity/order';
import { Badge } from '@/components/ui/badge';
import { EOrderStatus } from '@pr80-app/shared-contracts';
import { cn } from '@/tailwind/utils';
import { Link } from '@tanstack/react-router';
import { useSettingOptionsQuery } from '@/hooks/query';

interface TableCardDetailProps {
  order: Order;
  className?: string;
}

const getStatusColor = (status: EOrderStatus) => {
  switch (status) {
    case EOrderStatus.COOKING:
      return '#E59400';
    case EOrderStatus.READY:
      return '#53A654';
    case EOrderStatus.SERVING:
      return '#53A654';
    case EOrderStatus.CANCELLED:
      return '#F84545';
    case EOrderStatus.PAID:
      return '#2196F3';
    case EOrderStatus.DRAFT:
      return '#9E9E9E';
  }
};
export function TableCardDetail({ order }: TableCardDetailProps) {
  const { data: tableOptions } = useSettingOptionsQuery();
  const currentTable = tableOptions?.tables.find((table) => table.value === order.table) || {
    label: order.table,
    value: order.table,
  };
  return (
    <Link
      to="/tables/$id"
      params={{ id: order.id }}
      className="block w-full hover:no-underline md:max-w-md"
    >
      <div
        className={cn('rounded-lg border-2 border-dashed p-6', {
          [`border-[${getStatusColor(order.status)}]`]: true,
        })}
      >
        <div className="mb-2 text-sm font-light text-gray-700 italic">
          {new Date(order.createdAt || '').toLocaleString('vi-VN')}
        </div>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-bold">{currentTable.label}</div>
            <div className="text-sm font-light text-gray-700 italic">
              {order.getDisplayCustomerCount()}
            </div>
          </div>
          <div
            className={cn('text-md', {
              [`text-[${getStatusColor(order.status)}]`]: true,
            })}
          >
            ● {order.getDisplayStatus()}
          </div>
        </div>

        <div
          className={cn('text-md mt-4 font-light italic', {
            'text-destructive': order.note,
          })}
        >
          Ghi chú: <span className="font-bold">{order.note || 'Không có ghi chú'}</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-md text-gray-500">Tổng tiền</div>
            <div className="text-xl font-bold">{order.getFormattedTotalAmount()}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
