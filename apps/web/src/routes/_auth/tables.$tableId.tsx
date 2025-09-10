import { createFileRoute } from '@tanstack/react-router';
import { useTables } from '@/features/orders/hooks/use-tables';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { EOrderStatus, EOrderType } from '@pr80-app/shared-contracts';
import { Order } from '@/domain/entity';
import { useEffect } from 'react';

export const Route = createFileRoute('/_auth/tables/$tableId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { setSelectedOrderId, selectedOrder } = useTables();
  const { tableId } = Route.useParams();
  useEffect(() => {
    setSelectedOrderId(tableId);
  }, []);

  if (!selectedOrder) {
    return <div>Không tìm thấy đơn hàng</div>;
  }

  // Helper function to determine if a dish is newly added (no ID means it's not saved to DB yet)
  const isNewDish = (dish: Order['dishes'][number]) => !dish.id;

  // Helper function to format price
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  // Helper function to get status badge color
  const getStatusBadge = (status: EOrderStatus) => {
    switch (status) {
      case EOrderStatus.PENDING:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Chờ xử lý
          </Badge>
        );
      case EOrderStatus.WAITING:
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Đang chờ
          </Badge>
        );
      case EOrderStatus.COOKED:
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Đã nấu
          </Badge>
        );
      case EOrderStatus.SERVED:
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Đã phục vụ
          </Badge>
        );
      case EOrderStatus.PAID:
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Đã thanh toán
          </Badge>
        );
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  // Helper function to get order type badge
  const getOrderTypeBadge = (type: EOrderType) => {
    switch (type) {
      case EOrderType.MAIN:
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Chính
          </Badge>
        );
      case EOrderType.SUB:
        return (
          <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
            Phụ
          </Badge>
        );
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Bàn {selectedOrder.table}</CardTitle>
            <div className="mt-2 flex space-x-2">
              {getStatusBadge(selectedOrder.status)}
              {getOrderTypeBadge(selectedOrder.type)}
              {selectedOrder.source === 'local' && (
                <Badge variant="outline" className="bg-orange-100 text-orange-800">
                  Chưa lưu
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-muted-foreground text-sm">
              {selectedOrder.customerCount > 0 && `${selectedOrder.customerCount} khách`}
            </div>
            {selectedOrder.createdAt && (
              <div className="text-muted-foreground text-sm">
                {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Order details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Tổng tiền:</h3>
                <p className="text-lg font-bold">{formatPrice(selectedOrder.totalAmount)}</p>
              </div>
              {selectedOrder.note && (
                <div>
                  <h3 className="font-medium">Ghi chú:</h3>
                  <p>{selectedOrder.note}</p>
                </div>
              )}
            </div>

            {/* Dish list */}
            <div className="mt-6">
              <h3 className="mb-4 text-lg font-medium">Danh sách món</h3>
              <div className="space-y-4">
                {selectedOrder.dishes.length === 0 ? (
                  <p className="text-muted-foreground">Chưa có món nào</p>
                ) : (
                  selectedOrder.dishes.map((dish) => (
                    <Card
                      key={dish.id || dish.dishId}
                      className={`${isNewDish(dish) ? 'border-2 border-green-500' : ''}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h4 className="text-lg font-medium">{dish.name}</h4>
                              {isNewDish(dish) && (
                                <Badge className="ml-2 bg-green-100 text-green-800">Mới</Badge>
                              )}
                              {dish.takeAway && (
                                <Badge className="ml-2 bg-blue-100 text-blue-800">Mang về</Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {formatPrice(dish.getDisplayPrice())} x {dish.quantity}
                            </p>

                            {/* Display dish options */}
                            {dish.options.length > 0 && (
                              <div className="mt-2">
                                <h5 className="text-sm font-medium">Tùy chọn:</h5>
                                <ul className="text-sm">
                                  {dish.options.map((option, index) => (
                                    <li
                                      key={index}
                                      className="text-muted-foreground flex items-center"
                                    >
                                      <span>{option.name}: </span>
                                      <span className="ml-1">
                                        {option.options.map((opt) => opt.label).join(', ')}
                                      </span>
                                      {option.options[0]?.extraPrice &&
                                        Number(option.options[0].extraPrice) > 0 && (
                                          <span className="ml-1">
                                            (+{formatPrice(option.options[0].extraPrice)})
                                          </span>
                                        )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {formatPrice(String(Number(dish.getDisplayPrice()) * dish.quantity))}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
