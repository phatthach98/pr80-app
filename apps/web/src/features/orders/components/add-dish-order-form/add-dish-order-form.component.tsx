import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { Dish } from '@/domain/entity';
import { OrderDishOption } from '@/domain/entity/order-dish-option';
import { DishListForm } from './dish-list-form/dish-list-form.component';
import { DishOptionsForm } from './dish-options-form/dish-options-form.component';
import { ordersStore, setCurrentDraftOrder } from '@/features/orders/store';
import { toast } from 'sonner';
import { useStore } from '@tanstack/react-store';

export function AddDishOrderForm() {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { currentDraftOrder } = useStore(ordersStore);
  const handleSelectDish = (dish: Dish) => {
    setSelectedDish(dish);
  };

  const handleBack = () => {
    setSelectedDish(null);
  };

  const handleAddDishToOrder = (
    dish: Dish,
    selectedOptions: OrderDishOption[],
    quantity: number,
    takeAway: boolean,
  ) => {
    if (!currentDraftOrder) {
      toast('Không tìm thấy đơn hàng');
      return;
    }
    const updatedOrder = currentDraftOrder.addDish(dish, selectedOptions, quantity, takeAway);
    setCurrentDraftOrder(updatedOrder);
    setIsDialogOpen(false);
    setSelectedDish(null);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setSelectedDish(null);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          <PlusIcon className="mr-2 size-4" />
          Thêm món
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{selectedDish ? 'Tuỳ chọn món' : 'Chọn món'}</DialogTitle>
          <DialogDescription>
            {selectedDish ? 'Chọn các tuỳ chọn cho món này' : 'Chọn món để thêm vào đơn hàng'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {selectedDish ? (
            <DishOptionsForm
              dish={selectedDish}
              onBack={handleBack}
              handleAddDishToOrder={handleAddDishToOrder}
            />
          ) : (
            <DishListForm onSelectDish={handleSelectDish} />
          )}
        </div>

        {!selectedDish && (
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Huỷ</Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
