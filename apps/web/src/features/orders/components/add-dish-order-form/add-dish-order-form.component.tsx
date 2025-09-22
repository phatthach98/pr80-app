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
import { OrderDish } from '@/domain/entity/order-dish';
import { OrderDishOption } from '@/domain/entity/order-dish-option';
import { DishListForm } from './dish-list-form/dish-list-form.component';
import { DishOptionsForm } from './dish-options-form/dish-options-form.component';
import { ordersStore, setCurrentDraftOrder } from '@/features/orders/store';
import { toast } from 'sonner';
import { useStore } from '@tanstack/react-store';

interface AddDishOrderFormProps {
  orderDish?: OrderDish;
  onClose: () => void;
}

export function AddDishOrderForm({ orderDish, onClose }: AddDishOrderFormProps) {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { currentDraftOrder } = useStore(ordersStore);
  const handleSelectDish = (dish: Dish) => {
    setSelectedDish(dish);
  };

  const handleBack = () => {
    setSelectedDish(null);
  };

  useEffect(() => {
    // When orderDish changes and it's not null, open the dialog and set editing mode
    if (orderDish) {
      setIsDialogOpen(true);
      setIsEditing(true);

      // We need to fetch the dish from the API to get the full dish details
      // This will be handled in the DishOptionsForm component
      // For now, we just need the ID to trigger the dish lookup
      const dish = Dish.fromResponseDTO({
        id: orderDish.dishId,
        name: orderDish.name,
        basePrice: orderDish.basePrice,
        description: '',
        options: [],
      });
      setSelectedDish(dish);
    }
  }, [JSON.stringify(orderDish)]);

  const handleAddAndUpdateDishToOrder = (
    dish: Dish,
    selectedOptions: OrderDishOption[],
    quantity: number,
    takeAway: boolean,
  ) => {
    if (!currentDraftOrder ) {
      toast('Không tìm thấy đơn hàng');
      return;
    }
    let updatedOrder;

    if (currentDraftOrder && isEditing && orderDish) {
      // If editing, first remove the old dish and then add the updated one
      updatedOrder = currentDraftOrder
        .removeDish(orderDish.id || orderDish.dishId)
        .addDish(dish, selectedOptions, quantity, takeAway);
      setIsEditing(false);
    } else {
      // If adding new, just add the dish
      updatedOrder = currentDraftOrder.addDish(dish, selectedOptions, quantity, takeAway);
    }
    setCurrentDraftOrder(updatedOrder);
    handleClose();
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedDish(null);
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
      {!orderDish && (
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            <PlusIcon className="size-4" />
            Thêm món
          </Button>
        </DialogTrigger>
      )}
      <DialogContent
        className="sm:max-w-[425px]"
        onCloseAutoFocus={() => {
          handleClose();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {selectedDish ? (isEditing ? 'Sửa món' : 'Tuỳ chọn món') : 'Chọn món'}
          </DialogTitle>
          <DialogDescription>
            {selectedDish
              ? isEditing
                ? 'Cập nhật tuỳ chọn cho món này'
                : 'Chọn các tuỳ chọn cho món này'
              : 'Chọn món để thêm vào đơn hàng'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {selectedDish ? (
            <DishOptionsForm
              dish={selectedDish}
              onBack={handleBack}
              handleAddAndUpdateDishToOrder={handleAddAndUpdateDishToOrder}
              editingOrderDish={isEditing ? orderDish : undefined}
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
