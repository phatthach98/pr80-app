import { useDishesQuery } from '@/hooks/query/dishes.query';
import { Dish } from '@/domain/entity';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import defaultDishImage from '@/assets/default-dish.png';

interface DishListProps {
  onSelectDish: (dish: Dish) => void;
}

export function DishListForm({ onSelectDish }: DishListProps) {
  const { data: dishes, isLoading, error } = useDishesQuery();

  if (isLoading) return <div className="py-8 text-center">Đang tải danh sách món...</div>;
  if (error) return <div className="py-8 text-center text-red-500">Lỗi: {error.message}</div>;
  if (!dishes?.length) return <div className="py-8 text-center">Không có món ăn nào</div>;

  return (
    <div className="grid max-h-[500px] grid-cols-1 gap-4 overflow-y-auto">
      {dishes.map((dish) => (
        <div
          key={dish.id}
          className="flex cursor-pointer items-center rounded-xl border-2 border-gray-200 bg-white p-2 transition-all hover:shadow-md"
          onClick={() => onSelectDish(dish)}
        >
          {/* Dish image */}
          <div className="relative mr-3 h-14 w-14 overflow-hidden rounded-xl">
            <img src={defaultDishImage} alt={dish.name} className="h-full w-full object-cover" />
          </div>

          {/* Dish info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="line-clamp-1 text-base font-semibold">{dish.name}</h3>
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{dish.description}</p>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-primary font-bold">{dish.getFormattedBasePrice()}</div>
              {dish.hasOptions() && (
                <div className="rounded-full bg-gray-100 px-2 py-1 text-xs">Có tùy chọn</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
