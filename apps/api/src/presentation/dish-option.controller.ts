import { Request, Response } from "express";
import { DishOptionUseCase } from "@application/use-case";
import { container } from "@infras/di";
import { DISH_OPTION_USE_CASE } from "@infras/di/tokens";
import { 
  CreateDishOptionRequestDTO, 
  DishOptionResponseDTO, 
  DishOptionOperationResponseDTO, 
  UpdateDishOptionRequestDTO 
} from "@pr80-app/shared-contracts";

const dishOptionUseCase = container.resolve<DishOptionUseCase>(DISH_OPTION_USE_CASE);

export class DishOptionController {
  static async getDishOptions(
    req: Request, 
    res: Response<DishOptionResponseDTO[]>
  ) {
    const dishOptions = await dishOptionUseCase.getDishOptions();
    return res.json(dishOptions ? dishOptions.map(option => option.toJSON()) : []);
  }

  static async getDishOptionById(
    req: Request<{ id: string }>, 
    res: Response<DishOptionResponseDTO>
  ) {
    const { id } = req.params;
    const dishOption = await dishOptionUseCase.getDishOptionById(id);
    return res.json(dishOption.toJSON());
  }

  static async createDishOption(
    req: Request<{}, {}, CreateDishOptionRequestDTO>, 
    res: Response<DishOptionResponseDTO>
  ) {
    const { name, description, options } = req.body;
    const dishOption = await dishOptionUseCase.createDishOption(
      name,
      description,
      options
    );
    return res.status(201).json(dishOption.toJSON());
  }

  static async updateDishOption(
    req: Request<{ id: string }, {}, UpdateDishOptionRequestDTO>,
    res: Response<DishOptionResponseDTO>
  ) {
    const { id } = req.params;
    const changes = req.body;
    const updatedDishOption = await dishOptionUseCase.updateDishOption(id, changes);
    return res.json(updatedDishOption.toJSON());
  }

  static async deleteDishOption(
    req: Request<{ id: string }>, 
    res: Response<DishOptionOperationResponseDTO>
  ) {
    const { id } = req.params;
    const result = await dishOptionUseCase.deleteDishOption(id);
    return res.status(200).json(result);
  }
}