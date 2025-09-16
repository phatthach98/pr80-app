import { v4 as uuid } from "uuid";
import { SelectedOptionDTO } from "@pr80-app/shared-contracts";
import { parseDecimalSafely } from "@application/utils";

export class OrderDishItem {
  public readonly id: string; // Unique identifier for this specific dish item in the order
  public readonly dishId: string;
  public readonly name: string;
  public readonly quantity: number;
  public readonly totalPrice: string; // Make price readonly to prevent direct manipulation
  public readonly priceIncludingSelectedOption: string;
  public readonly basePrice: string;
  public readonly selectedOptions: SelectedOptionDTO[];
  public readonly takeAway: boolean;

  private constructor(
    id: string,
    dishId: string,
    name: string,
    quantity: number,
    basePrice: string,
    totalPrice: string,
    priceIncludingSelectedOption: string,
    selectedOptions: SelectedOptionDTO[],
    takeAway: boolean
  ) {
    this.id = id;
    this.dishId = dishId;
    this.name = name;
    this.quantity = quantity;
    this.basePrice = basePrice;
    this.totalPrice = totalPrice;
    this.priceIncludingSelectedOption = priceIncludingSelectedOption;
    this.selectedOptions = selectedOptions;
    this.takeAway = takeAway;

    // Freeze the object for immutability
    Object.freeze(this.selectedOptions);
    Object.freeze(this);
  }

  static create(
    dishId: string,
    name: string,
    quantity: number,
    basePrice: string,
    selectedOptions: SelectedOptionDTO[] = [],
    takeAway: boolean = false
  ): OrderDishItem {
    // Calculate total price including options
    const priceIncludingSelectedOption =
      OrderDishItem.calculatePriceIncludingSelectedOption(
        basePrice,
        selectedOptions
      );
    const totalPrice = OrderDishItem.calculateTotalPrice(
      priceIncludingSelectedOption,
      quantity
    );

    return new OrderDishItem(
      uuid(),
      dishId,
      name,
      quantity,
      basePrice,
      totalPrice,
      priceIncludingSelectedOption,
      selectedOptions,
      takeAway
    );
  }

  static fromExisting(existingItem: {
    id: string;
    dishId: string;
    name: string;
    quantity: number;
    basePrice: string;
    totalPrice: string;
    priceIncludingSelectedOption: string;
    selectedOptions: SelectedOptionDTO[];
    takeAway: boolean;
  }): OrderDishItem {
    return new OrderDishItem(
      existingItem.id,
      existingItem.dishId,
      existingItem.name,
      existingItem.quantity,
      existingItem.basePrice,
      existingItem.totalPrice,
      existingItem.priceIncludingSelectedOption,
      existingItem.selectedOptions,
      existingItem.takeAway
    );
  }

  private static calculatePriceIncludingSelectedOption(
    basePrice: string,
    selectedOptions: SelectedOptionDTO[]
  ): string {
    // Parse the base price safely
    const basePriceNum = parseDecimalSafely(basePrice);

    // Calculate extra price from options
    const optionsPrice = selectedOptions.reduce((sum, option) => {
      // If the option has an extraPrice property, add it
      const extraPrice = option.extraPrice
        ? parseDecimalSafely(option.extraPrice)
        : 0;
      return sum + extraPrice;
    }, 0);

    // Calculate total price (base + options)
    const totalPrice = basePriceNum + optionsPrice;

    // Return with 6 decimal places for precision
    return totalPrice.toFixed(6);
  }

  private static calculateTotalPrice(
    priceIncludingSelectedOption: string,
    quantity: number
  ): string {
    return (
      parseDecimalSafely(priceIncludingSelectedOption) * quantity
    ).toFixed(6);
  }

  public getTotalPriceForQuantity(): number {
    return parseDecimalSafely(this.totalPrice);
  }

  public withQuantity(newQuantity: number): OrderDishItem {
    if (newQuantity === this.quantity) return this;

    return new OrderDishItem(
      this.id,
      this.dishId,
      this.name,
      newQuantity,
      this.basePrice,
      this.totalPrice,
      this.priceIncludingSelectedOption,
      this.selectedOptions,
      this.takeAway
    );
  }

  public withTakeAway(takeAway: boolean): OrderDishItem {
    if (takeAway === this.takeAway) return this;

    return new OrderDishItem(
      this.id,
      this.dishId,
      this.name,
      this.quantity,
      this.basePrice,
      this.totalPrice,
      this.priceIncludingSelectedOption,
      this.selectedOptions,
      takeAway
    );
  }

  public toggleTakeAway(): OrderDishItem {
    return this.withTakeAway(!this.takeAway);
  }

  public withSelectedOptions(
    selectedOptions: SelectedOptionDTO[]
  ): OrderDishItem {
    // Recalculate total price with new options
    const priceIncludingSelectedOption =
      OrderDishItem.calculatePriceIncludingSelectedOption(
        this.basePrice,
        selectedOptions
      );
    const totalPrice = OrderDishItem.calculateTotalPrice(
      priceIncludingSelectedOption,
      this.quantity
    );
    return new OrderDishItem(
      this.id,
      this.dishId,
      this.name,
      this.quantity,
      this.basePrice,
      totalPrice,
      priceIncludingSelectedOption,
      selectedOptions,
      this.takeAway
    );
  }

  public equals(other: OrderDishItem): boolean {
    if (this.dishId !== other.dishId) return false;
    if (this.takeAway !== other.takeAway) return false;

    // Check if options are the same
    return this.areOptionsEqual(this.selectedOptions, other.selectedOptions);
  }

  public areOptionsEqual(
    options1: SelectedOptionDTO[],
    options2: SelectedOptionDTO[]
  ): boolean {
    if (options1.length !== options2.length) return false;

    // Sort both arrays to ensure consistent comparison
    const sortedOptions1 = [...options1].sort((a, b) =>
      a.dishOptionName.localeCompare(b.dishOptionName)
    );
    const sortedOptions2 = [...options2].sort((a, b) =>
      a.dishOptionName.localeCompare(b.dishOptionName)
    );

    return sortedOptions1.every((option, index) => {
      const option2 = sortedOptions2[index];
      return (
        option.dishOptionName === option2.dishOptionName &&
        option.itemValue === option2.itemValue &&
        option.dishOptionId === option2.dishOptionId &&
        option.itemLabel === option2.itemLabel
      );
    });
  }

  public toJSON() {
    return {
      id: this.id,
      dishId: this.dishId,
      name: this.name,
      quantity: this.quantity,
      totalPrice: this.totalPrice,
      basePrice: this.basePrice,
      priceIncludingSelectedOption: this.priceIncludingSelectedOption,
      selectedOptions: this.selectedOptions,
      takeAway: this.takeAway,
    };
  }
}
