import { OrderDish } from '@/domain/entity/order-dish';
import defaultDishImage from '@/assets/default-dish.png';
import { Button, QuantityInput } from '@/components/ui';
import { EditIcon, XIcon } from 'lucide-react';

type TableDishItemProps = {
  dish: OrderDish;
  isEditable: boolean;
  removeDish: (dishId: string) => void;
  handleEditDish: (dish: OrderDish) => void;
  updateDishQuantity: (dishId: string, quantity: number) => void;
};

export const TableDishItem = ({
  dish,
  isEditable,
  removeDish,
  handleEditDish,
  updateDishQuantity,
}: TableDishItemProps) => {
  return (
    <div
      key={dish.id || dish.dishId}
      className="border-b border-dashed pb-4 last:border-b-0 md:rounded-lg md:p-4 md:pb-6 md:transition-colors md:hover:bg-gray-50"
    >
      <div className="flex items-start gap-4 md:gap-6">
        {/* Dish image */}
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md md:h-20 md:w-20 lg:h-24 lg:w-24">
          <img
            src={defaultDishImage}
            alt={dish.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = defaultDishImage;
            }}
          />
        </div>

        {/* Dish details */}
        <div className="flex-1 cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium md:text-lg lg:text-xl">
                {dish.name} {dish.takeAway && '(Mang về)'}
              </h3>
              <div className="text-sm text-gray-500 md:mt-1 md:text-base lg:mt-2">
                {/* Show variant info */}
                {Object.entries(dish.getDishOptionNameGroupById()).map(
                  ([dishOptionId, dishOptionNameGroup], index) => (
                    <div key={dishOptionId} className={index > 0 ? 'mt-1 md:mt-2' : ''}>
                      <span className="md:font-medium">
                        {dishOptionNameGroup[0].dishOptionName}:{' '}
                      </span>
                      <span className="font-semibold">
                        {dishOptionNameGroup.map((item) => item.itemLabel).join(' - ')}
                      </span>
                    </div>
                  ),
                )}
              </div>
              {dish.note && (
                <div className="mt-2 rounded-md text-sm italic md:mt-3">
                  Ghi chú: <span className="text-destructive">{dish.note}</span>
                </div>
              )}
              <div className="mt-2 text-gray-700 md:mt-3 md:text-lg lg:text-xl">
                <span className="font-semibold">{dish.getFormattedPriceWithSelectedOption()}</span>{' '}
                (x{dish.quantity} = {dish.getFormattedTotalPrice()})
              </div>
            </div>

            {/* Remove button */}
            <Button
              disabled={!isEditable}
              variant="ghost"
              onClick={() => removeDish(dish.id || dish.dishId)}
              className="text-gray-400 hover:text-gray-600 md:rounded md:p-1 md:hover:bg-gray-100"
              aria-label="Remove item"
            >
              <XIcon size={18} className="md:h-5 md:w-5 lg:h-6 lg:w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between md:mt-6">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          disabled={!isEditable}
          onClick={(e) => {
            e.stopPropagation();
            handleEditDish(dish);
          }}
        >
          <EditIcon size={16} />
          Sửa
        </Button>

        <QuantityInput
          disabled={!isEditable}
          value={dish.quantity}
          onChange={(value) => updateDishQuantity(dish.id || dish.dishId, value)}
          min={1}
          size="md"
          className="md:gap-4"
          valueClassName="md:w-8 md:text-lg lg:text-xl"
          buttonClassName="md:h-10 md:w-10 lg:h-12 lg:w-12"
        />
      </div>
    </div>
  );
};
