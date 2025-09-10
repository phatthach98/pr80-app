import {
  DishResponseDTO,
  DishWithOptionsResponseDTO,
  CreateDishRequestDTO,
  UpdateDishRequestDTO,
} from '@pr80-app/shared-contracts';
import { DishOption } from './dish-option';

export class Dish {
  private _isValid?: boolean; // Validation cache
  private _basePrice?: number; // Cached parsed price

  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly basePrice: string,
    public readonly options: readonly DishOption[],
  ) {
    // Freeze arrays and object for immutability enforcement
    Object.freeze(this.options);
    Object.freeze(this);
  }

  // ✅ Base Function 1: Response mapping
  static fromResponseDTO(dto: DishResponseDTO): Dish {
    return new Dish(
      dto.id,
      dto.name,
      dto.description,
      dto.basePrice,
      [], // Basic DTO doesn't include option details
    );
  }

  static fromDetailedResponseDTO(dto: DishWithOptionsResponseDTO): Dish {
    const options =
      dto.optionDetails?.map((optionDto) => DishOption.fromResponseDTO(optionDto)) || [];

    return new Dish(dto.id, dto.name, dto.description, dto.basePrice, options);
  }

  static fromResponseDTOList(dtos: DishResponseDTO[]): Dish[] {
    return dtos.map((dto) => this.fromResponseDTO(dto));
  }

  static fromDetailedResponseDTOList(dtos: DishWithOptionsResponseDTO[]): Dish[] {
    return dtos.map((dto) => this.fromDetailedResponseDTO(dto));
  }

  // ✅ Base Function 2: CRUD request mapping
  toCreateRequestDTO(): CreateDishRequestDTO {
    return {
      name: this.name,
      description: this.description,
      basePrice: this.basePrice,
      options: this.options.map((option) => ({ id: option.id })),
    };
  }

  toUpdateRequestDTO(): UpdateDishRequestDTO {
    return {
      name: this.name,
      description: this.description,
      basePrice: this.basePrice,
      options: this.options.map((option) => ({ id: option.id })),
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
    if (!this.basePrice?.trim()) errors.push('Base price is required');

    const numericPrice = this.getBasePrice();
    if (isNaN(numericPrice) || numericPrice < 0) {
      errors.push('Base price must be a valid positive number');
    }

    // Validate each option
    this.options.forEach((option, index) => {
      if (!option.isValid()) {
        errors.push(`Option ${index + 1} (${option.name}) is invalid`);
      }
    });

    return { isValid: errors.length === 0, errors };
  }

  validateForUpdate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.name?.trim()) errors.push('Name is required');
    if (!this.description?.trim()) errors.push('Description is required');
    if (!this.basePrice?.trim()) errors.push('Base price is required');

    const numericPrice = this.getBasePrice();
    if (isNaN(numericPrice) || numericPrice < 0) {
      errors.push('Base price must be a valid positive number');
    }

    // Validate each option
    this.options.forEach((option, index) => {
      if (!option.isValid()) {
        errors.push(`Option ${index + 1} (${option.name}) is invalid`);
      }
    });

    return { isValid: errors.length === 0, errors };
  }

  // ✅ Base Function 4: Essential business logic
  canBeModified(): boolean {
    // Dishes can generally be modified unless they're in active orders
    // This could be extended with more complex business rules
    return true;
  }

  hasOptions(): boolean {
    return this.options.length > 0;
  }

  getOptionById(optionId: string): DishOption | undefined {
    return this.options.find((option) => option.id === optionId);
  }

  // ✅ Base Function 5: Basic getters with caching
  getBasePrice(): number {
    if (this._basePrice === undefined) {
      this._basePrice = parseFloat(this.basePrice) || 0;
    }
    return this._basePrice;
  }

  getOptionCount(): number {
    return this.options.length;
  }

  getTotalOptionsCount(): number {
    return this.options.reduce((sum, option) => sum + option.getOptionCount(), 0);
  }

  // Simple price display formatting (no calculations)
  getFormattedBasePrice(): string {
    return `$${this.getBasePrice().toFixed(2)}`;
  }

  // Format any calculated price received from API
  formatPrice(calculatedPrice: number): string {
    return `$${calculatedPrice.toFixed(2)}`;
  }

  // ✅ Base Function 6: Immutable operations
  withName(newName: string): Dish {
    if (this.name === newName) return this;

    return new Dish(this.id, newName, this.description, this.basePrice, this.options);
  }

  withDescription(newDescription: string): Dish {
    if (this.description === newDescription) return this;

    return new Dish(this.id, this.name, newDescription, this.basePrice, this.options);
  }

  withOptions(newOptions: readonly DishOption[]): Dish {
    // Check if options actually changed by comparing IDs
    if (this.options.length === newOptions.length) {
      const allSame = this.options.every((option, index) => {
        return option.id === newOptions[index]?.id;
      });

      if (allSame) return this;
    }

    return new Dish(this.id, this.name, this.description, this.basePrice, newOptions);
  }

  addOption(newOption: DishOption): Dish {
    // Check if option already exists
    if (this.options.some((option) => option.id === newOption.id)) return this;

    return new Dish(this.id, this.name, this.description, this.basePrice, [
      ...this.options,
      newOption,
    ]);
  }

  removeOption(optionId: string): Dish {
    const filteredOptions = this.options.filter((option) => option.id !== optionId);

    // Return same instance if no change
    if (filteredOptions.length === this.options.length) return this;

    return new Dish(this.id, this.name, this.description, this.basePrice, filteredOptions);
  }

  // Efficient bulk update method
  withChanges(
    changes: Partial<Pick<Dish, 'name' | 'description' | 'basePrice' | 'options'>>,
  ): Dish {
    // Check if any values actually changed
    const hasChanges = Object.entries(changes).some(([key, value]) => {
      if (key === 'options') {
        const newOptions = value as readonly DishOption[];
        return !this.withOptions(newOptions).equals(this);
      }
      return this[key as keyof typeof changes] !== value;
    });

    if (!hasChanges) return this;

    return new Dish(
      this.id,
      changes.name ?? this.name,
      changes.description ?? this.description,
      changes.basePrice ?? this.basePrice,
      changes.options ?? this.options,
    );
  }

  // Helper method for comparing instances
  equals(other: Dish): boolean {
    return (
      this.id === other.id &&
      this.name === other.name &&
      this.description === other.description &&
      this.basePrice === other.basePrice &&
      this.options.length === other.options.length &&
      this.options.every((option, index) => option.equals(other.options[index]))
    );
  }

  // For menu display and searching
  getSearchText(): string {
    return `${this.name} ${this.description}`.toLowerCase();
  }

  matchesSearch(searchTerm: string): boolean {
    return this.getSearchText().includes(searchTerm.toLowerCase());
  }
}
