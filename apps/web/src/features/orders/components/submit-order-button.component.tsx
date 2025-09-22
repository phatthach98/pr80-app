import { Button } from '@/components/ui';
import { SendIcon } from 'lucide-react';
import { useCreateOrderMutation, useUpdateOrderMutation } from '@/hooks/mutation';
import { toast } from 'sonner';
import { ordersKeys } from '@/hooks/query';
import { useQueryClient } from '@tanstack/react-query';
import { ordersStore, setCurrentDraftOrder } from '../store';
import { useStore } from '@tanstack/react-store';
import { useNavigate } from '@tanstack/react-router';
import { Order } from '@/domain/entity';

export interface SubmitOrderButtonProps {
  /**
   * Optional order to submit/update. If not provided, will use currentDraftOrder from store
   */
  order?: Order;

  /**
   * Optional callback after successful submission
   */
  onSuccess?: () => void;

  /**
   * Optional callback after failed submission
   */
  onError?: (error: unknown) => void;

  /**
   * Optional button label
   * @default "Gửi"
   */
  label?: string;

  /**
   * Optional button variant
   * @default "default"
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

  /**
   * Optional button size
   * @default "lg"
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';

  /**
   * Optional button className
   */
  className?: string;
}

export const SubmitOrderButton = ({
  order,
  onSuccess,
  onError,
  label = 'Gửi',
  variant = 'default',
  size = 'lg',
  className = 'w-full',
}: SubmitOrderButtonProps) => {
  const { currentDraftOrder } = useStore(ordersStore);
  const { mutateAsync: createOrder } = useCreateOrderMutation();
  const { mutateAsync: updateOrder } = useUpdateOrderMutation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Use provided order or fall back to currentDraftOrder
  const activeOrder = order || currentDraftOrder;

  const handleSubmitOrder = async () => {
    if (!activeOrder) {
      toast.error('Không có đơn hàng để gửi');
      return;
    }

    try {
      if (activeOrder.canEdit() && !activeOrder.isDraft() && activeOrder.id) {
        // Existing order - update
        await updateOrder(activeOrder.toUpdateOrderDTO());
        toast.success('Đơn hàng đã được cập nhật thành công');
      }
      if (activeOrder.isDraft()) {
        // New order - create
        await createOrder(activeOrder.toCreateOrderDTO());
        // Only clear draft order if we're submitting from the store
        if (!order && currentDraftOrder) {
          setCurrentDraftOrder(null);
        }
        toast.success('Đơn hàng đã được gửi thành công');
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ordersKeys.all });

      // Call success callback or navigate
      if (onSuccess) {
        onSuccess();
      } else {
        navigate({ to: '/tables' });
      }
    } catch (error) {
      toast.error(activeOrder.id ? 'Cập nhật đơn hàng thất bại' : 'Đơn hàng đã gửi thất bại');
      console.error('Failed to submit order:', error);

      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <Button
      className={className}
      variant={variant}
      size={size}
      onClick={handleSubmitOrder}
      disabled={!activeOrder}
    >
      <SendIcon className="mr-2 size-4" />
      {label}
    </Button>
  );
};
