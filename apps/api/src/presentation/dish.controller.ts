import { Request, Response } from "express";
import { DishUseCase } from "@application/use-case";
import { DISH_USE_CASE } from "@infras/di/tokens";
import { container } from "@infras/di";
import {
  CreateDishRequest,
  DishResponse,
  DishWithOptionsResponse,
  UpdateDishRequest,
} from "./dto/dish.dto";

const dishUseCase = container.resolve<DishUseCase>(DISH_USE_CASE);

export class DishController {
  static async getDishes(req: Request, res: Response<DishResponse[]>) {
    const dishes = await dishUseCase.getDishes();
    res.json(dishes ? dishes.map((dish) => dish.toJSON()) : []);
  }

  static async getDishById(
    req: Request<{ id: string }, {}, {}, { includeOptions?: string }>,
    res: Response<DishResponse | DishWithOptionsResponse>
  ) {
    const { id } = req.params;
    const includeOptions = req.query.includeOptions === 'true';

    let result;
    if (includeOptions) {
      result = await dishUseCase.getDishByIdWithOptions(id);
    } else {
      const dish = await dishUseCase.getDishById(id);
      result = dish.toJSON();
    }

    res.json(result);
  }

  static async createDish(
    req: Request<{}, {}, CreateDishRequest>,
    res: Response<DishResponse>
  ) {
    const { name, description, price, options } = req.body;
    const dish = await dishUseCase.createDish(
      name,
      description,
      price,
      options || []
    );
    res.status(201).json(dish.toJSON());
  }

  static async updateDish(
    req: Request<{ id: string }, {}, UpdateDishRequest>,
    res: Response<DishResponse>
  ) {
    const { id } = req.params;
    const dish = await dishUseCase.updateDish(id, req.body);
    res.json(dish.toJSON());
  }

  static async deleteDish(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    await dishUseCase.deleteDish(id);
    res.status(204).end();
  }

  static async addOptionToDish(
    req: Request<{ id: string; optionId: string }>,
    res: Response<DishResponse>
  ) {
    const { id, optionId } = req.params;
    const dish = await dishUseCase.addOptionToDish(id, optionId);
    res.json(dish.toJSON());
  }

  static async removeOptionFromDish(
    req: Request<{ id: string; optionId: string }>,
    res: Response<DishResponse>
  ) {
    const { id, optionId } = req.params;
    const dish = await dishUseCase.removeOptionFromDish(id, optionId);
    res.json(dish.toJSON());
  }
}
