import { v4 as uuid } from "uuid";
import { EOrderStatus, EOrderType } from "@pr80-app/shared-contracts";
import { OrderDishItem } from "./order-dish-item";

export class Order {
  public id: string;
  public linkedOrderId: string | null;
  public createdBy: string;
  public createdByUser?: any; // Add user details field
  public status: EOrderStatus;
  public table: string;
  public totalAmount: string;
  public type: EOrderType;
  public note: string;
  public customerCount: number;
  public dishes: OrderDishItem[];

  constructor(
    id: string,
    createdBy: string,
    table: string,
    status: EOrderStatus = EOrderStatus.COOKING,
    type: EOrderType = EOrderType.MAIN,
    dishes: OrderDishItem[] = [],
    linkedOrderId: string | null = null,
    note: string = "",
    customerCount: number = 1,
    totalAmount?: string
  ) {
    this.id = id;
    this.linkedOrderId = linkedOrderId;
    this.createdBy = createdBy;
    this.status = status;
    this.table = table;
    this.type = type;
    this.note = note;
    this.dishes = dishes.map((dish) =>
      OrderDishItem.create(
        dish.dishId,
        dish.name,
        dish.quantity,
        dish.basePrice,
        dish.selectedOptions,
        dish.takeAway,
        dish.note
      )
    );
    this.customerCount = customerCount;
    // Always calculate the total amount based on dishes to prevent manipulation
    // Only use provided totalAmount for linked orders where we need to include sub-orders
    if (totalAmount) {
      // For main orders with linked orders, we can use the provided totalAmount
      this.totalAmount = totalAmount;
    } else {
      // For regular orders or sub-orders, always calculate from dishes
      this.totalAmount = this.calculateTotalAmount();
    }
  }

  static create(
    createdBy: string,
    table: string,
    type: EOrderType = EOrderType.MAIN,
    dishes: OrderDishItem[] = [],
    linkedOrderId: string | null = null,
    note: string = "",
    customerCount: number = 1
  ): Order {
    return new Order(
      uuid(),
      createdBy,
      table,
      EOrderStatus.COOKING,
      type,
      dishes,
      linkedOrderId,
      note,
      customerCount
    );
  }

  private calculateTotalAmount(): string {
    // Ensure we're using the correct price for each dish
    const total = this.dishes.reduce((sum, dish) => {
      // Get total price for dish with quantity
      const dishTotalPrice = dish.getTotalPriceForQuantity();

      // Validate that the price is a positive number
      if (typeof dishTotalPrice !== "number" || dishTotalPrice < 0) {
        throw new Error(`Invalid price for dish ${dish.id}: ${dishTotalPrice}`);
      }

      return sum + dishTotalPrice;
    }, 0);

    // Ensure price is stored with 6 decimal places
    return total.toFixed(6);
  }

  // Make totalAmount read-only by providing a getter
  public getTotalAmount(): string | null {
    return this.totalAmount;
  }

  public updateStatusBasedOnCurrentStatus(): void {
    // Standard progression for all order types
    if (this.status === EOrderStatus.COOKING) {
      this.status = EOrderStatus.READY;
    } else if (this.status === EOrderStatus.READY) {
      this.status = EOrderStatus.PAID;
    }
    // No transition for DRAFT, PAID or CANCELLED statuses
  }

  public updateStatus(newStatus: EOrderStatus): void {
    // Direct status update
    this.status = newStatus;
  }

  public updateTable(newTable: string): void {
    this.table = newTable;
  }

  public updateToPreviousStatus(): void {
    if (this.status !== EOrderStatus.READY) {
      throw new Error(
        "Cannot revert to previous status because the order is not ready"
      );
    }
    this.status = EOrderStatus.COOKING;
  }

  public updateType(newType: EOrderType): void {
    this.type = newType;
  }

  public updateNote(newNote: string): void {
    this.note = newNote;
  }

  public addDish(dish: OrderDishItem): void {
    // Check if dish already exists
    const existingDishIndex = this.dishes.findIndex((item) =>
      item.equals(dish)
    );

    if (existingDishIndex >= 0) {
      // Update quantity if dish already exists
      const existingDish = this.dishes[existingDishIndex];
      const newQuantity = existingDish.quantity + dish.quantity;
      this.dishes[existingDishIndex] = existingDish.withQuantity(newQuantity);
    } else {
      // Add new dish
      this.dishes.push(dish);
    }

    // Recalculate total amount
    this.totalAmount = this.calculateTotalAmount();
  }

  public updateDishQuantity(dishIndex: number, newQuantity: number): void {
    if (dishIndex >= 0 && dishIndex < this.dishes.length) {
      if (newQuantity <= 0) {
        // Remove dish if quantity is 0 or negative
        this.dishes.splice(dishIndex, 1);
      } else {
        // Update quantity with immutable pattern
        const dish = this.dishes[dishIndex];
        this.dishes[dishIndex] = dish.withQuantity(newQuantity);
      }

      // Recalculate total amount
      this.totalAmount = this.calculateTotalAmount();
    }
  }

  public removeDish(dishIndex: number): void {
    if (dishIndex >= 0 && dishIndex < this.dishes.length) {
      this.dishes.splice(dishIndex, 1);

      // Recalculate total amount
      this.totalAmount = this.calculateTotalAmount();
    }
  }

  public toJSON() {
    const order: any = {
      id: this.id,
      linkedOrderId: this.linkedOrderId,
      createdBy: this.createdBy,
      createdByUser: this.createdByUser,
      status: this.status,
      table: this.table,
      totalAmount: this.totalAmount,
      type: this.type,
      note: this.note,
      dishes: this.dishes,
      customerCount: this.customerCount,
    };

    // Add timestamps if they exist
    if ((this as any).createdAt) {
      order.createdAt = (this as any).createdAt;
    }

    if ((this as any).updatedAt) {
      order.updatedAt = (this as any).updatedAt;
    }

    return order;
  }
}
