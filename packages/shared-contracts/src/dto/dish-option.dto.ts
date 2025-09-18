import { SelectOptionWithPrice } from "../types/selection-option.types";

// Pure DTO interfaces - no domain entity imports
export interface DishOptionResponseDTO {
  id: string;
  name: string;
  description: string;
  isAllowMultipleSelection: boolean;
  maxSelectionCount: number;
  optionItems: SelectOptionWithPrice[];
}

export interface CreateDishOptionRequestDTO {
  name: string;
  description: string;
  optionItems: SelectOptionWithPrice[];
  isAllowMultipleSelection: boolean;
  maxSelectionCount: number;
}

export interface UpdateDishOptionRequestDTO {
  name?: string;
  description?: string;
  optionItems?: SelectOptionWithPrice[];
  isAllowMultipleSelection?: boolean;
  maxSelectionCount?: number;
}

export interface DishOptionOperationResponseDTO {
  success: boolean;
  message: string;
}
