export interface SelectOption {
  label: string;
  value: string;
}

export interface DishSelectOption extends SelectOption {
  extraPrice: string | null;
}
