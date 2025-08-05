import { DishOption } from "@domain/entity/dish-option";
import { DishOptionRepository } from "../interface/repository/dish-option-repo.interface";
import { SelectOption } from "../../types";
import { NotFoundError } from "@application/errors";

export class DishOptionUseCase {
  constructor(private readonly dishOptionRepository: DishOptionRepository) {}

  async getDishOptions() {
    return this.dishOptionRepository.getDishOptions();
  }

  async getDishOptionById(id: string) {
    const dishOption = await this.dishOptionRepository.getDishOptionById(id);
    
    if (!dishOption) {
      throw new NotFoundError(`Dish option with id ${id} not found`);
    }
    
    return dishOption;
  }

  async createDishOption(
    name: string,
    description: string,
    options: SelectOption[]
  ) {
    const dishOption = DishOption.create(name, description, options);
    return this.dishOptionRepository.create(dishOption);
  }

  async updateDishOption(id: string, changes: Partial<Omit<DishOption, "id">>) {
    const dishOption = await this.dishOptionRepository.getDishOptionById(id);

    if (!dishOption) {
      throw new NotFoundError(`Dish option with id ${id} not found`);
    }

    const updatedDishOption = {
      ...dishOption,
      ...changes,
      id,
    };

    return this.dishOptionRepository.update(updatedDishOption);
  }

  async deleteDishOption(id: string) {
    const dishOption = await this.dishOptionRepository.getDishOptionById(id);

    if (!dishOption) {
      throw new NotFoundError(`Dish option with id ${id} not found`);
    }

    const deleted = await this.dishOptionRepository.deleteDishOption(id);
    
    if (!deleted) {
      throw new Error(`Failed to delete dish option with id ${id}`);
    }
    
    return { success: true, message: "Dish option deleted successfully" };
  }
}
