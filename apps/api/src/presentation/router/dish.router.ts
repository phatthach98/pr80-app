import { Router } from "express";
import { asyncHandler } from "@presentation/middleware/async-handler.middleware";
import { DishController } from "@presentation/dish.controller";
import { createDishValidator, updateDishValidator } from "@presentation/dto/dish.dto";
import { requestValidator } from "@presentation/middleware/request-validator.middleware";

export const dishRouter = Router();

// Get all dishes
dishRouter.get(
  "/dishes",
  asyncHandler(DishController.getDishes)
);

// Get dish by ID
dishRouter.get(
  "/dishes/:id",
  asyncHandler(DishController.getDishById)
);

// Create dish
dishRouter.post(
  "/dishes",
  createDishValidator,
  requestValidator,
  asyncHandler(DishController.createDish)
);

// Update dish
dishRouter.put(
  "/dishes/:id",
  updateDishValidator,
  requestValidator,
  asyncHandler(DishController.updateDish)
);

// Delete dish
dishRouter.delete(
  "/dishes/:id",
  asyncHandler(DishController.deleteDish)
);

// Add option to dish
dishRouter.post(
  "/dishes/:id/options/:optionId",
  asyncHandler(DishController.addOptionToDish)
);

// Remove option from dish
dishRouter.delete(
  "/dishes/:id/options/:optionId",
  asyncHandler(DishController.removeOptionFromDish)
);

