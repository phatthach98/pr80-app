import { Order } from '@/domain/entity/order';
import { cn } from '@/tailwind/utils';
import { Link } from '@tanstack/react-router';
import { useSettingOptionsQuery } from '@/hooks/query';
import { Badge } from '@/components/ui/badge';
import { EOrderStatus } from '@pr80-app/shared-contracts';

interface TableCardDetailProps {
  order: Order;
  className?: string;
}
// Helper function to get simplified status
const getSimplifiedStatus = (status: EOrderStatus): { text: string; isPaid: boolean } => {
  if (status === EOrderStatus.PAID) {
    return { text: 'Đã thanh toán', isPaid: true };
  }
  return { text: 'Đang xử lý', isPaid: false };
};

export function TableCardDetail({ order }: TableCardDetailProps) {
  const { data: tableOptions } = useSettingOptionsQuery();
  const currentTable = tableOptions?.tables.find((table) => table.value === order.table) || {
    label: order.table,
    value: order.table,
  };
  
  const orderStatus = getSimplifiedStatus(order.status);
  return (
    <Link
      to="/tables/$id"
      params={{ id: order.id }}
      className="block w-full hover:no-underline md:max-w-md"
    >
      <div
        className="rounded-lg border-2 border-dashed border-gray-300 p-6"
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
          <Badge 
            variant={orderStatus.isPaid ? "outline" : "secondary"} 
            className={cn({
              "bg-blue-100 text-[#2196F3] hover:bg-blue-100": orderStatus.isPaid,
              "bg-orange-100 text-orange-800 hover:bg-orange-100": !orderStatus.isPaid
            })}
          >
            {orderStatus.text}
          </Badge>
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
