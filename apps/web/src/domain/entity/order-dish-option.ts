import { OrderDishItemOptionResponseDTO, SelectedOptionRequestDTO } from '@pr80-app/shared-contracts';
import { formatCurrency } from '@/utils/currency';

/**
 * OrderDishOption entity representing a selected option in an order dish
 * This is different from DishOption as it represents a specific selected option
 * rather than a group of possible options
 */
export class OrderDishOption {
  private constructor(
    public readonly dishOptionId: string,
    public readonly dishOptionName: string,
    public readonly itemValue: string,
    public readonly itemLabel: string,
    public readonly extraPrice: string,
  ) {
    Object.freeze(this);
  }

  /**
   * Create an OrderDishOption from an OrderDishItemOptionResponseDTO
   */
  static fromResponseDTO(dto: OrderDishItemOptionResponseDTO): OrderDishOption {
    return new OrderDishOption(
      dto.dishOptionId,
      dto.dishOptionName,
      dto.itemValue,
      dto.itemLabel,
      dto.extraPrice,
    );
  }

  /**
   * Create a list of OrderDishOptions from a list of OrderDishItemOptionResponseDTOs
   */
  static fromResponseDTOList(dtos: OrderDishItemOptionResponseDTO[]): OrderDishOption[] {
    return dtos.map(OrderDishOption.fromResponseDTO);
  }

  /**
   * Convert to SelectedOptionRequestDTO for API requests
   */
  toRequestDTO(): SelectedOptionRequestDTO {
    return {
      dishOptionId: this.dishOptionId,
      dishOptionName: this.dishOptionName,
      itemValue: this.itemValue,
      itemLabel: this.itemLabel,
    };
  }

  /**
   * Validate the option
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.dishOptionId?.trim()) {
      errors.push('Option ID is required');
    }

    if (!this.dishOptionName?.trim()) {
      errors.push('Option name is required');
    }

    if (!this.itemValue?.trim() || !this.itemLabel?.trim()) {
      errors.push('Option item value and label are required');
    }

    const extraPrice = parseFloat(this.extraPrice);
    if (isNaN(extraPrice) || extraPrice < 0) {
      errors.push('Option has invalid price');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Check if this option is valid
   */
  isValid(): boolean {
    return this.validate().isValid;
  }

  /**
   * Get formatted extra price with currency symbol
   */
  getFormattedExtraPrice(): string {
    return formatCurrency(this.extraPrice);
  }

  /**
   * Get display text for the option
   */
  getDisplayText(): string {
    const price = parseFloat(this.extraPrice || '0');
    return price === 0 ? this.itemLabel : `${this.itemLabel} (+${this.getFormattedExtraPrice()})`;
  }

  /**
   * Get the parsed extra price as a number
   */
  getParsedExtraPrice(): number {
    return Number(this.extraPrice);
  }

  /**
   * Create a new OrderDishOption with updated extra price
   */
  withExtraPrice(newExtraPrice: string): OrderDishOption {
    if (this.extraPrice === newExtraPrice) return this;
    return new OrderDishOption(
      this.dishOptionId,
      this.dishOptionName,
      this.itemValue,
      this.itemLabel,
      newExtraPrice,
    );
  }

  /**
   * Check if this option equals another
   */
  equals(other: OrderDishOption): boolean {
    return (
      this.dishOptionId === other.dishOptionId &&
      this.dishOptionName === other.dishOptionName &&
      this.itemValue === other.itemValue &&
      this.itemLabel === other.itemLabel &&
      this.extraPrice === other.extraPrice
    );
  }
}
