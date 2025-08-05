export interface SelectOption {
  label: string;
  value: string;
}

// For database/internal use (number)
export interface DishSelectOption extends SelectOption {
  extraPrice: number;
}

// For API responses (string with 2 decimal places)
export interface DishSelectOptionResponse extends SelectOption {
  extraPrice: string;
}
