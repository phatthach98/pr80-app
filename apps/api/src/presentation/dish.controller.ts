import { Request, Response } from "express";
import { DishUseCase } from "@application/use-case";
import { DISH_USE_CASE } from "@infras/di/tokens";
import { container } from "@infras/di";
import { CreateDishDto, DishDto, UpdateDishDto } from "./dto/dish.dto";

const dishUseCase = container.resolve<DishUseCase>(DISH_USE_CASE);

export class DishController {
  static async getDishes(
    req: Request, 
    res: Response<DishDto[]>
  ) {
    const dishes = await dishUseCase.getDishes();
    res.json(dishes || []);
  }

  static async getDishById(
    req: Request<{ id: string }>, 
    res: Response<DishDto>
  ) {
    const { id } = req.params;
    const dish = await dishUseCase.getDishById(id);
    res.json(dish);
  }

  static async createDish(
    req: Request<{}, {}, CreateDishDto>, 
    res: Response<DishDto>
  ) {
    const { name, description, price, options } = req.body;
    const dish = await dishUseCase.createDish(
      name,
      description,
      price,
      options || []
    );
    res.status(201).json(dish);
  }

  static async updateDish(
    req: Request<{ id: string }, {}, UpdateDishDto>,
    res: Response<DishDto>
  ) {
    const { id } = req.params;
    const dish = await dishUseCase.updateDish(id, req.body);
    res.json(dish);
  }

  static async deleteDish(
    req: Request<{ id: string }>,
    res: Response
  ) {
    const { id } = req.params;
    await dishUseCase.deleteDish(id);
    res.status(204).end();
  }

  static async addOptionToDish(
    req: Request<{ id: string; optionId: string }>,
    res: Response<DishDto>
  ) {
    const { id, optionId } = req.params;
    const dish = await dishUseCase.addOptionToDish(id, optionId);
    res.json(dish);
  }

  static async removeOptionFromDish(
    req: Request<{ id: string; optionId: string }>,
    res: Response<DishDto>
  ) {
    const { id, optionId } = req.params;
    const dish = await dishUseCase.removeOptionFromDish(id, optionId);
    res.json(dish);
  }
}