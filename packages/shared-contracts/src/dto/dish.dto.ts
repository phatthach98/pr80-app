import { DishOptionResponseDTO } from "./dish-option.dto";

// Pure DTO interfaces - no domain entity imports

export interface DishResponseDTO {
  id: string;
  name: string;
  description: string;
  basePrice: string;
  options: { id: string }[];
}

export interface DishWithOptionsResponseDTO extends DishResponseDTO {
  optionDetails: DishOptionResponseDTO[];
}

export interface CreateDishRequestDTO {
  name: string;
  description: string;
  basePrice: string;
  options?: { id: string }[];
}

export interface UpdateDishRequestDTO {
  name?: string;
  description?: string;
  basePrice?: string;
  options?: { id: string }[];
}
