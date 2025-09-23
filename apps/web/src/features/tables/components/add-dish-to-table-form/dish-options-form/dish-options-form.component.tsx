import { useState } from 'react';
import { Button, Checkbox, QuantityInput, Textarea } from '@/components/ui';
import { OrderDishOption } from '@/domain/entity/order-dish-option';
import { ArrowLeftIcon, ShoppingBagIcon } from 'lucide-react';
import defaultDishImage from '@/assets/default-dish.png';
import { DishOptionsSelectField } from './dish-options-select-field';
import { OrderDish } from '@/domain/entity/order-dish';
import { useInitDishOptionsForm } from '@/features/tables/hooks';

interface DishOptionsProps {
  orderDish: OrderDish;
  isEditing: boolean;
  onBack: () => void;
  handleAddAndUpdateDishToOrder: (selectedOrderDish: OrderDish) => void;
}

export function DishOptionsForm({
  orderDish,
  isEditing,
  onBack,
  handleAddAndUpdateDishToOrder,
}: DishOptionsProps) {
  const { isPending, isError, dishDetail, selectedOptions, setSelectedOptions } =
    useInitDishOptionsForm(orderDish);
  const [quantity, setQuantity] = useState(orderDish.quantity || 1);
  const [takeAway, setTakeAway] = useState(orderDish.takeAway || false);
  const [note, setNote] = useState(orderDish.note || '');

  if (isPending) return <div className="py-8 text-center">Đang tải tùy chọn...</div>;
  if (isError) return <div className="py-8 text-center text-red-500">Không tải được tùy chọn</div>;

  if (!dishDetail) return <div className="py-8 text-center">Không tìm thấy món ăn</div>;

  const handleAddToOrder = () => {
    // Allow submission if we have options or if we're editing with pre-populated options
    if (selectedOptions && Object.keys(selectedOptions).length > 0) {
      // Get all option keys, ensuring we have at least the ones from the original dish if editing
      const optionKeys = Object.keys(selectedOptions);

      const orderDishOptions = optionKeys
        .map((selectedOptionItemName) => {
          const dishOption = dishDetail.options.find(
            (dishOption) => dishOption.name === selectedOptionItemName,
          );
          if (!dishOption) return [];
          const currentSelectedOptions = selectedOptions[selectedOptionItemName];
          return currentSelectedOptions
            .filter((option) => option.label !== '')
            .map((option) =>
              OrderDishOption.fromDishOptionItem(dishOption.id, dishOption.name, option),
            );
        })
        .flat();

      const updatedOrderDish = orderDish
        .withSelectedOptions(orderDishOptions)
        .withQuantity(quantity)
        .withTakeAway(takeAway)
        .withNote(note);
      handleAddAndUpdateDishToOrder(updatedOrderDish);
    }
  };

  return (
    <div className="max-h-[480px] mb-20 flex flex-col justify-between gap-6 overflow-scroll">
      {/* Header with back button and price */}
      <div className="flex items-center justify-between">
        {!isEditing && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 p-0"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        )}

        <h1 className="text-xl font-bold">{dishDetail.name}</h1>

        <div className="text-primary text-xl font-bold">{dishDetail.getFormattedBasePrice()}</div>
      </div>

      {/* Dish image */}
      <div className="flex justify-center">
        <div className="relative h-24 w-24 overflow-hidden rounded-full">
          <img
            src={defaultDishImage}
            alt={dishDetail.name}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Description */}
      <div className="text-muted-foreground text-center">{dishDetail.description}</div>

      <Textarea
        id="note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Ghi chú"
      />

      {/* Options selection */}
      <DishOptionsSelectField
        dish={dishDetail}
        selectedOptions={selectedOptions}
        onSelect={setSelectedOptions}
      />

      {/* Take away option */}
      <div className="flex items-center gap-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="takeAway"
            checked={takeAway}
            onCheckedChange={(checked) => setTakeAway(checked === true)}
          />
          <label htmlFor="takeAway" className="cursor-pointer text-sm font-medium text-gray-700">
            Mang về
          </label>
        </div>
      </div>

      {/* Add to bag button */}
      <div className="fixed right-0 bottom-0 left-0 flex items-center justify-between border-t bg-white p-4">
        <QuantityInput
          value={quantity}
          onChange={setQuantity}
          min={1}
          size="md"
          buttonClassName="border border-gray-300"
          valueClassName="text-lg font-medium"
        />
        <Button
          onClick={handleAddToOrder}
          disabled={Object.keys(selectedOptions).length === 0}
          className="text-md rounded-full py-6"
        >
          <ShoppingBagIcon className="h-5 w-5" />
          {isEditing ? 'Cập nhật món' : 'Thêm món'}
        </Button>
      </div>
    </div>
  );
}
