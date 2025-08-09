export interface SelectOption {
  label: string;
  value: string;
}

// For database/internal use (number)
export interface DishSelectOption extends SelectOption {
  extraPrice: number;
}
