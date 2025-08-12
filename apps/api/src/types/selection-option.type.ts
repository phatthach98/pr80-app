export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectOptionWithPrice extends SelectOption {
  extraPrice: string;
}
