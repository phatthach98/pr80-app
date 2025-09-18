import { Dish, DishOptionWithMetadata } from "@domain/entity/dish";
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
    price: string,
    options: DishOptionWithMetadata[]
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

  async addOptionToDish(
    dishId: string,
    optionId: string,
    maxSelectionCount: number
  ) {
    // Get dish from repository directly to avoid fetching options
    const dish = await this.dishRepository.getDishById(dishId);

    if (!dish) {
      throw new NotFoundError(`Dish with id ${dishId} not found`);
    }

    dish.addOption({ id: optionId, maxSelectionCount });

    return this.dishRepository.update(dish);
  }

  async removeOptionFromDish(dishId: string, optionId: string) {
    // Get dish from repository directly to avoid fetching options
    const dish = await this.dishRepository.getDishById(dishId);

    if (!dish) {
      throw new NotFoundError(`Dish with id ${dishId} not found`);
    }

    dish.removeOption(optionId);

    return this.dishRepository.update(dish);
  }
}
