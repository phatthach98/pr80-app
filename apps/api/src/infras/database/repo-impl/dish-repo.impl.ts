import { v4 as uuid } from "uuid";
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
            dish._id.toString(), // Use _id as id in domain model
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
      // Find by MongoDB _id
      const dish = await DishSchema.findOne({ _id: id }).lean();
      
      if (!dish) {
        return null;
      }

      return new Dish(
        dish._id.toString(), // Use _id as id in domain model
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
        _id: dish.id, // Map domain id to MongoDB _id
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
      
      if (!id) {
        throw new Error("Dish ID is required for update");
      }

      // Find by MongoDB _id
      const updatedDish = await DishSchema.findOneAndUpdate(
        { _id: id },
        { 
          $set: {
            ...updateData
          }
        },
        { new: true }
      ).lean();

      if (!updatedDish) {
        throw new Error(`Dish with id ${id} not found`);
      }

      return new Dish(
        updatedDish._id.toString(), // Use _id as id in domain model
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
      // Delete by MongoDB _id
      const result = await DishSchema.findOneAndDelete({ _id: id });
      return !!result;
    } catch (error) {
      console.error("Error deleting dish:", error);
      return false;
    }
  }
}