import { GetDishResponseDTO } from '@pr80-app/shared-contracts';
import { DishOption } from './dish-option';
import { formatCurrency } from '@/utils/currency';

export class Dish {
  private constructor(
    public id: string,
    public name: string,
    public description: string,
    public basePrice: string,
    public options: DishOption[],
  ) {
    // Freeze arrays and object for immutability enforcement
    Object.freeze(this.options);
    Object.freeze(this);
  }

  // ✅ Base Function 1: Response mapping
  static fromResponseDTO(dto: GetDishResponseDTO): Dish {
    return new Dish(
      dto.id,
      dto.name,
      dto.description,
      dto.basePrice,
      dto.options.map((option) => DishOption.fromResponseDTO(option)),
    );
  }

  static fromResponseDTOList(dtos: GetDishResponseDTO[]): Dish[] {
    return dtos.map((dto) => this.fromResponseDTO(dto));
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
      errors.push(`Option ${index + 1} (${option.name}) is invalid`);
    });

    return { isValid: errors.length === 0, errors };
  }

  hasOptions(): boolean {
    return this.options.length > 0;
  }

  getBasePrice(): number {
    return parseFloat(this.basePrice) || 0;
  }

  getOptionCount(): number {
    return this.options.length;
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

  getFormattedBasePrice(): string {
    return formatCurrency(this.basePrice);
  }
}
