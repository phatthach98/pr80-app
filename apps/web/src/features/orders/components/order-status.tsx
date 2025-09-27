import { EOrderStatus } from '@pr80-app/shared-contracts';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/tailwind/utils';
import { Order } from '@/domain/entity';

export const getStatusColor = (status: EOrderStatus): string => {
  switch (status) {
    case EOrderStatus.COOKING:
      return '#E59400';
    case EOrderStatus.READY:
      return '#53A654';
    case EOrderStatus.CANCELLED:
      return '#F84545';
    case EOrderStatus.PAID:
      return '#2196F3';
    case EOrderStatus.DRAFT:
      return '#9E9E9E';
    default:
      return '#9E9E9E';
  }
};

export const getStatusText = (status: EOrderStatus): string => {
  switch (status) {
    case EOrderStatus.DRAFT:
      return 'Nháp';
    case EOrderStatus.COOKING:
      return 'Đang nấu';
    case EOrderStatus.READY:
      return 'Sẵn sàng';
    case EOrderStatus.PAID:
      return 'Đã thanh toán';
    case EOrderStatus.CANCELLED:
      return 'Đã hủy';
    default:
      return 'Không xác định';
  }
};

type OrderStatusSize = 'xs' | 'sm' | 'md' | 'lg';

type OrderStatusProps = {
  status: EOrderStatus;
  variant?: 'dot' | 'badge';
  className?: string;
  size?: OrderStatusSize;
};

export const OrderStatus = ({
  status,
  variant = 'dot',
  size = 'md',
  className,
}: OrderStatusProps) => {
  const statusColor = getStatusColor(status);
  const statusText = getStatusText(status);

  // Size-specific classes for text and spacing
  const getSizeClasses = (variant: 'dot' | 'badge'): string => {
    if (variant === 'dot') {
      switch (size) {
        case 'xs':
          return 'text-xs';
        case 'sm':
          return 'text-sm';
        case 'md':
          return 'text-base';
        case 'lg':
          return 'text-lg';
        default:
          return 'text-base';
      }
    } else {
      // badge variant
      switch (size) {
        case 'xs':
          return 'text-xs py-0 px-1.5 h-4';
        case 'sm':
          return 'text-xs py-0.5 px-2 h-5';
        case 'md':
          return 'text-sm py-0.5 px-2.5';
        case 'lg':
          return 'text-base py-1 px-3';
        default:
          return '';
      }
    }
  };

  if (variant === 'badge') {
    let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' = 'default';

    switch (status) {
      case EOrderStatus.COOKING:
        badgeVariant = 'secondary';
        break;
      case EOrderStatus.READY:
        badgeVariant = 'success';
        break;
      case EOrderStatus.PAID:
        badgeVariant = 'outline';
        break;
      case EOrderStatus.CANCELLED:
        badgeVariant = 'destructive';
        break;
      case EOrderStatus.DRAFT:
        badgeVariant = 'outline';
        break;
    }

    const sizeClasses = getSizeClasses('badge');

    return (
      <Badge variant={badgeVariant} className={cn(sizeClasses, className)}>
        {statusText}
      </Badge>
    );
  }

  // Default dot variant
  const sizeClasses = getSizeClasses('dot');
  const dotSize = size === 'xs' ? '•' : size === 'sm' ? '•' : '●';

  return (
    <div className={cn(sizeClasses, className)} style={{ color: statusColor }}>
      {dotSize} {statusText}
    </div>
  );
};

type OrderStatusFromOrderProps = {
  order: Order;
  variant?: 'dot' | 'badge';
  size?: OrderStatusSize;
  className?: string;
};

export const OrderStatusFromOrder = ({
  order,
  variant = 'dot',
  size = 'md',
  className,
}: OrderStatusFromOrderProps) => {
  return <OrderStatus status={order.status} variant={variant} size={size} className={className} />;
};
