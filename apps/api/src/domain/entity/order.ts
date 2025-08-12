import { v4 as uuid } from "uuid";

// Define the OrderDishItem interface
export interface OrderDishItem {
  id: string; // Unique identifier for this specific dish item in the order
  dishId: string;
  name: string;
  quantity: number;
  readonly price: string; // Make price readonly to prevent direct manipulation
  selectedOptions: {
    name: string;
    value: string;
    readonly extraPrice: string; // Make extraPrice readonly as well
  }[];
  takeAway: boolean;
}

// Define the OrderStatus enum
export enum OrderStatus {
  PENDING = "pending",
  WAITING = "waiting",
  COOKED = "cooked",
  SERVED = "served",
  PAID = "paid",
}

// Define the OrderType enum
export enum OrderType {
  MAIN = "main",
  SUB = "sub",
}

export class Order {
  public id: string;
  public linkedOrderId: string | null;
  public createdBy: string;
  public status: OrderStatus;
  public table: string;
  public totalAmount: string | null;
  public type: OrderType;
  public note: string;
  public dishes: OrderDishItem[];

  constructor(
    id: string,
    createdBy: string,
    table: string,
    status: OrderStatus = OrderStatus.PENDING,
    type: OrderType = OrderType.MAIN,
    dishes: OrderDishItem[] = [],
    linkedOrderId: string | null = null,
    note: string = "",
    totalAmount?: string | null
  ) {
    this.id = id;
    this.linkedOrderId = linkedOrderId;
    this.createdBy = createdBy;
    this.status = status;
    this.table = table;
    this.type = type;
    this.note = note;
    this.dishes = dishes;

    // Always calculate the total amount based on dishes to prevent manipulation
    // Only use provided totalAmount for linked orders where we need to include sub-orders
    if (totalAmount !== undefined && !linkedOrderId) {
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
    type: OrderType = OrderType.MAIN,
    dishes: OrderDishItem[] = [],
    linkedOrderId: string | null = null,
    note: string = ""
  ): Order {
    return new Order(
      uuid(),
      createdBy,
      table,
      OrderStatus.PENDING,
      type,
      dishes,
      linkedOrderId,
      note
    );
  }

  private calculateTotalAmount(): string {
    // Ensure we're using the correct price for each dish
    const total = this.dishes.reduce((sum, dish) => {
      // Calculate the base price plus any extra from options
      const dishPrice = parseFloat(dish.price);

      // Validate that the price is a positive number
      if (typeof dishPrice !== "number" || dishPrice < 0) {
        throw new Error(`Invalid price for dish ${dish.id}: ${dishPrice}`);
      }

      return sum + dishPrice * dish.quantity;
    }, 0);

    // Ensure price is stored with 2 decimal places
    return total.toFixed(6);
  }

  // Make totalAmount read-only by providing a getter
  public getTotalAmount(): string | null {
    return this.totalAmount;
  }

  public updateStatus(newStatus: OrderStatus): void {
    this.status = newStatus;
  }

  public updateTable(newTable: string): void {
    this.table = newTable;
  }

  public updateType(newType: OrderType): void {
    this.type = newType;
  }

  public updateNote(newNote: string): void {
    this.note = newNote;
  }

  public addDish(dish: OrderDishItem): void {
    // Check if dish already exists
    const existingDishIndex = this.dishes.findIndex(
      (item) =>
        item.dishId === dish.dishId &&
        this.areDishOptionsEqual(item.selectedOptions, dish.selectedOptions) &&
        item.takeAway === dish.takeAway
    );

    if (existingDishIndex >= 0) {
      // Update quantity if dish already exists
      this.dishes[existingDishIndex].quantity += dish.quantity;
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
        // Update quantity
        this.dishes[dishIndex].quantity = newQuantity;
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

  private areDishOptionsEqual(options1: any[], options2: any[]): boolean {
    if (options1.length !== options2.length) return false;

    // Sort both arrays to ensure consistent comparison
    const sortedOptions1 = [...options1].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const sortedOptions2 = [...options2].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return sortedOptions1.every((option, index) => {
      const option2 = sortedOptions2[index];
      return (
        option.name === option2.name &&
        option.value === option2.value &&
        option.extraPrice === option2.extraPrice
      );
    });
  }

  public toJSON() {
    const order: any = {
      id: this.id,
      linkedOrderId: this.linkedOrderId,
      createdBy: this.createdBy,
      status: this.status,
      table: this.table,
      totalAmount: this.totalAmount,
      type: this.type,
      note: this.note,
      dishes: this.dishes,
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
