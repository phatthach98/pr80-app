import { Dish } from "@domain/entity/dish";

export interface DishRepository {
  getDishes(): Promise<Dish[] | null>;
  getDishById(id: string): Promise<Dish | null>;
  create(dish: Dish): Promise<Dish>;
  update(changes: Partial<Dish>): Promise<Dish>;
  deleteDish(id: string): Promise<boolean>;
}