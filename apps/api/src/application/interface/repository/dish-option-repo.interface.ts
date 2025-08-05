import { DishOption } from "@domain/entity/dish-option";

export interface DishOptionRepository {
  getDishOptions(): Promise<DishOption[] | null>;
  getDishOptionById(id: string): Promise<DishOption | null>;
  create(dishOption: DishOption): Promise<DishOption>;
  update(changes: Partial<DishOption>): Promise<DishOption>;
  deleteDishOption(id: string): Promise<boolean>;
}
