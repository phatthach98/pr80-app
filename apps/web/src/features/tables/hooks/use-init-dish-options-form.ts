import { DishOptionItem } from '@/domain/entity/dish-option-item';
import { OrderDish } from '@/domain/entity/order-dish';
import { useDishesQuery } from '@/hooks/query';
import { useEffect, useState } from 'react';

export function useInitDishOptionsForm(orderDish: OrderDish) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, DishOptionItem[]>>({});
  const { data: dishes, isPending, isError } = useDishesQuery();
  const dishDetail = dishes?.find((dish) => dish.id === orderDish?.dishId);

  useEffect(() => {
    if (dishDetail) {
      // Convert the OrderDishOption array to the format expected by the form
      const optionsByName: Record<string, DishOptionItem[]> = {};

      // Group by dish option name
      orderDish.selectedOptions.forEach((option) => {
        if (!optionsByName[option.dishOptionName]) {
          optionsByName[option.dishOptionName] = [];
        }

        // Find the corresponding dish option item from the dish options
        const dishOption = dishDetail.options.find((opt) => opt.name === option.dishOptionName);
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

      setSelectedOptions(optionsByName);
    }
  }, [JSON.stringify(orderDish)]);

  return {
    isPending,
    isError,
    dishDetail,
    selectedOptions,
    setSelectedOptions,
  };
}
