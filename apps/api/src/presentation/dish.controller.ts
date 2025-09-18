import { Request, Response } from "express";
import { DishOptionUseCase, DishUseCase } from "@application/use-case";
import { DISH_OPTION_USE_CASE, DISH_USE_CASE } from "@infras/di/tokens";
import { container } from "@infras/di";
import {
  CreateDishRequestDTO,
  DishOptionResponseDTO,
  GetDishResponseDTO,
  MutationDishResponseDTO,
  UpdateDishRequestDTO,
} from "@pr80-app/shared-contracts";

const dishUseCase = container.resolve<DishUseCase>(DISH_USE_CASE);
const dishOptionUseCase =
  container.resolve<DishOptionUseCase>(DISH_OPTION_USE_CASE);

export class DishController {
  static async getDishes(req: Request, res: Response<GetDishResponseDTO[]>) {
    const [dishes, dishOptions] = await Promise.all([
      dishUseCase.getDishes(),
      dishOptionUseCase.getDishOptions(),
    ]);

    if (!dishes) {
      res.json([]);
    }

    const dishWithOptionsDetail = (dishes || [])
      .map((dish) => {
        const optionsInDish = dish.options;
        const optionsDetail = optionsInDish.map((optionInDish) => {
          const optionDetail = (dishOptions || []).find(
            (option) => option.id === optionInDish.id
          );
          if (!optionDetail) {
            return null;
          }
          return {
            ...optionDetail,
            optionItems: optionDetail.optionItems || [],
            maxSelectionCount: optionInDish.maxSelectionCount || 1,
          };
        });

        return {
          ...dish.toJSON(),
          options: optionsDetail.filter(Boolean) as DishOptionResponseDTO[],
        };
      })
      .filter(Boolean);

    res.json(dishWithOptionsDetail);
  }

  static async getDishById(
    req: Request<{ id: string }, {}, {}>,
    res: Response<GetDishResponseDTO>
  ) {
    const { id } = req.params;
    const [dish, dishOptions] = await Promise.all([
      dishUseCase.getDishById(id),
      dishOptionUseCase.getDishOptions(),
    ]);
    const optionsInDish = dish.options;
    const optionsDetail = optionsInDish.filter(Boolean).map((optionInDish) => {
      const optionDetail = (dishOptions || []).find(
        (option) => option.id === optionInDish.id
      );
      if (!optionDetail) {
        return null;
      }

      return {
        ...optionDetail.toJSON(),
        optionItems: optionDetail.optionItems || [],
        maxSelectionCount: optionInDish.maxSelectionCount || 1,
      };
    });

    const dishWithOptionsDetail = {
      ...dish.toJSON(),
      options: optionsDetail,
    } as GetDishResponseDTO;

    res.json(dishWithOptionsDetail);
  }

  static async createDish(
    req: Request<{}, {}, CreateDishRequestDTO>,
    res: Response<MutationDishResponseDTO>
  ) {
    const { name, description, basePrice, options } = req.body;
    const dish = await dishUseCase.createDish(
      name,
      description,
      basePrice,
      options || []
    );
    res.status(201).json(dish.toJSON());
  }

  static async updateDish(
    req: Request<{ id: string }, {}, UpdateDishRequestDTO>,
    res: Response<MutationDishResponseDTO>
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
    req: Request<{ id: string; optionId: string; maxSelectionCount: number }>,
    res: Response<MutationDishResponseDTO>
  ) {
    const { id, optionId, maxSelectionCount } = req.params;
    const dish = await dishUseCase.addOptionToDish(
      id,
      optionId,
      maxSelectionCount
    );
    res.json(dish.toJSON());
  }

  static async removeOptionFromDish(
    req: Request<{ id: string; optionId: string }>,
    res: Response<MutationDishResponseDTO>
  ) {
    const { id, optionId } = req.params;
    const dish = await dishUseCase.removeOptionFromDish(id, optionId);
    res.json(dish.toJSON());
  }
}
