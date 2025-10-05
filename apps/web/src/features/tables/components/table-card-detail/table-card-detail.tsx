import { Order } from '@/domain/entity/order';
import { cn } from '@/tailwind/utils';
import { Link } from '@tanstack/react-router';
import { useSettingOptionsQuery } from '@/hooks/query';
import { OrderStatusFromOrder } from '@/features/orders/components/order-status';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface TableCardDetailProps {
  order: Order;
  className?: string;
}

export function TableCardDetail({ order }: TableCardDetailProps) {
  const { data: tableOptions } = useSettingOptionsQuery();
  const currentTable = tableOptions?.tables?.find((table) => table.value === order.table) ?? {
    label: order.table,
    value: order.table,
  };

  return (
    <Link
      to="/tables/$id"
      params={{ id: order.id }}
      className="block w-full hover:no-underline md:w-[calc(50%-16px)] xl:w-[calc(33.33%-16px)]"
    >
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-bold">{currentTable.label}</div>
              <div className="text-sm font-light text-gray-700 italic">
                {order.getDisplayCustomerCount()}
              </div>
              <div className="mt-1 text-sm font-light text-gray-700 italic">
                {new Date(order.createdAt || '').toLocaleString('vi-VN')}
              </div>
              <div className="mt-1 text-sm font-light text-gray-700 italic">
                Nhân viên: <span className="font-bold">{order.createdByUser?.name}</span>
              </div>
            </div>
            <OrderStatusFromOrder order={order} variant="dot" size="sm" useTableStatus={true} />
          </div>
        </CardHeader>

        <CardContent>
          <div
            className={cn('text-md rounded-md bg-gray-100 p-4 font-light italic', {
              'text-destructive': order.note,
            })}
          >
            Ghi chú bàn: <div className="pl-2 font-bold">{order.note || 'Không có ghi chú'}</div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-end">
          <div className="py-2">
            <div className="text-md text-right text-gray-500">Tổng tiền</div>
            <div className="text-xl font-bold">{order.getFormattedTotalAmount()}</div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
