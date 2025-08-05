import { Router } from "express";
import { DishOptionController } from "../dish-option.controller";
import { asyncHandler } from "../middleware/async-handler.middleware";
import { requestValidator } from "../middleware/request-validator.middleware";
import { 
  createDishOptionValidator, 
  updateDishOptionValidator, 
  dishOptionIdValidator 
} from "../dto/dish-option.dto";

export const dishOptionRouter = Router();

// Get all dish options
dishOptionRouter.get(
  "/dish-options",
  asyncHandler(DishOptionController.getDishOptions)
);

// Get dish option by ID
dishOptionRouter.get(
  "/dish-options/:id",
  dishOptionIdValidator,
  requestValidator,
  asyncHandler(DishOptionController.getDishOptionById)
);

// Create dish option
dishOptionRouter.post(
  "/dish-options",
  createDishOptionValidator,
  requestValidator,
  asyncHandler(DishOptionController.createDishOption)
);

// Update dish option
dishOptionRouter.put(
  "/dish-options/:id",
  updateDishOptionValidator,
  requestValidator,
  asyncHandler(DishOptionController.updateDishOption)
);

// Delete dish option
dishOptionRouter.delete(
  "/dish-options/:id",
  dishOptionIdValidator,
  requestValidator,
  asyncHandler(DishOptionController.deleteDishOption)
);