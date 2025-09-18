import { DishOptionResponseDTO } from "./dish-option.dto";

// Pure DTO interfaces - no domain entity imports

export interface DishOptionWithMetadataResponseDTO {
  id: string;
  maxSelectionCount: number;
}

export interface GetDishResponseDTO {
  id: string;
  name: string;
  description: string;
  basePrice: string;
  options: DishOptionResponseDTO[];
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
