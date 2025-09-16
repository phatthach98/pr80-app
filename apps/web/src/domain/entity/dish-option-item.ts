import { formatCurrency } from '@/utils/currency';
import { SelectOptionWithPrice } from '@pr80-app/shared-contracts';

/**
 * DishOptionItem entity representing a single option item within a dish option
 */
export class DishOptionItem {
  private constructor(
    public readonly label: string,
    public readonly value: string,
    public readonly extraPrice: string,
  ) {
    Object.freeze(this);
  }

  /**
   * Create a DishOptionItem from a SelectOptionWithPrice
   */
  static fromSelectOptionWithPrice(option: SelectOptionWithPrice): DishOptionItem {
    return new DishOptionItem(option.label, option.value, option.extraPrice);
  }

  /**
   * Create a list of DishOptionItems from a list of SelectOptionWithPrice
   */
  static fromSelectOptionWithPriceList(options: SelectOptionWithPrice[]): DishOptionItem[] {
    return options.map(DishOptionItem.fromSelectOptionWithPrice);
  }

  /**
   * Convert to SelectOptionWithPrice for API requests
   */
  toSelectOptionWithPrice(): SelectOptionWithPrice {
    return {
      label: this.label,
      value: this.value,
      extraPrice: this.extraPrice,
    };
  }

  /**
   * Validate the option item
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.label?.trim() || !this.value?.trim()) {
      errors.push('Option is invalid - missing label or value');
    }

    const extraPrice = parseFloat(this.extraPrice);
    if (isNaN(extraPrice) || extraPrice < 0) {
      errors.push('Option has invalid price');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Get formatted extra price with currency symbol
   */
  getFormattedExtraPrice(): string {
    return formatCurrency(this.extraPrice);
  }

  /**
   * Get display text for the option item
   */
  getDisplayText(): string {
    const price = parseFloat(this.extraPrice || '0');
    return price === 0 ? this.label : `${this.label} (+${this.getFormattedExtraPrice()})`;
  }

  /**
   * Create a new DishOptionItem with updated label
   */
  withLabel(newLabel: string): DishOptionItem {
    if (this.label === newLabel) return this;
    return new DishOptionItem(newLabel, this.value, this.extraPrice);
  }

  /**
   * Create a new DishOptionItem with updated value
   */
  withValue(newValue: string): DishOptionItem {
    if (this.value === newValue) return this;
    return new DishOptionItem(this.label, newValue, this.extraPrice);
  }

  /**
   * Create a new DishOptionItem with updated extra price
   */
  withExtraPrice(newExtraPrice: string): DishOptionItem {
    if (this.extraPrice === newExtraPrice) return this;
    return new DishOptionItem(this.label, this.value, newExtraPrice);
  }

  /**
   * Check if this option item equals another
   */
  equals(other: DishOptionItem): boolean {
    return (
      this.label === other.label &&
      this.value === other.value &&
      this.extraPrice === other.extraPrice
    );
  }

  getParsedExtraPrice(): number {
    return Number(this.extraPrice);
  }
}
