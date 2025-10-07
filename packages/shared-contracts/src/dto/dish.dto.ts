import { SelectOptionWithPrice } from "../types/selection-option.types";
import { DishOptionResponseDTO } from "./dish-option.dto";

// Pure DTO interfaces - no domain entity imports

export interface DishOptionWithMetadataResponseDTO {
  id: string;
  maxSelectionCount: number;
  defaultOptionValues: string[];
}

export interface DetailDishOptionsResponseWithMetadataDTO {
  id: string;
  name: string;
  description: string;
  maxSelectionCount: number;
  defaultOptionValues: string[];
  optionItems: SelectOptionWithPrice[];
}

export interface GetDishResponseDTO {
  id: string;
  name: string;
  description: string;
  basePrice: string;
  options: DetailDishOptionsResponseWithMetadataDTO[];
}

export interface MutationDishResponseDTO {
  id: string;
  name: string;
  description: string;
  basePrice: string;
  options: DishOptionWithMetadataResponseDTO[];
}

export interface CreateDishRequestDTO {
  name: string;
  description: string;
  basePrice: string;
  options?: DishOptionWithMetadataResponseDTO[];
}

export interface UpdateDishRequestDTO {
  name?: string;
  description?: string;
  basePrice?: string;
  options?: DishOptionWithMetadataResponseDTO[];
}

export interface AddOptionToDishRequestDTO {
  maxSelectionCount: number;
  defaultOptionValues: string[];
}
