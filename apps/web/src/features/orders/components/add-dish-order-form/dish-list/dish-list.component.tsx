import { useDishesQuery } from '@/hooks/query/dishes.query';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dish } from '@/domain/entity';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';

interface DishListProps {
  onSelectDish: (dish: Dish) => void;
}

export function DishList({ onSelectDish }: DishListProps) {
  const { data: dishes, isLoading, error } = useDishesQuery();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter dishes by search term
  const filteredDishes = dishes?.filter(
    (dish) =>
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) return <div className="py-8 text-center">Đang tải danh sách món...</div>;
  if (error) return <div className="py-8 text-center text-red-500">Lỗi: {error.message}</div>;
  if (!dishes?.length) return <div className="py-8 text-center">Không có món ăn nào</div>;

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          placeholder="Tìm kiếm món ăn..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Dish list */}
      <div className="grid max-h-[400px] grid-cols-1 gap-3 overflow-y-auto pr-1">
        {filteredDishes?.map((dish) => (
          <Card
            key={dish.id}
            className="hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => onSelectDish(dish)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{dish.name}</CardTitle>
              <CardDescription className="line-clamp-2 text-xs">{dish.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between pt-0">
              <div className="font-medium">{dish.getFormattedBasePrice()}</div>
              {dish.hasOptions() && (
                <div className="text-muted-foreground text-xs">Có tùy chọn</div>
              )}
            </CardFooter>
          </Card>
        ))}

        {filteredDishes?.length === 0 && (
          <div className="text-muted-foreground py-8 text-center">
            Không tìm thấy món ăn phù hợp
          </div>
        )}
      </div>
    </div>
  );
}
