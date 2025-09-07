import { Button } from '@/components/ui';
import { PlusIcon } from 'lucide-react';

export const MakeOrderForm = () => {
  return (
    <Button variant="default" size="sm">
      <PlusIcon className="size-4" />
      Tạo đơn
    </Button>
  );
};
