import { DishOptionRepository } from "@application/interface/repository/dish-option-repo.interface";
import { DishOption } from "@domain/entity/dish-option";
import { DishOptionSchema } from "../schemas/dish-option-schema";
import { DishSelectOption } from "../../../types";

export class DishOptionRepositoryImpl implements DishOptionRepository {
  // Removed constructor injection - using schema directly

  async getDishOptions(): Promise<DishOption[] | null> {
    try {
      const dishOptions = await DishOptionSchema.find().lean();

      if (!dishOptions.length) {
        return null;
      }

      return dishOptions.map(
        (option) =>
          new DishOption(
            option.id,
            option.name,
            option.description,
            option.options
          )
      );
    } catch (error) {
      console.error("Error fetching dish options:", error);
      return null;
    }
  }

  async create(dishOption: DishOption): Promise<DishOption> {
    try {
      await DishOptionSchema.create({
        id: dishOption.id,
        name: dishOption.name,
        description: dishOption.description,
        options: dishOption.options,
      });

      return dishOption;
    } catch (error) {
      console.error("Error creating dish option:", error);
      throw error;
    }
  }

  async update(changes: Partial<DishOption>): Promise<DishOption> {
    try {
      const { id, ...updateData } = changes;

      const updatedDishOption = await DishOptionSchema.findOneAndUpdate(
        { id },
        updateData,
        { new: true }
      ).lean();

      if (!updatedDishOption) {
        throw new Error("Dish option not found");
      }

      return new DishOption(
        updatedDishOption.id,
        updatedDishOption.name,
        updatedDishOption.description,
        updatedDishOption.options as DishSelectOption[]
      );
    } catch (error) {
      console.error("Error updating dish option:", error);
      throw error;
    }
  }

  async getDishOptionById(id: string): Promise<DishOption | null> {
    try {
      const dishOption = await DishOptionSchema.findOne({ id }).lean();

      if (!dishOption) {
        return null;
      }

      return new DishOption(
        dishOption.id,
        dishOption.name,
        dishOption.description,
        dishOption.options as DishSelectOption[]
      );
    } catch (error) {
      console.error("Error fetching dish option by ID:", error);
      return null;
    }
  }

  async deleteDishOption(id: string): Promise<boolean> {
    try {
      const result = await DishOptionSchema.deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting dish option:", error);
      return false;
    }
  }
}
