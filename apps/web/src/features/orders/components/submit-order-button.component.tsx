import { Button } from '@/components/ui';
import { SendIcon } from 'lucide-react';
import { useTables } from '../hooks';
import { useCreateOrderMutation } from '@/hooks/mutation';
import { toast } from 'sonner';

export const SubmitOrderButton = () => {
  const { selectedOrder } = useTables();
  const { mutateAsync } = useCreateOrderMutation();

  const handleSubmitOrder = async () => {
    if (!selectedOrder) {
      return;
    }

    try {
      await mutateAsync(selectedOrder.toCreateOrderDTO());
      toast.success('Đơn hàng đã được gửi thành công');
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
