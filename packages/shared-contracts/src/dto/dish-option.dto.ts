import { SelectOptionWithPrice } from "../types/selection-option.types";

// Pure DTO interfaces - no domain entity imports
export interface DishOptionResponseDTO {
  id: string;
  name: string;
  description: string;
  optionItems: SelectOptionWithPrice[];
}

export interface CreateDishOptionRequestDTO {
  name: string;
  description: string;
  defaultOptionValues: string[];
  optionItems: SelectOptionWithPrice[];
}

export interface UpdateDishOptionRequestDTO {
  name?: string;
  description?: string;
  optionItems?: SelectOptionWithPrice[];
}

export interface DishOptionOperationResponseDTO {
  success: boolean;
  message: string;
}
