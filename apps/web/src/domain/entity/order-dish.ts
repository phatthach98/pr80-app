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
    public readonly totalPrice: string,
    public readonly options: readonly OrderDishOption[],
    public readonly quantity: number,
    public readonly takeAway: boolean,
  ) {
    Object.freeze(this.options);
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
    const options = orderDishOption || [];
    return new OrderDish('', dish.id, dish.name, basePrice, '', options, quantity, takeAway);
  }

  calculatePriceWithSelectedOption(
    dishBasePrice: string,
    options: readonly OrderDishOption[],
  ): string {
    return (
      parseFloat(dishBasePrice) +
      options.reduce((acc, option) => acc + option.getParsedExtraPrice(), 0)
    ).toFixed(6);
  }

  calculateTotalPrice(
    dishBasePrice: string,
    options: readonly OrderDishOption[],
    quantity: number,
  ): string {
    return (
      (parseFloat(dishBasePrice) +
        options.reduce((acc, option) => acc + option.getParsedExtraPrice(), 0)) *
      quantity
    ).toFixed(6);
  }

  /**
   * Create an OrderDish from an OrderDishItemResponseDTO
   */
  static fromResponseDTO(dto: OrderDishItemResponseDTO): OrderDish {
    // Convert DTO options to OrderDishOption entities
    const orderOptions = OrderDishOption.fromResponseDTOList(dto.selectedOptions);

    return new OrderDish(
      dto.id,
      dto.dishId,
      dto.name,
      dto.basePrice,
      dto.totalPrice,
      orderOptions,
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
      selectedOptions: this.options.map((opt) => opt.toRequestDTO()),
      takeAway: this.takeAway,
    };
  }

  /**
   * Create a new OrderDish with updated quantity
   */
  withQuantity(quantity: number): OrderDish {
    if (this.quantity === quantity) return this;

    const totalPrice = this.calculateTotalPrice(this.basePrice, this.options, quantity);

    return new OrderDish(
      this.id,
      this.dishId,
      this.name,
      this.basePrice,
      totalPrice,
      this.options,
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
      this.totalPrice,
      this.options,
      this.quantity,
      takeAway,
    );
  }

  /**
   * Create a new OrderDish with updated options
   */
  withOptions(options: readonly OrderDishOption[]): OrderDish {
    const totalPrice = this.calculateTotalPrice(this.basePrice, options, this.quantity);

    return new OrderDish(
      this.id,
      this.dishId,
      this.name,
      this.basePrice,
      totalPrice,
      options,
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
    const draftTotalPrice = this.calculateTotalPrice(this.basePrice, this.options, this.quantity);
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
    const draftTotalPrice = this.calculateTotalPrice(this.basePrice, this.options, this.quantity);
    return !!this.totalPrice ? formatCurrency(this.totalPrice) : formatCurrency(draftTotalPrice);
  }

  getFormattedPriceWithSelectedOption(): string {
    const draftPriceWithSelectedOption = this.calculatePriceWithSelectedOption(
      this.basePrice,
      this.options,
    );
    return formatCurrency(draftPriceWithSelectedOption);
  }
}
