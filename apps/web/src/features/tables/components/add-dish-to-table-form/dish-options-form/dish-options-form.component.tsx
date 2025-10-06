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
    if (selectedOptions && Object.keys(selectedOptions).length === dishDetail.options.length) {
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
    <div className="flex max-h-[600px] flex-col gap-2 md:gap-6">
      {!isEditing && (
        <Button variant="ghost" size="sm" className="justify-start" onClick={onBack}>
          <ArrowLeftIcon size={16} />
          Quay lại
        </Button>
      )}
      <h1 className="text-center text-xl font-bold">
        {dishDetail.name} -{' '}
        <span className="text-primary text-xl font-bold">{dishDetail.getFormattedBasePrice()}</span>
      </h1>

      {/* Dish image */}
      <div className="flex justify-center">
        <div className="relative h-16 w-16 overflow-hidden rounded-full">
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
        rows={2}
      />

      {/* Options selection */}
      <DishOptionsSelectField
        dish={dishDetail}
        selectedOptions={selectedOptions}
        onSelect={setSelectedOptions}
      />

      {/* Take away option */}
      <div className="flex items-center gap-2 my-4">
        <Checkbox
          id="takeAway"
          checked={takeAway}
          onCheckedChange={(checked) => setTakeAway(checked === true)}
        />
        <label htmlFor="takeAway" className="cursor-pointer font-medium">
          Mang về
        </label>
      </div>

      {/* Add to bag button */}
      <div className="flex items-center justify-between border-t bg-white pt-4">
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
          disabled={Object.keys(selectedOptions).length !== dishDetail.options.length}
          className="text-md rounded-full py-4"
        >
          <ShoppingBagIcon className="h-4 w-4" />
          {isEditing ? 'Cập nhật món' : 'Thêm món'}
        </Button>
      </div>
    </div>
  );
}
