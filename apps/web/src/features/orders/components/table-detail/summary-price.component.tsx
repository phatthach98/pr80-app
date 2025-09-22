import { Order } from '@/domain/entity';

export const TableDetailSummaryPrice = ({
  activeOrder,
  additionalOrder,
}: {
  activeOrder: Order;
  additionalOrder: Order | null;
}) => {
  return (
    <div className="mt-8 space-y-3 border-t border-dashed pt-6 text-lg md:mx-auto md:mt-12 md:pt-6">
      <div className="flex justify-between md:text-lg">
        <span className="text-gray-600">Tổng tiền</span>
        <div className="flex flex-col"></div>
        <span className="font-medium">{activeOrder.getFormattedTotalAmount()}</span>
      </div>
    </div>
  );
};
