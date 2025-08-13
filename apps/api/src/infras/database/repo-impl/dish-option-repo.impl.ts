import { DishOptionRepository } from "@application/interface/repository/dish-option-repo.interface";
import { DishOption } from "@domain/entity/dish-option";
import { DishOptionSchema } from "../schemas/dish-option-schema";
import { formatDecimal } from "../utils/mongodb.util";
import { Types } from "mongoose";

export class DishOptionRepositoryImpl implements DishOptionRepository {
  // Removed constructor injection - using schema directly

  async getDishOptions(): Promise<DishOption[] | null> {
    try {
      const dishOptions = await DishOptionSchema.find().lean();

      if (!dishOptions.length) {
        return null;
      }

      return dishOptions.map((option) => {
        const formattedOptions = option.options.map((o) => {
          return {
            ...o,
            extraPrice: formatDecimal(o.extraPrice),
          };
        });
        return new DishOption(
          option._id.toString(), // Use _id as id in domain model
          option.name,
          option.description,
          formattedOptions
        );
      });
    } catch (error) {
      console.error("Error fetching dish options:", error);
      return null;
    }
  }

  async create(dishOption: DishOption): Promise<DishOption> {
    try {
      await DishOptionSchema.create({
        _id: dishOption.id, // Map domain id to MongoDB _id
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

      if (!id) {
        throw new Error("Dish option ID is required for update");
      }

      // Find by MongoDB _id
      const updatedDishOption = await DishOptionSchema.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            ...updateData,
          },
        },
        { new: true }
      ).lean();

      if (!updatedDishOption) {
        throw new Error(`Dish option with id ${id} not found`);
      }

      const formattedOptions = (updatedDishOption.options ?? []).map(
        (option) => {
          return {
            ...option,
            extraPrice: formatDecimal(option.extraPrice),
          };
        }
      );

      return new DishOption(
        updatedDishOption._id.toString(), // Use _id as id in domain model
        updatedDishOption.name,
        updatedDishOption.description,
        formattedOptions
      );
    } catch (error) {
      console.error("Error updating dish option:", error);
      throw error;
    }
  }

  async getDishOptionById(id: string): Promise<DishOption | null> {
    try {
      // Find by MongoDB _id
      const dishOption = await DishOptionSchema.findOne({ _id: id }).lean();

      if (!dishOption) {
        return null;
      }

      const formattedOptions = dishOption.options.map((option) => {
        return {
          ...option,
          extraPrice: formatDecimal(option.extraPrice),
        };
      });

      return new DishOption(
        dishOption._id.toString(), // Use _id as id in domain model
        dishOption.name,
        dishOption.description,
        formattedOptions
      );
    } catch (error) {
      console.error("Error fetching dish option by ID:", error);
      return null;
    }
  }

  async getDishOptionsByIds(ids: string[]): Promise<DishOption[]> {
    try {
      // Find all dish options with _id in the provided ids array
      const dishOptions = await DishOptionSchema.find({
        _id: { $in: ids },
      }).lean();

      // Map the database objects to domain entities
      return dishOptions.map((dishOption) => {
        const formattedOptions = (dishOption.options ?? []).map((o) => {
          return {
            ...o,
            extraPrice: formatDecimal(o.extraPrice),
          };
        });
        return new DishOption(
          dishOption._id.toString(),
          dishOption.name,
          dishOption.description,
          formattedOptions
        );
      });
    } catch (error) {
      console.error("Error fetching dish options by IDs:", error);
      return [];
    }
  }

  async deleteDishOption(id: string): Promise<boolean> {
    try {
      // Delete by MongoDB _id
      const result = await DishOptionSchema.findOneAndDelete({ _id: id });
      return !!result;
    } catch (error) {
      console.error("Error deleting dish option:", error);
      return false;
    }
  }
}
