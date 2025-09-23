import { Order } from '@/domain/entity';
import { formatCurrency } from '@/utils';

export const TableDetailSummaryPrice = ({
  activeOrder,
  additionalOrder,
}: {
  activeOrder: Order;
  additionalOrder: Order | null;
}) => {
  return (
    <div className="mt-8 space-y-3 border-t border-dashed pt-6 text-lg md:mx-auto md:mt-12 md:pt-6">
      <div className="text-md flex justify-between font-light text-gray-600">
        <div>Tạm tính</div>
        <div className="flex flex-col items-center gap-2">
          <span>{activeOrder.getFormattedTotalAmount()}</span>
          {additionalOrder && <span>+ {additionalOrder.getFormattedTotalAmount()}</span>}
        </div>
      </div>
      <div className="flex justify-between md:text-xl">
        <span className="font-medium">Tổng tiền</span>
        <div className="flex flex-col items-center gap-2">
          {formatCurrency(
            activeOrder.getParsedTotalAmount() + (additionalOrder?.getParsedTotalAmount() || 0),
          )}
        </div>
      </div>
    </div>
  );
};
