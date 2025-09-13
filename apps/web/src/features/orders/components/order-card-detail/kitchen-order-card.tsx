import { Order } from '@/domain/entity/order';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EOrderStatus } from '@pr80-app/shared-contracts';
import { cn } from '@/tailwind/utils';

interface KitchenOrderCardProps {
  order: Order;
  className?: string;
}

export function KitchenOrderCard({ order, className }: KitchenOrderCardProps) {
  // Helper function to get status badge styling
  const getStatusBadgeVariant = (status: EOrderStatus) => {
    switch (status) {
      case EOrderStatus.WAITING:
        return 'default';
      case EOrderStatus.COOKED:
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className={cn('bg-card mx-auto w-full max-w-md', className)}>
      <CardHeader className="border-b pb-3">
        <div className="flex w-full items-center justify-between">
          <CardTitle className="text-xl font-bold">Table {order.table}</CardTitle>
          <Badge variant={getStatusBadgeVariant(order.status)} className="px-3 py-1 text-sm">
            {order.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-3 pb-0">
        <div className="space-y-4">
          {order.dishes.map((dish) => (
            <div key={dish.id} className="border-b pb-3 last:border-0">
              <div className="mb-1 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{dish.name}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="px-3 text-base">
                    ×{dish.quantity}
                  </Badge>
                  {dish.takeAway && (
                    <Badge variant="secondary" className="text-xs">
                      Take Away
                    </Badge>
                  )}
                </div>
              </div>

              {dish.options.length > 0 && (
                <div className="mt-2 space-y-1">
                  {dish.options.map((option) => (
                    <div key={option.dishOptionId} className="flex items-center gap-2">
                      <span className="font-medium">{option.dishOptionName}:</span>
                      <span>{option.itemLabel}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>

      {order.note && (
        <CardFooter className="border-t pt-3 pb-3">
          <div className="w-full">
            <h4 className="mb-1 font-bold">Special Instructions:</h4>
            <p className="text-sm">{order.note}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
