import { Button } from '@/components/ui';
import { SendIcon } from 'lucide-react';
import { useCreateOrderMutation } from '@/hooks/mutation';
import { toast } from 'sonner';
import { ordersKeys } from '@/hooks/query';
import { useQueryClient } from '@tanstack/react-query';
import { ordersStore, setCurrentDraftOrder } from '../store';
import { useStore } from '@tanstack/react-store';
import { useNavigate } from '@tanstack/react-router';

export const SubmitOrderDraftButton = () => {
  const { currentDraftOrder } = useStore(ordersStore);
  const { mutateAsync } = useCreateOrderMutation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const handleSubmitOrder = async () => {
    if (!currentDraftOrder) {
      return;
    }

    try {
      await mutateAsync(currentDraftOrder.toCreateOrderDTO());
      setCurrentDraftOrder(null);
      queryClient.invalidateQueries({ queryKey: ordersKeys.all });
      toast.success('Đơn hàng đã được gửi thành công');
      navigate({
        to: '/tables',
      });
    } catch (error) {
      toast.error('Đơn hàng đã gửi thất bại');
      console.error('Failed to submit order:', error);
    }
  };

  return (
    <Button variant="default" size="sm" onClick={handleSubmitOrder}>
      <SendIcon className="size-4" />
      Gửi
    </Button>
  );
};
