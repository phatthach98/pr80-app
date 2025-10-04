import { EOrderStatus } from '@pr80-app/shared-contracts';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/tailwind/utils';
import { Order, ETableStatus } from '@/domain/entity/order';

// Type that can be either order status or table status
export type OrderStatusType = EOrderStatus | ETableStatus;

// Get color for table status
export const getTableStatusColor = (status: ETableStatus): string => {
  switch (status) {
    case ETableStatus.IN_PROGRESS:
      return '#FF9800'; // Orange color for in progress
    case ETableStatus.PAID:
      return '#2196F3'; // Blue color for paid (same as order paid)
    default:
      return '#9E9E9E'; // Gray for unknown status
  }
};

// Get text for table status
export const getTableStatusText = (status: ETableStatus): string => {
  switch (status) {
    case ETableStatus.IN_PROGRESS:
      return 'Đang xử lý';
    case ETableStatus.PAID:
      return 'Đã thanh toán';
    default:
      return 'Không xác định';
  }
};

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
  status: OrderStatusType;
  variant?: 'dot' | 'badge';
  className?: string;
  size?: OrderStatusSize;
  statusType?: 'order' | 'table';
};

export const OrderStatus = ({
  status,
  variant = 'dot',
  size = 'md',
  className,
  statusType = 'order',
}: OrderStatusProps) => {
  // Use appropriate color and text based on status type
  let statusColor: string;
  let statusText: string;
  
  if (statusType === 'table' && Object.values(ETableStatus).includes(status as ETableStatus)) {
    statusColor = getTableStatusColor(status as ETableStatus);
    statusText = getTableStatusText(status as ETableStatus);
  } else {
    statusColor = getStatusColor(status as EOrderStatus);
    statusText = getStatusText(status as EOrderStatus);
  }

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

    if (statusType === 'table') {
      // Handle table status badge variants
      switch (status as ETableStatus) {
        case ETableStatus.IN_PROGRESS:
          badgeVariant = 'secondary';
          break;
        case ETableStatus.PAID:
          badgeVariant = 'outline';
          break;
        default:
          badgeVariant = 'default';
      }
    } else {
      // Handle order status badge variants
      switch (status as EOrderStatus) {
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
  const dotSize = size === 'xs' ? '•' : '●';

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
  useTableStatus?: boolean;
};

export const OrderStatusFromOrder = ({
  order,
  variant = 'dot',
  size = 'md',
  className,
  useTableStatus = false,
}: OrderStatusFromOrderProps) => {
  return (
    <OrderStatus 
      status={useTableStatus ? order.tableStatus : order.status}
      statusType={useTableStatus ? 'table' : 'order'}
      variant={variant} 
      size={size} 
      className={className} 
    />
  );
};
