import { OrderDishItemResponseDTO, OrderItemRequestDTO } from '@pr80-app/shared-contracts';
import { DishOption } from './dish-option';
import { Dish } from './dish';

/**
 * OrderDish entity representing a dish in an order
 * This extends the base Dish entity with order-specific properties
 */
export class OrderDish {
  private constructor(
    public readonly id: string,
    public readonly dishId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly totalPrice: string,
    public readonly options: readonly DishOption[],
    public readonly quantity: number,
    public readonly takeAway: boolean,
  ) {
    // Freeze arrays and object for immutability enforcement
    Object.freeze(this.options);
    Object.freeze(this);
  }

  /**
   * Create an OrderDish from a base Dish and order-specific properties
   */
  static fromDish(
    dish: Dish,
    props: {
      quantity: number;
      takeAway: boolean;
      options?: readonly DishOption[];
    },
  ): OrderDish {
    return new OrderDish(
      '',
      dish.id,
      dish.name,
      dish.description,
      dish.basePrice,
      props.options || dish.options,
      props.quantity,
      props.takeAway,
    );
  }

  /**
   * Create an OrderDish from an OrderDishItemResponseDTO
   */
  static fromResponseDTO(dto: OrderDishItemResponseDTO): OrderDish {
    // Convert DTO options to DishOption entities
    const dishOptions = dto.selectedOptions.map((optDto) =>
      DishOption.fromResponseDTO({
        id: optDto.dishOptionId,
        name: optDto.dishOptionName,
        description: '',
        optionItems: [
          {
            label: optDto.itemLabel,
            value: optDto.itemValue,
            extraPrice: optDto.extraPrice,
          },
        ],
      }),
    );

    return new OrderDish(
      dto.id,
      dto.dishId,
      dto.name,
      '', // Description not available in OrderDishItemResponseDTO
      dto.totalPrice,
      dishOptions,
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
      selectedOptions: this.options.map((opt) => opt.toSelectedOptionRequestDTO()),
      takeAway: this.takeAway,
    };
  }

  /**
   * Get the display price - this is just for UI display and does not calculate
   * actual prices which are handled by the backend
   */
  getDisplayPrice(): string {
    return this.totalPrice;
  }

  /**
   * Create a new OrderDish with updated quantity
   */
  withQuantity(quantity: number): OrderDish {
    if (this.quantity === quantity) return this;

    return new OrderDish(
      this.id,
      this.dishId,
      this.name,
      this.description,
      this.totalPrice,
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
      this.description,
      this.totalPrice,
      this.options,
      this.quantity,
      takeAway,
    );
  }

  /**
   * Create a new OrderDish with updated options
   */
  withOptions(options: readonly DishOption[]): OrderDish {
    return new OrderDish(
      this.id,
      this.dishId,
      this.name,
      this.description,
      this.totalPrice,
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
}
