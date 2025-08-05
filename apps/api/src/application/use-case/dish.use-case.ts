import { Dish } from "@domain/entity/dish";
import { DishRepository } from "../interface/repository/dish-repo.interface";
import { NotFoundError } from "@application/errors";

export class DishUseCase {
  constructor(private readonly dishRepository: DishRepository) {}

  async getDishes() {
    return this.dishRepository.getDishes();
  }

  async getDishById(id: string) {
    const dish = await this.dishRepository.getDishById(id);
    
    if (!dish) {
      throw new NotFoundError(`Dish with id ${id} not found`);
    }
    
    return dish;
  }

  async createDish(
    name: string,
    description: string,
    price: number,
    options: { id: string }[] = []
  ) {
    const dish = Dish.create(name, description, price, options);
    return this.dishRepository.create(dish);
  }

  async updateDish(id: string, changes: Partial<Omit<Dish, "id">>) {
    const dish = await this.dishRepository.getDishById(id);

    if (!dish) {
      throw new NotFoundError(`Dish with id ${id} not found`);
    }

    const updatedDish = {
      ...dish,
      ...changes,
      id,
    };

    return this.dishRepository.update(updatedDish);
  }

  async deleteDish(id: string) {
    const dish = await this.dishRepository.getDishById(id);

    if (!dish) {
      throw new NotFoundError(`Dish with id ${id} not found`);
    }

    const deleted = await this.dishRepository.deleteDish(id);
    
    if (!deleted) {
      throw new Error(`Failed to delete dish with id ${id}`);
    }
    
    return { success: true, message: "Dish deleted successfully" };
  }

  async addOptionToDish(dishId: string, optionId: string) {
    const dish = await this.getDishById(dishId);
    
    dish.addOption(optionId);
    
    return this.dishRepository.update(dish);
  }

  async removeOptionFromDish(dishId: string, optionId: string) {
    const dish = await this.getDishById(dishId);
    
    dish.removeOption(optionId);
    
    return this.dishRepository.update(dish);
  }
}