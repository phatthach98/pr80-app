import { Button } from '@/components/ui';
import { Dish, DishOption } from '@/domain/entity';
import { DishOptionItem } from '@/domain/entity/dish-option-item';
import { cn } from '@/tailwind/utils';

interface DishOptionsSelectFieldProps {
  dish: Dish;
  selectedOptions: Record<string, DishOptionItem[]>;
  onSelect: (orderDishOption: Record<string, DishOptionItem[]>) => void;
}

export const DishOptionsSelectField = (props: DishOptionsSelectFieldProps) => {
  const { dish, selectedOptions, onSelect } = props;
  const dishOptions = dish.options;

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
    const isOverMaxSelectionCount =
      !!maxSelectionCount && checkIsOverMaxSelectionCount(dishOptionName, maxSelectionCount);
    const optionsByName = selectedOptions[dishOptionName] || [];
    let currentOptions = { ...selectedOptions };

    if (isSelected) {
      currentOptions = {
        ...currentOptions,
        [dishOptionName]: optionsByName.filter((opt) => !opt.equals(dishOptionItem)),
      };
    } else if (!isOverMaxSelectionCount) {
      currentOptions = {
        ...currentOptions,
        [dishOptionName]: [...optionsByName, dishOptionItem],
      };
    } else {
      // Max selection reached, do nothing
      return;
    }

    // Only call onSelect, no internal state
    onSelect(currentOptions);
  };

  return (
    <>
      {dishOptions.map((dishOption) => {
        return (
          <div key={dishOption.id}>
            <h3 className="text-md mb-2 font-medium">
              {dishOption.name}
              {true && <span className="ml-1 text-red-500">*</span>}
            </h3>

            <div className="flex flex-wrap gap-2">
              {dishOption.items.map((dishOptionItem) => {
                // Check if this item is selected
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
