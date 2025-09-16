import { Order } from '@/domain/entity';
import { ordersStore } from '../store';
import { EOrderStatus, EOrderType } from '@pr80-app/shared-contracts';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useStore } from '@tanstack/react-store';

export const TableCreatePage = () => {
  const { currentDraftOrder } = useStore(ordersStore);

  if (!currentDraftOrder) {
    return <div>Không tìm thấy đơn hàng</div>;
  }
  // Helper function to determine if a dish is newly added (no ID means it's not saved to DB yet)
  const isNewDish = (dish: Order['dishes'][number]) => !dish.id;

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
            <CardTitle className="text-2xl">Bàn {currentDraftOrder.table}</CardTitle>
            <div className="mt-2 flex space-x-2">
              {getStatusBadge(currentDraftOrder.status)}
              {getOrderTypeBadge(currentDraftOrder.type)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-muted-foreground text-sm">
              {currentDraftOrder.customerCount > 0 && `${currentDraftOrder.customerCount} khách`}
            </div>
            {currentDraftOrder.createdAt && (
              <div className="text-muted-foreground text-sm">
                {new Date(currentDraftOrder.createdAt).toLocaleString('vi-VN')}
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
                <p className="text-lg font-bold">{currentDraftOrder.getFormattedTotalAmount()}</p>
              </div>
              {currentDraftOrder.note && (
                <div>
                  <h3 className="font-medium">Ghi chú:</h3>
                  <p>{currentDraftOrder.note}</p>
                </div>
              )}
            </div>

            {/* Dish list */}
            <div className="mt-6">
              <h3 className="mb-4 text-lg font-medium">Danh sách món</h3>
              <div className="space-y-4">
                {currentDraftOrder.dishes.length === 0 ? (
                  <p className="text-muted-foreground">Chưa có món nào</p>
                ) : (
                  currentDraftOrder.dishes.map((dish) => (
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
                              {dish.getFormattedPriceWithSelectedOption()} x {dish.quantity}
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
                                      <span>{option.dishOptionName}: </span>
                                      <span className="ml-1">{option.itemLabel}</span>
                                      {option.extraPrice && option.getParsedExtraPrice() > 0 && (
                                        <span className="ml-1">
                                          {option.getFormattedExtraPrice()}
                                        </span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{dish.getFormattedTotalPrice()}</p>
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
};
