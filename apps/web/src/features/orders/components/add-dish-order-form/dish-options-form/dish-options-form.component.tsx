import { useEffect, useState } from 'react';
import { Button, Checkbox, QuantityInput } from '@/components/ui';
import { Dish } from '@/domain/entity';
import { OrderDish } from '@/domain/entity/order-dish';
import { OrderDishOption } from '@/domain/entity/order-dish-option';
import { ArrowLeftIcon, ShoppingBagIcon } from 'lucide-react';
import defaultDishImage from '@/assets/default-dish.png';
import { DishOptionsSelectField } from './dish-options-select-field';
import { useDishesQuery } from '@/hooks/query';
import { DishOptionItem } from '@/domain/entity/dish-option-item';

interface DishOptionsProps {
  dish: Dish;
  onBack: () => void;
  handleAddAndUpdateDishToOrder: (
    dish: Dish,
    selectedOptions: OrderDishOption[],
    quantity: number,
    takeAway: boolean,
  ) => void;
  editingOrderDish?: OrderDish;
}

export function DishOptionsForm({
  dish,
  onBack,
  handleAddAndUpdateDishToOrder,
  editingOrderDish,
}: DishOptionsProps) {
  // Get full dish details with options
  const { data: dishes, isLoading, error } = useDishesQuery();

  const [selectedOptions, setSelectedOptions] = useState<Record<string, DishOptionItem[]>>({});
  const [initialOptionsSet, setInitialOptionsSet] = useState(false);
  const [quantity, setQuantity] = useState(editingOrderDish?.quantity || 1);
  const [takeAway, setTakeAway] = useState(editingOrderDish?.takeAway || false);
  const dishWithOptions = (dishes || []).find((d) => d.id === dish.id);
  const isEditing = !!editingOrderDish;
  // Pre-populate selected options if editing an existing dish
  useEffect(() => {
    if (editingOrderDish && dishWithOptions) {
      // Convert the OrderDishOption array to the format expected by the form
      const optionsByName: Record<string, DishOptionItem[]> = {};

      // Group by dish option name
      editingOrderDish.selectedOptions.forEach((option) => {
        if (!optionsByName[option.dishOptionName]) {
          optionsByName[option.dishOptionName] = [];
        }

        // Find the corresponding dish option item from the dish options
        const dishOption = dishWithOptions.options.find(
          (opt) => opt.name === option.dishOptionName,
        );
        if (dishOption) {
          // Find the corresponding DishOptionItem for this OrderDishOption
          // We create a temporary DishOptionItem with the same value to use equals method
          const tempItem = DishOptionItem.fromSelectOptionWithPrice({
            value: option.itemValue,
            label: option.itemLabel,
            extraPrice: option.extraPrice,
          });
          const item = dishOption.items.find((item) => item.equals(tempItem));
          if (item) {
            optionsByName[option.dishOptionName].push(item);
          }
        }
      });

      // Set the options from the editing dish
      setSelectedOptions(optionsByName);
      setInitialOptionsSet(true);
      setQuantity(editingOrderDish.quantity);
      setTakeAway(editingOrderDish.takeAway);
    }
  }, [JSON.stringify(editingOrderDish), JSON.stringify(dishWithOptions)]);

  if (isLoading) return <div className="py-8 text-center">Đang tải tùy chọn...</div>;
  if (error) return <div className="py-8 text-center text-red-500">Lỗi: {error.message}</div>;
  if (!dishWithOptions) return <div className="py-8 text-center">Không tìm thấy tùy chọn</div>;

  const handleAddToOrder = () => {
    // Allow submission if we have options or if we're editing with pre-populated options
    if (selectedOptions && (Object.keys(selectedOptions).length > 0 || initialOptionsSet)) {
      // Get all option keys, ensuring we have at least the ones from the original dish if editing
      const optionKeys = Object.keys(selectedOptions);

      const orderDishOptions = optionKeys.map((selectedOptionItemName) => {
        const dishOption = dishWithOptions.options.find(
          (dishOption) => dishOption.name === selectedOptionItemName,
        );
        if (!dishOption) return [];
        const currentSelectedOptions = selectedOptions[selectedOptionItemName];
        return currentSelectedOptions
          .filter((option) => option.label !== '')
          .map((option) =>
            OrderDishOption.fromDishOptionItem(dishOption.id, dishOption.name, option),
          );
      });

      handleAddAndUpdateDishToOrder(dishWithOptions, orderDishOptions.flat(), quantity, takeAway);
    }
  };

  return (
    <div className="space-y-6 pb-4">
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

        <h1 className="text-xl font-bold">{dishWithOptions.name}</h1>

        <div className="text-primary text-xl font-bold">
          {dishWithOptions.getFormattedBasePrice()}
        </div>
      </div>

      {/* Dish image */}
      <div className="flex justify-center">
        <div className="relative h-36 w-36 overflow-hidden rounded-full">
          <img
            src={defaultDishImage}
            alt={dishWithOptions.name}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Description */}
      <div className="text-muted-foreground text-center">{dishWithOptions.description}</div>

      {/* Options selection */}
      <DishOptionsSelectField
        dish={dishWithOptions}
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
      <div className="mt-8 flex items-center justify-between border-t pt-4">
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
          disabled={!initialOptionsSet && Object.keys(selectedOptions).length === 0}
          className="text-md rounded-full py-6"
        >
          <ShoppingBagIcon className="h-5 w-5" />
          {editingOrderDish ? 'Cập nhật món' : 'Thêm vào đơn hàng'}
        </Button>
      </div>
    </div>
  );
}
