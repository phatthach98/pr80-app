import { SelectOption } from "../types/selection-option.types";

// Settings Response DTOs
export interface getSettingOptionsResponseDTO {
  tables: SelectOption[];
  orderStatuses: SelectOption[];
}

export interface getSettingConfigResponseDTO {
  [key: string]: any;
}

export interface postSettingConfigResponseDTO {
  message: string;
}

export interface postSettingOptionsResponseDTO {
  message: string;
}

// Settings Request DTOs
export interface postSettingConfigRequestDTO {
  key: string;
  data: any;
}

export interface postSettingOptionsRequestDTO {
  options: SelectOption[];
}
