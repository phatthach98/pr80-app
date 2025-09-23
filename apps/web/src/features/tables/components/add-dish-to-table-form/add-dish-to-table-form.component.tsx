import { useEffect, useState } from 'react';
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
import { DishListForm } from './dish-list-form/dish-list-form.component';
import { DishOptionsForm } from './dish-options-form/dish-options-form.component';
import { OrderDish } from '@/domain/entity/order-dish';

interface AddDishToTableFormProps {
  orderDish: OrderDish | null;
  onOrderDishUpdate: (orderDish: OrderDish) => void;
  onClose: () => void;
}

export function AddDishToTableForm({
  orderDish,
  onOrderDishUpdate,
  onClose,
}: AddDishToTableFormProps) {
  const [selectedOrderDish, setSelectedOrderDish] = useState<OrderDish | null>(orderDish);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const handleSelectDish = (dish: Dish) => {
    setSelectedOrderDish(OrderDish.fromDishAndOrderDishOption(dish, [], 0, false));
  };

  const handleBack = () => {
    setSelectedOrderDish(null);
  };

  useEffect(() => {
    if (orderDish) {
      setSelectedOrderDish(orderDish);
      setIsEditing(true);
      setIsDialogOpen(true);
    }
  }, [JSON.stringify(orderDish || {})]);

  const handleAddAndUpdateDishToOrder = (updatedOrderDish: OrderDish) => {
    onOrderDishUpdate(updatedOrderDish);
    handleClose();
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedOrderDish(null);
    setIsEditing(false);
    onClose();
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          <PlusIcon className="size-4" />
          Thêm món
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onCloseAutoFocus={() => {
          handleClose();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {selectedOrderDish ? (isEditing ? 'Sửa món' : 'Tuỳ chọn món') : 'Chọn món'}
          </DialogTitle>
          <DialogDescription>
            {selectedOrderDish
              ? isEditing
                ? 'Cập nhật tuỳ chọn cho món này'
                : 'Chọn các tuỳ chọn cho món này'
              : 'Chọn món để thêm vào đơn hàng'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {selectedOrderDish ? (
            <DishOptionsForm
              onBack={handleBack}
              handleAddAndUpdateDishToOrder={handleAddAndUpdateDishToOrder}
              orderDish={selectedOrderDish}
              isEditing={isEditing}
            />
          ) : (
            <DishListForm onSelectDish={handleSelectDish} />
          )}
        </div>

        {!selectedOrderDish && (
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
