import { DishRepository } from "@application/interface/repository/dish-repo.interface";
import { Dish } from "@domain/entity/dish";
import { DishSchema } from "../schemas/dish-schema";

export class DishRepositoryImpl implements DishRepository {
  async getDishes(): Promise<Dish[] | null> {
    try {
      const dishes = await DishSchema.find().lean();
      
      if (!dishes) {
        return null;
      }

      return dishes.map(
        (dish) =>
          new Dish(
            dish.id,
            dish.name,
            dish.description || "",
            parseFloat(dish.price.toString()),
            dish.options
          )
      );
    } catch (error) {
      console.error("Error fetching dishes:", error);
      return null;
    }
  }

  async getDishById(id: string): Promise<Dish | null> {
    try {
      const dish = await DishSchema.findOne({ id }).lean();
      
      if (!dish) {
        return null;
      }

      return new Dish(
        dish.id,
        dish.name,
        dish.description || "",
        parseFloat(dish.price.toString()),
        dish.options
      );
    } catch (error) {
      console.error("Error fetching dish by ID:", error);
      return null;
    }
  }

  async create(dish: Dish): Promise<Dish> {
    try {
      await DishSchema.create({
        id: dish.id,
        name: dish.name,
        description: dish.description,
        price: dish.price,
        options: dish.options
      });

      return dish;
    } catch (error) {
      console.error("Error creating dish:", error);
      throw error;
    }
  }

  async update(changes: Partial<Dish>): Promise<Dish> {
    try {
      const { id, ...updateData } = changes;
      
      const updatedDish = await DishSchema.findOneAndUpdate(
        { id },
        { $set: updateData },
        { new: true }
      ).lean();

      if (!updatedDish) {
        throw new Error(`Dish with id ${id} not found`);
      }

      return new Dish(
        updatedDish.id,
        updatedDish.name,
        updatedDish.description || "",
        parseFloat(updatedDish.price.toString()),
        updatedDish.options
      );
    } catch (error) {
      console.error("Error updating dish:", error);
      throw error;
    }
  }

  async deleteDish(id: string): Promise<boolean> {
    try {
      const result = await DishSchema.deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting dish:", error);
      return false;
    }
  }
}