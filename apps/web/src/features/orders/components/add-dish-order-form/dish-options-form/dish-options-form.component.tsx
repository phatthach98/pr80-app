import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dish, DishOption } from '@/domain/entity';
import { OrderDishOption } from '@/domain/entity/order-dish-option';
import { ArrowLeftIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from 'lucide-react';
import { SelectOptionWithPrice } from '@pr80-app/shared-contracts';
import defaultDishImage from '@/assets/default-dish.png';
import { DishOptionsSelectField } from './dish-options-select-field';
import { useDishesQuery } from '@/hooks/query';
import { DishOptionItem } from '@/domain/entity/dish-option-item';

interface DishOptionsProps {
  dish: Dish;
  onBack: () => void;
  handleAddDishToOrder: (
    dish: Dish,
    selectedOptions: OrderDishOption[],
    quantity: number,
    takeAway: boolean,
  ) => void;
}

export function DishOptionsForm({ dish, onBack, handleAddDishToOrder }: DishOptionsProps) {
  // Get full dish details with options
  const { data: dishes, isLoading, error } = useDishesQuery();

  const [selectedOptions, setSelectedOptions] = useState<Record<string, DishOptionItem[]>>({});
  const [quantity, setQuantity] = useState(1);
  const dishWithOptions = (dishes || []).find((d) => d.id === dish.id);
  if (isLoading) return <div className="py-8 text-center">Đang tải tùy chọn...</div>;
  if (error) return <div className="py-8 text-center text-red-500">Lỗi: {error.message}</div>;
  if (!dishWithOptions) return <div className="py-8 text-center">Không tìm thấy tùy chọn</div>;

  const handleAddToOrder = () => {
    if (selectedOptions && Object.keys(selectedOptions).length > 0) {
      const orderDishOptions = Object.keys(selectedOptions).map((selectedOptionItemName) => {
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

      handleAddDishToOrder(dishWithOptions, orderDishOptions.flat(), quantity, false);
    }
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Header with back button and price */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 p-0"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>

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
      <DishOptionsSelectField dish={dishWithOptions} onSelect={setSelectedOptions} />

      {/* Add to bag button */}
      <div className="mt-16 flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full border-gray-300"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="w-6 text-center text-lg font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full border-gray-300"
            onClick={() => setQuantity((q) => q + 1)}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={handleAddToOrder} disabled={false} className="text-md rounded-full py-6">
          <ShoppingBagIcon className="h-5 w-5" />
          Thêm vào đơn hàng
        </Button>
      </div>
    </div>
  );
}
