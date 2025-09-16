import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dish, DishOption } from '@/domain/entity';
import { OrderDishOption } from '@/domain/entity/order-dish-option';
import { useDishWithOptionsQuery } from '@/hooks/query/dishes.query';
import { ArrowLeftIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { SelectOptionWithPrice } from '@pr80-app/shared-contracts';

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

export function DishOptions({ dish, onBack, handleAddDishToOrder }: DishOptionsProps) {
  // Get full dish details with options
  const { data: dishWithOptions, isLoading, error } = useDishWithOptionsQuery(dish.id);

  const [selectedOptions, setSelectedOptions] = useState<OrderDishOption[]>([]);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <div className="py-8 text-center">Đang tải tùy chọn...</div>;
  if (error) return <div className="py-8 text-center text-red-500">Lỗi: {error.message}</div>;
  if (!dishWithOptions) return <div className="py-8 text-center">Không tìm thấy món ăn</div>;

  const handleOptionChange = (
    option: DishOption,
    selection: SelectOptionWithPrice,
    isMultiple: boolean,
  ) => {
    setSelectedOptions((prev) => {
      // Check if we already have this option selected
      const existingOptionIndex = prev.findIndex(opt => opt.dishOptionId === option.id);
      
      // Create new OrderDishOption
      const newOption = OrderDishOption.fromResponseDTO({
        dishOptionId: option.id,
        dishOptionName: option.name,
        itemValue: selection.value,
        itemLabel: selection.label,
        extraPrice: selection.extraPrice
      });
      
      if (existingOptionIndex >= 0) {
        if (isMultiple) {
          // For multiple selections (like checkboxes) - not implemented yet
          // Would need to track multiple selections per option
          return prev;
        } else {
          // For single selection, replace the existing option
          const newOptions = [...prev];
          newOptions[existingOptionIndex] = newOption;
          return newOptions;
        }
      } else {
        // Add new option
        return [...prev, newOption];
      }
    });
  };

  const handleAddToOrder = () => {
    handleAddDishToOrder(dishWithOptions, selectedOptions, quantity, false);
  };

  const isOptionRequired = (): boolean => {
    // This is a placeholder - in a real implementation,
    // the DishOption entity would have an isRequired method
    return true;
  };

  const isMultipleSelection = (): boolean => {
    // This is a placeholder - in a real implementation,
    // the DishOption entity would have an isMultiSelect method
    return false;
  };

  const isOptionValid = (option: DishOption): boolean => {
    if (!isOptionRequired()) return true;
    return selectedOptions.some(opt => opt.dishOptionId === option.id);
  };

  const areAllOptionsValid = dishWithOptions.options.every(isOptionValid);

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground flex h-auto items-center p-0"
      >
        <ArrowLeftIcon className="mr-1 h-4 w-4" />
        Quay lại danh sách món
      </Button>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{dishWithOptions.name}</CardTitle>
          <CardDescription className="text-xs">{dishWithOptions.description}</CardDescription>
          <div className="font-medium">{dishWithOptions.getFormattedBasePrice()}</div>
        </CardHeader>
      </Card>

      {/* Options */}
      <ScrollArea className="max-h-[300px]">
        <div className="space-y-3 pr-1">
          {dishWithOptions.options.map((option) => (
            <Card key={option.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm">
                  {option.name}
                  {isOptionRequired() && <span className="ml-1 text-red-500">*</span>}
                </CardTitle>
                <CardDescription className="text-xs">{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Simplified option selection - we'll implement proper UI components later */}
                <div className="space-y-2">
                  {option.items.map((selection) => (
                    <div
                      key={selection.value}
                      className={`cursor-pointer rounded-md border p-2 ${
                        selectedOptions.some(opt => 
                          opt.dishOptionId === option.id && 
                          opt.itemValue === selection.value
                        )
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleOptionChange(option, selection, isMultipleSelection())}
                    >
                      <div className="flex w-full justify-between">
                        <span>{selection.label}</span>
                        {parseFloat(selection.extraPrice) > 0 && (
                          <span className="text-muted-foreground">
                            +{selection.getFormattedExtraPrice()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Quantity and Add button */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="w-6 text-center">{quantity}</span>
          <Button variant="outline" size="icon" onClick={() => setQuantity((q) => q + 1)}>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>

        <Button onClick={handleAddToOrder} disabled={!areAllOptionsValid}>
          Thêm vào đơn hàng
        </Button>
      </div>
    </div>
  );
}
