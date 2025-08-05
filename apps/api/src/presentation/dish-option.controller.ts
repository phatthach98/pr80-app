import { Request, Response } from "express";
import { DishOptionUseCase } from "@application/use-case";
import { container } from "@infras/di";
import { DISH_OPTION_USE_CASE } from "@infras/di/tokens";
import { 
  CreateDishOptionDto, 
  DishOptionDto, 
  DishOptionResponseDto, 
  UpdateDishOptionDto 
} from "./dto/dish-option.dto";

const dishOptionUseCase = container.resolve<DishOptionUseCase>(DISH_OPTION_USE_CASE);

export class DishOptionController {
  static async getDishOptions(
    req: Request, 
    res: Response<DishOptionDto[]>
  ) {
    const dishOptions = await dishOptionUseCase.getDishOptions();
    return res.json(dishOptions || []);
  }

  static async getDishOptionById(
    req: Request<{ id: string }>, 
    res: Response<DishOptionDto>
  ) {
    const { id } = req.params;
    const dishOption = await dishOptionUseCase.getDishOptionById(id);
    return res.json(dishOption);
  }

  static async createDishOption(
    req: Request<{}, {}, CreateDishOptionDto>, 
    res: Response<DishOptionDto>
  ) {
    const { name, description, options } = req.body;
    const dishOption = await dishOptionUseCase.createDishOption(
      name,
      description,
      options
    );
    return res.status(201).json(dishOption);
  }

  static async updateDishOption(
    req: Request<{ id: string }, {}, UpdateDishOptionDto>,
    res: Response<DishOptionDto>
  ) {
    const { id } = req.params;
    const changes = req.body;
    const updatedDishOption = await dishOptionUseCase.updateDishOption(id, changes);
    return res.json(updatedDishOption);
  }

  static async deleteDishOption(
    req: Request<{ id: string }>, 
    res: Response<DishOptionResponseDto>
  ) {
    const { id } = req.params;
    const result = await dishOptionUseCase.deleteDishOption(id);
    return res.status(200).json(result);
  }
}