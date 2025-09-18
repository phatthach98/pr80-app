import { Order } from '@/domain/entity/order';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EOrderStatus, EOrderType } from '@pr80-app/shared-contracts';
import { cn } from '@/tailwind/utils';

interface OrderCardDetailProps {
  order: Order;
  className?: string;
}

export function OrderCardDetail({ order, className }: OrderCardDetailProps) {
  // Helper function to get status badge styling
  const getStatusBadgeVariant = (status: EOrderStatus) => {
    switch (status) {
      case EOrderStatus.PAID:
        return 'secondary';
      case EOrderStatus.WAITING:
      case EOrderStatus.COOKED:
      case EOrderStatus.SERVED:
        return 'default';
      case EOrderStatus.DRAFT:
      case EOrderStatus.PENDING:
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Card className={cn('w-full md:max-w-md', className)}>
      <CardHeader className="border-b">
        <div className="flex w-full items-center justify-between">
          <CardTitle className="text-lg sm:text-xl">Table {order.table}</CardTitle>
          <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
        </div>
        <div className="flex w-full items-center justify-between text-sm">
          <CardDescription>
            {order.type === EOrderType.MAIN ? 'Main Order' : 'Additional Order'}
          </CardDescription>
          <CardDescription>
            {order.customerCount > 0 &&
              `${order.customerCount} customer${order.customerCount > 1 ? 's' : ''}`}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="text-muted-foreground flex items-center justify-between border-b pb-2 text-sm font-medium">
            <span>Item</span>
            <div className="flex gap-4">
              <span className="w-10 text-center">Qty</span>
              <span className="w-20 text-right">Price</span>
            </div>
          </div>

          <div className="space-y-3">
            {order.dishes.map((dish) => (
              <div key={dish.id} className="space-y-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {dish.name} ({dish.getFormattedBasePrice()})
                    </h4>
                    {dish.takeAway && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        Take Away
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-10 text-center font-medium">{dish.quantity}</span>
                    <span className="w-20 text-right font-medium">
                      {dish.getFormattedPriceWithSelectedOption()}
                    </span>
                  </div>
                </div>

                {dish.selectedOptions.length > 0 && (
                  <div className="text-muted-foreground mt-1 space-y-1 pl-4 text-sm">
                    {dish.selectedOptions.map((option) => (
                      <div key={option.dishOptionId} className="flex items-center gap-2">
                        <span>{option.dishOptionName}:</span>
                        <div className="flex gap-2">
                          <span>{option.itemLabel}</span>
                          {option.extraPrice !== '0' && (
                            <span className="text-muted-foreground text-xs">
                              (+{option.getFormattedExtraPrice()})
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start border-t">
        <div className="flex w-full items-center justify-between py-2">
          <span className="font-medium">Total</span>
          <span className="text-lg font-bold">{order.getFormattedTotalAmount()}</span>
        </div>

        {order.note && (
          <div className="mt-2 w-full border-t pt-2">
            <h4 className="mb-1 text-sm font-medium">Note:</h4>
            <p className="text-muted-foreground text-sm">{order.note}</p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
