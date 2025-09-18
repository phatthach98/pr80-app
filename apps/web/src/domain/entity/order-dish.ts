import { OrderDishItemResponseDTO, OrderItemRequestDTO } from '@pr80-app/shared-contracts';
import { Dish } from './dish';
import { formatCurrency } from '@/utils/currency';
import { OrderDishOption } from './order-dish-option';

/**
 * OrderDish entity representing a dish in an order
 * This extends the base Dish entity with order-specific properties
 */
export class OrderDish {
  private constructor(
    public readonly id: string,
    public readonly dishId: string,
    public readonly name: string,
    public readonly basePrice: string,
    public readonly priceIncludingSelectedOption: string,
    public readonly totalPrice: string,
    public readonly selectedOptions: readonly OrderDishOption[],
    public readonly quantity: number,
    public readonly takeAway: boolean,
  ) {
    Object.freeze(this.selectedOptions);
    Object.freeze(this);
  }

  /**
   * Create an OrderDish from a base Dish and order-specific properties
   */
  static fromDishAndOrderDishOption(
    dish: Dish,
    orderDishOption: OrderDishOption[],
    quantity: number,
    takeAway: boolean,
  ): OrderDish {
    const basePrice = dish.basePrice;
    const selectedOptions = orderDishOption || [];
    return new OrderDish(
      '',
      dish.id,
      dish.name,
      basePrice,
      '',
      '',
      selectedOptions,
      quantity,
      takeAway,
    );
  }

  calculatePriceWithSelectedOption(
    dishBasePrice: string,
    selectedOptions: readonly OrderDishOption[],
  ): string {
    return (
      parseFloat(dishBasePrice) +
      selectedOptions.reduce((acc, option) => acc + option.getParsedExtraPrice(), 0)
    ).toFixed(6);
  }

  calculateTotalPrice(
    dishBasePrice: string,
    selectedOptions: readonly OrderDishOption[],
    quantity: number,
  ): string {
    return (
      (parseFloat(dishBasePrice) +
        selectedOptions.reduce((acc, option) => acc + option.getParsedExtraPrice(), 0)) *
      quantity
    ).toFixed(6);
  }

  /**
   * Create an OrderDish from an OrderDishItemResponseDTO
   */
  static fromResponseDTO(dto: OrderDishItemResponseDTO): OrderDish {
    // Convert DTO options to OrderDishOption entities
    const selectedOptions = OrderDishOption.fromResponseDTOList(dto.selectedOptions);

    return new OrderDish(
      dto.id,
      dto.dishId,
      dto.name,
      dto.basePrice,
      dto.priceIncludingSelectedOption,
      dto.totalPrice,
      selectedOptions,
      dto.quantity,
      dto.takeAway,
    );
  }

  /**
   * Convert to OrderItemRequestDTO for API create/update requests
   */
  toCreateRequestDTO(): OrderItemRequestDTO {
    return {
      dishId: this.dishId,
      quantity: this.quantity,
      selectedOptions: this.selectedOptions.map((opt) => opt.toRequestDTO()),
      takeAway: this.takeAway,
    };
  }

  /**
   * Create a new OrderDish with updated quantity
   */
  withQuantity(quantity: number): OrderDish {
    if (this.quantity === quantity) return this;

    const totalPrice = this.calculateTotalPrice(this.basePrice, this.selectedOptions, quantity);

    return new OrderDish(
      this.id,
      this.dishId,
      this.name,
      this.basePrice,
      this.priceIncludingSelectedOption,
      totalPrice,
      this.selectedOptions,
      quantity,
      this.takeAway,
    );
  }

  /**
   * Create a new OrderDish with updated takeAway status
   */
  withTakeAway(takeAway: boolean): OrderDish {
    if (this.takeAway === takeAway) return this;

    return new OrderDish(
      this.id,
      this.dishId,
      this.name,
      this.basePrice,
      this.priceIncludingSelectedOption,
      this.totalPrice,
      this.selectedOptions,
      this.quantity,
      takeAway,
    );
  }

  /**
   * Create a new OrderDish with updated options
   */
  withSelectedOptions(selectedOptions: readonly OrderDishOption[]): OrderDish {
    const totalPrice = this.calculateTotalPrice(this.basePrice, selectedOptions, this.quantity);

    return new OrderDish(
      this.id,
      this.dishId,
      this.name,
      this.basePrice,
      this.priceIncludingSelectedOption,
      totalPrice,
      selectedOptions,
      this.quantity,
      this.takeAway,
    );
  }

  /**
   * Toggle takeAway status
   */
  toggleTakeAway(): OrderDish {
    return this.withTakeAway(!this.takeAway);
  }

  getParsedTotalPrice(): number {
    const draftTotalPrice = this.calculateTotalPrice(
      this.basePrice,
      this.selectedOptions,
      this.quantity,
    );
    return !!this.totalPrice ? Number(this.totalPrice) : Number(draftTotalPrice);
  }

  getFormattedBasePrice(): string {
    return formatCurrency(this.basePrice);
  }

  /**
   * Get the display price - this is just for UI display and does not calculate
   * actual prices which are handled by the backend
   */
  getFormattedTotalPrice(): string {
    const draftTotalPrice = this.calculateTotalPrice(
      this.basePrice,
      this.selectedOptions,
      this.quantity,
    );
    return !!this.totalPrice ? formatCurrency(this.totalPrice) : formatCurrency(draftTotalPrice);
  }

  getFormattedPriceWithSelectedOption(): string {
    const draftPriceWithSelectedOption = this.calculatePriceWithSelectedOption(
      this.basePrice,
      this.selectedOptions,
    );
    return !!this.priceIncludingSelectedOption
      ? formatCurrency(this.priceIncludingSelectedOption)
      : formatCurrency(draftPriceWithSelectedOption);
  }

  getDishOptionNameGroupById(): Record<string, { dishOptionName: string; itemLabel: string }[]> {
    const dishOptionNameGroupById = this.selectedOptions.reduce(
      (acc: Record<string, { dishOptionName: string; itemLabel: string }[]>, option) => {
        acc[option.dishOptionId] = [
          ...(acc[option.dishOptionId] || []),
          { dishOptionName: option.dishOptionName, itemLabel: option.itemLabel },
        ];
        return acc;
      },
      {},
    );
    return dishOptionNameGroupById;
  }

  equals(other: OrderDish): boolean {
    return (
      this.dishId === other.dishId &&
      this.takeAway === other.takeAway &&
      this.selectedOptions.length === other.selectedOptions.length &&
      this.selectedOptions.every((selectedOption) =>
        other.selectedOptions.some((otherSelectedOption) =>
          selectedOption.equals(otherSelectedOption),
        ),
      )
    );
  }
}
