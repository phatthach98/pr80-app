import {
  DishOptionResponseDTO,
  CreateDishOptionRequestDTO,
  UpdateDishOptionRequestDTO,
  SelectOptionWithPrice,
  SelectedOptionRequestDTO,
} from '@pr80-app/shared-contracts';
import { DishOptionItem } from './dish-option-item';

export class DishOption {
  private _isValid?: boolean; // Validation cache

  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly items: readonly DishOptionItem[],
  ) {
    // Freeze arrays and object for immutability enforcement
    Object.freeze(this.items);
    Object.freeze(this);
  }

  // ✅ Base Function 1: Response mapping
  static fromResponseDTO(dto: DishOptionResponseDTO): DishOption {
    const optionItems = dto.optionItems || [];
    const items = DishOptionItem.fromSelectOptionWithPriceList(optionItems);

    return new DishOption(dto.id, dto.name, dto.description, items);
  }

  static fromResponseDTOList(dtos: DishOptionResponseDTO[]): DishOption[] {
    return dtos.map((dto) => this.fromResponseDTO(dto));
  }

  // ✅ Base Function 2: CRUD request mapping
  toCreateRequestDTO(): CreateDishOptionRequestDTO {
    return {
      name: this.name,
      description: this.description,
      optionItems: this.items.map(item => item.toSelectOptionWithPrice()),
    };
  }

  toUpdateRequestDTO(): UpdateDishOptionRequestDTO {
    return {
      name: this.name,
      description: this.description,
      optionItems: this.items.map(item => item.toSelectOptionWithPrice()),
    };
  }

  toSelectedOptionRequestDTO(): SelectedOptionRequestDTO {
    return {
      dishOptionId: this.id,
      dishOptionName: this.name,
      itemValue: this.items[0]?.toSelectOptionWithPrice().value || '',
      itemLabel: this.items[0]?.toSelectOptionWithPrice().label || '',
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
    if (!this.items || this.items.length === 0)
      errors.push('At least one option is required');

    // Validate each option item
    this.items.forEach((item, index) => {
      const itemValidation = item.validate();
      if (!itemValidation.isValid) {
        errors.push(...itemValidation.errors.map(error => `Option ${index + 1}: ${error}`));
      }
    });

    return { isValid: errors.length === 0, errors };
  }

  validateForUpdate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.name?.trim()) errors.push('Name is required');
    if (!this.description?.trim()) errors.push('Description is required');
    if (!this.items || this.items.length === 0)
      errors.push('At least one option is required');

    // Validate each option item
    this.items.forEach((item, index) => {
      const itemValidation = item.validate();
      if (!itemValidation.isValid) {
        errors.push(...itemValidation.errors.map(error => `Option ${index + 1}: ${error}`));
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
    return this.items.some((item) => item.value === optionValue);
  }

  getOptionByValue(optionValue: string): DishOptionItem | undefined {
    return this.items.find((item) => item.value === optionValue);
  }

  // ✅ Base Function 5: Basic getters
  getOptionCount(): number {
    return this.items.length;
  }

  // Simple display formatting for UI (no calculations)
  getOptionDisplayText(optionValue: string): string {
    const option = this.getOptionByValue(optionValue);
    if (!option) return '';
    return option.getDisplayText();
  }

  // Get the first option item (for backward compatibility)
  get dishOptionItems(): readonly SelectOptionWithPrice[] {
    return this.items.map(item => item.toSelectOptionWithPrice());
  }

  // ✅ Base Function 6: Immutable operations
  withName(newName: string): DishOption {
    if (this.name === newName) return this;
    return new DishOption(this.id, newName, this.description, this.items);
  }

  withDescription(newDescription: string): DishOption {
    if (this.description === newDescription) return this;
    return new DishOption(this.id, this.name, newDescription, this.items);
  }

  withItems(newItems: readonly DishOptionItem[]): DishOption {
    // Check if items actually changed
    if (this.items.length === newItems.length) {
      const allSame = this.items.every((item, index) => {
        return item.equals(newItems[index]);
      });

      if (allSame) return this;
    }

    return new DishOption(this.id, this.name, this.description, newItems);
  }

  withOptions(newOptions: readonly SelectOptionWithPrice[]): DishOption {
    const newItems = DishOptionItem.fromSelectOptionWithPriceList(newOptions as SelectOptionWithPrice[]);
    return this.withItems(newItems);
  }

  addItem(newItem: DishOptionItem): DishOption {
    // Check if option already exists
    if (this.hasOption(newItem.value)) return this;
    return new DishOption(this.id, this.name, this.description, [...this.items, newItem]);
  }

  addOption(newOption: SelectOptionWithPrice): DishOption {
    const newItem = DishOptionItem.fromSelectOptionWithPrice(newOption);
    return this.addItem(newItem);
  }

  removeOption(optionValue: string): DishOption {
    const filteredItems = this.items.filter((item) => item.value !== optionValue);

    // Return same instance if no change
    if (filteredItems.length === this.items.length) return this;

    return new DishOption(this.id, this.name, this.description, filteredItems);
  }

  // Efficient bulk update method
  withChanges(
    changes: Partial<Pick<DishOption, 'name' | 'description' | 'items'>>,
  ): DishOption {
    // Check if any values actually changed
    const hasChanges = Object.entries(changes).some(([key, value]) => {
      if (key === 'items') {
        const newItems = value as readonly DishOptionItem[];
        return !this.withItems(newItems).equals(this);
      }
      return this[key as keyof typeof changes] !== value;
    });

    if (!hasChanges) return this;

    return new DishOption(
      this.id,
      changes.name ?? this.name,
      changes.description ?? this.description,
      changes.items ?? this.items,
    );
  }

  // Helper method for comparing instances
  equals(other: DishOption): boolean {
    return (
      this.id === other.id &&
      this.name === other.name &&
      this.description === other.description &&
      this.items.length === other.items.length &&
      this.items.every((item, index) => {
        return item.equals(other.items[index]);
      })
    );
  }
}