import {
  DishOptionResponseDTO,
  CreateDishOptionRequestDTO,
  UpdateDishOptionRequestDTO,
  SelectOptionWithPrice,
  OrderDishItemOptionResponseDTO,
} from '@pr80-app/shared-contracts';

export class DishOption {
  private _isValid?: boolean; // Validation cache

  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly options: readonly SelectOptionWithPrice[],
  ) {
    // Freeze arrays and object for immutability enforcement
    Object.freeze(this.options);
    Object.freeze(this);
  }

  // ✅ Base Function 1: Response mapping
  static fromResponseDTO(dto: DishOptionResponseDTO): DishOption {
    const options = dto.optionItems || [];

    return new DishOption(dto.id, dto.name, dto.description, options);
  }

  static fromResponseDTOList(dtos: DishOptionResponseDTO[]): DishOption[] {
    return dtos.map((dto) => this.fromResponseDTO(dto));
  }

  // ✅ Base Function 2: CRUD request mapping
  toCreateRequestDTO(): CreateDishOptionRequestDTO {
    return {
      name: this.name,
      description: this.description,
      optionItems: [...this.options],
    };
  }

  toUpdateRequestDTO(): UpdateDishOptionRequestDTO {
    return {
      name: this.name,
      description: this.description,
      optionItems: [...this.options],
    };
  }

  // ✅ Base Function 3: Validation
  isValid(): boolean {
    if (this._isValid === undefined) {
      this._isValid = this.validateForUpdate().isValid;
    }
    return this._isValid;
  }

  validateForCreate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.name?.trim()) errors.push('Name is required');
    if (!this.description?.trim()) errors.push('Description is required');
    if (!this.options || this.options.length === 0) errors.push('At least one option is required');

    // Validate each option
    this.options.forEach((option, index) => {
      if (!option.label?.trim() || !option.value?.trim()) {
        errors.push(`Option ${index + 1} is invalid - missing label or value`);
      }
      const extraPrice = parseFloat(option.extraPrice);
      if (isNaN(extraPrice) || extraPrice < 0) {
        errors.push(`Option ${index + 1} has invalid price`);
      }
    });

    return { isValid: errors.length === 0, errors };
  }

  validateForUpdate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.name?.trim()) errors.push('Name is required');
    if (!this.description?.trim()) errors.push('Description is required');
    if (!this.options || this.options.length === 0) errors.push('At least one option is required');

    // Validate each option
    this.options.forEach((option, index) => {
      if (!option.label?.trim() || !option.value?.trim()) {
        errors.push(`Option ${index + 1} is invalid - missing label or value`);
      }
      const extraPrice = parseFloat(option.extraPrice);
      if (isNaN(extraPrice) || extraPrice < 0) {
        errors.push(`Option ${index + 1} has invalid price`);
      }
    });

    return { isValid: errors.length === 0, errors };
  }

  // ✅ Base Function 4: Essential business logic
  canBeModified(): boolean {
    // Dish options can generally be modified unless they're being used in active orders
    // This could be extended with more complex business rules
    return true;
  }

  hasOption(optionValue: string): boolean {
    return this.options.some((option) => option.value === optionValue);
  }

  getOptionByValue(optionValue: string): SelectOptionWithPrice | undefined {
    return this.options.find((option) => option.value === optionValue);
  }

  // ✅ Base Function 5: Basic getters
  getOptionCount(): number {
    return this.options.length;
  }

  // Simple display formatting for UI (no calculations)
  getOptionDisplayText(optionValue: string): string {
    const option = this.getOptionByValue(optionValue);
    if (!option) return '';

    const price = parseFloat(option.extraPrice || '0');
    return price === 0 ? option.label : `${option.label} (+$${price.toFixed(2)})`;
  }

  // ✅ Base Function 6: Immutable operations
  withName(newName: string): DishOption {
    if (this.name === newName) return this;

    return new DishOption(this.id, newName, this.description, this.options);
  }

  withDescription(newDescription: string): DishOption {
    if (this.description === newDescription) return this;

    return new DishOption(this.id, this.name, newDescription, this.options);
  }

  withOptions(newOptions: readonly SelectOptionWithPrice[]): DishOption {
    // Check if options actually changed by comparing values and prices
    if (this.options.length === newOptions.length) {
      const allSame = this.options.every((option, index) => {
        const newOption = newOptions[index];
        return (
          option.value === newOption.value &&
          option.label === newOption.label &&
          option.extraPrice === newOption.extraPrice
        );
      });

      if (allSame) return this;
    }

    return new DishOption(this.id, this.name, this.description, newOptions);
  }

  addOption(newOption: SelectOptionWithPrice): DishOption {
    // Check if option already exists
    if (this.hasOption(newOption.value)) return this;

    return new DishOption(this.id, this.name, this.description, [...this.options, newOption]);
  }

  removeOption(optionValue: string): DishOption {
    const filteredOptions = this.options.filter((option) => option.value !== optionValue);

    // Return same instance if no change
    if (filteredOptions.length === this.options.length) return this;

    return new DishOption(this.id, this.name, this.description, filteredOptions);
  }

  // Efficient bulk update method
  withChanges(changes: Partial<Pick<DishOption, 'name' | 'description' | 'options'>>): DishOption {
    // Check if any values actually changed
    const hasChanges = Object.entries(changes).some(([key, value]) => {
      if (key === 'options') {
        const newOptions = value as readonly SelectOptionWithPrice[];
        return !this.withOptions(newOptions).equals(this);
      }
      return this[key as keyof typeof changes] !== value;
    });

    if (!hasChanges) return this;

    return new DishOption(
      this.id,
      changes.name ?? this.name,
      changes.description ?? this.description,
      changes.options ?? this.options,
    );
  }

  // Helper method for comparing instances
  equals(other: DishOption): boolean {
    return (
      this.id === other.id &&
      this.name === other.name &&
      this.description === other.description &&
      this.options.length === other.options.length &&
      this.options.every((option, index) => {
        const otherOption = other.options[index];
        return (
          option.value === otherOption.value &&
          option.label === otherOption.label &&
          option.extraPrice === otherOption.extraPrice
        );
      })
    );
  }
}
