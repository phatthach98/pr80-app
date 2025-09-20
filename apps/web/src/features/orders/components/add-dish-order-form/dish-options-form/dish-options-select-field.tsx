import { Button } from '@/components/ui';
import { Dish, DishOption } from '@/domain/entity';
import { DishOptionItem } from '@/domain/entity/dish-option-item';
import { cn } from '@/tailwind/utils';
import { useState } from 'react';

interface DishOptionsSelectFieldProps {
  dish: Dish;
  onSelect: (orderDishOption: Record<string, DishOptionItem[]>) => void;
}

export const DishOptionsSelectField = (props: DishOptionsSelectFieldProps) => {
  const { dish, onSelect } = props;
  const dishOptions = dish.options;

  const [selectedOptions, setSelectedOptions] = useState<Record<string, DishOptionItem[]>>({});

  const checkIsOverMaxSelectionCount = (dishOptionName: string, maxSelectionCount: number) => {
    const isOverMaxSelectionCount = selectedOptions[dishOptionName]?.length >= maxSelectionCount;
    return isOverMaxSelectionCount;
  };

  const checkIsSelected = (dishOptionName: string, dishOptionItem: DishOptionItem) => {
    const isSelectedOption = !!selectedOptions[dishOptionName]?.some((opt) =>
      opt.equals(dishOptionItem),
    );

    return isSelectedOption;
  };

  const handleDishOptionItemChange = (dishOption: DishOption, dishOptionItem: DishOptionItem) => {
    const maxSelectionCount = dishOption.maxSelectionCount;
    const dishOptionName = dishOption.name;
    const isSelected = checkIsSelected(dishOptionName, dishOptionItem);
    const isOverMaxSelectionCount = checkIsOverMaxSelectionCount(dishOptionName, maxSelectionCount);
    const optionsByName = selectedOptions[dishOptionName] || [];
    let currentOptions = selectedOptions;
    if (isSelected) {
      currentOptions = {
        ...currentOptions,
        [dishOptionName]: optionsByName.filter((opt) => !opt.equals(dishOptionItem)),
      };
    }

    if (!isSelected && !isOverMaxSelectionCount) {
      currentOptions = { ...currentOptions, [dishOptionName]: [...optionsByName, dishOptionItem] };
    }

    setSelectedOptions(currentOptions);
    onSelect(currentOptions);
  };

  return (
    <>
      {dishOptions.map((dishOption) => {
        return (
          <div key={dishOption.id} className="space-y-2">
            <h3 className="font-medium">
              {dishOption.name}
              {/* TODO: add isRequired on DishOptionItem */}
              {true && <span className="ml-1 text-red-500">*</span>}
            </h3>

            <div className="flex flex-wrap gap-2">
              {dishOption.items.map((dishOptionItem) => {
                const isSelected = selectedOptions[dishOption.name]?.some((opt) =>
                  opt.equals(dishOptionItem),
                );
                return (
                  <Button
                    key={dishOptionItem.value}
                    variant="outline"
                    className={cn(
                      'rounded-full border-gray-300',
                      isSelected && '!bg-primary !text-primary-foreground',
                    )}
                    onClick={() => handleDishOptionItemChange(dishOption, dishOptionItem)}
                  >
                    {dishOptionItem.label}
                    {parseFloat(dishOptionItem.extraPrice) > 0 && (
                      <span className="ml-1">+{dishOptionItem.getFormattedExtraPrice()}</span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};
