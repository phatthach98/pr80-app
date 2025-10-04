import {
  CreateOrderRequestDTO,
  EOrderStatus,
  EOrderType,
  OrderItemRequestDTO,
  OrderResponseDTO,
  UpdateOrderRequestDTO,
  CreateAdditionalOrderRequestDTO,
} from '@pr80-app/shared-contracts';
import { OrderDishOption } from './order-dish-option';
import { OrderDish } from './order-dish';
import { formatCurrency } from '@/utils/currency';
import { generateUniqueKey } from '@/utils';
import { UserEntity } from './user';
/**
 * Order entity representing both draft tables from local storage and orders from API
 */
export enum ETableStatus {
  IN_PROGRESS = 'in_progress',
  PAID = 'paid',
  ALL = 'all',
}

export class Order {
  id: string;
  linkedOrderId: string | null;
  createdBy: string;
  status: EOrderStatus;
  table: string;
  totalAmount: string;
  type: EOrderType;
  note: string;
  dishes: OrderDish[];
  createdAt?: Date;
  updatedAt?: Date;
  customerCount: number;
  linkedOrders?: Order[];
  tableStatus: ETableStatus;
  createdByUser?: UserEntity;

  constructor(props: {
    id: string;
    linkedOrderId: string | null;
    createdBy: string;
    status: EOrderStatus;
    table: string;
    totalAmount: string;
    type: EOrderType;
    note: string;
    dishes: OrderDish[];
    createdAt?: Date;
    updatedAt?: Date;
    customerCount: number;
    linkedOrders?: Order[];
    createdByUser?: UserEntity;
  }) {
    this.id = props.id;
    this.linkedOrderId = props.linkedOrderId;
    this.createdBy = props.createdBy;
    this.status = props.status;
    this.table = props.table;
    this.totalAmount = props.totalAmount;
    this.type = props.type;
    this.note = props.note;
    this.dishes = props.dishes;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.customerCount = props.customerCount;
    this.linkedOrders = props.linkedOrders;
    this.tableStatus = this.convertToTableStatus();
    this.createdByUser = props.createdByUser;
  }

  /**
   * Create an Order entity from an API order response
   */
  static fromOrderResponse(orderResponse: OrderResponseDTO): Order {
    // Convert DTO dishes to OrderDish entities
    const dishes = orderResponse.dishes.map((dishDto) => OrderDish.fromResponseDTO(dishDto));

    const linkedOrders = orderResponse.linkedOrders?.map((orderDto) =>
      Order.fromOrderResponse(orderDto),
    );

    return new Order({
      id: orderResponse.id,
      linkedOrderId: orderResponse.linkedOrderId,
      createdBy: orderResponse.createdBy,
      status: orderResponse.status,
      table: orderResponse.table,
      totalAmount: orderResponse.totalAmount,
      type: orderResponse.type,
      note: orderResponse.note,
      dishes: dishes,
      createdAt: orderResponse.createdAt,
      updatedAt: orderResponse.updatedAt,
      customerCount: orderResponse.customerCount,
      linkedOrders: linkedOrders,
      createdByUser: orderResponse.createdByUser
        ? UserEntity.fromResponseDTO(orderResponse.createdByUser)
        : undefined,
    });
  }

  /**
   * Create a list of Order entities from a list of order responses
   */
  static fromOrderResponseList(orders: OrderResponseDTO[]): Order[] {
    return orders.map(Order.fromOrderResponse);
  }

  static fromDraftOrder(draftOrder: { table: string; customerCount: number }): Order {
    return new Order({
      id: `__draft_order__${generateUniqueKey()}`,
      linkedOrderId: null,
      createdBy: '',
      status: EOrderStatus.DRAFT,
      table: draftOrder.table,
      totalAmount: '0',
      type: EOrderType.MAIN,
      note: '',
      dishes: [],
      customerCount: draftOrder.customerCount,
    });
  }

  static fromAdditionalOrder(mainOrder: Order, newDishes: OrderDish[], newNote: string): Order {
    return new Order({
      id: `__additional_order__${generateUniqueKey()}`,
      linkedOrderId: mainOrder.id,
      createdBy: '',
      status: EOrderStatus.DRAFT,
      table: mainOrder.table,
      totalAmount: '0',
      type: EOrderType.SUB,
      note: newNote,
      dishes: newDishes,
      customerCount: mainOrder.customerCount,
    });
  }

  /**
   * Add a dish to the order
   * @param dish - The Dish entity to add
   * @param selectedOptions - Options selected for this dish
   * @param quantity - Quantity to add
   * @param takeAway - Whether this dish is for take away
   * @returns The updated order
   */
  addDish(orderDish: OrderDish): Order {
    let updatedDishes = [...this.dishes, orderDish];

    if (this.dishes.some((dish) => dish.equals(orderDish))) {
      updatedDishes = this.dishes.map((dish) =>
        dish.equals(orderDish) ? orderDish.withQuantity(dish.quantity + orderDish.quantity) : dish,
      );
    } else {
      updatedDishes = [...this.dishes, orderDish];
    }

    return new Order({
      ...this,
      dishes: updatedDishes,
    });
  }

  /**
   * Remove a dish from the order
   * @param dishItemId - ID of the specific dish item to remove
   * @returns The updated order
   */
  removeDish(dishItemId: string): Order {
    return new Order({
      ...this,
      dishes: this.dishes.filter((dish) => dish.id !== dishItemId),
    });
  }

  /**
   * Update the quantity of a dish in the order
   * @param dishItemId - ID of the specific dish item to update
   * @param quantity - New quantity
   * @returns The updated order
   */
  updateDishQuantity(dishItemId: string, quantity: number): Order {
    if (quantity <= 0) {
      return this.removeDish(dishItemId);
    }

    const updatedDishes = this.dishes.map((dish) =>
      dish.id === dishItemId ? dish.withQuantity(quantity) : dish,
    );

    return new Order({
      ...this,
      dishes: updatedDishes,
    });
  }

  /**
   * Update the selected options for a dish
   * @param dishItemId - ID of the specific dish item to update
   * @param selectedOptions - New selected options
   * @returns The updated order
   */
  updateDishOptions(dishItemId: string, selectedOptions: OrderDishOption[]): Order {
    // Use OrderDishOption entities directly

    const updatedDishes = this.dishes.map((dish) =>
      dish.id === dishItemId ? dish.withSelectedOptions(selectedOptions) : dish,
    );

    return new Order({
      ...this,
      dishes: updatedDishes,
      totalAmount: this.calculateTotalAmount(),
    });
  }

  /**
   * Toggle takeaway status for a dish
   * @param dishItemId - ID of the specific dish item to update
   * @returns The updated order
   */
  toggleDishTakeAway(dishItemId: string): Order {
    const updatedDishes = this.dishes.map((dish) =>
      dish.id === dishItemId ? dish.toggleTakeAway() : dish,
    );

    return new Order({
      ...this,
      dishes: updatedDishes,
      totalAmount: this.calculateTotalAmount(),
    });
  }

  /**
   * Update the note for the order
   * @param note - New note
   * @returns The updated order
   */
  updateNote(note: string): Order {
    return new Order({
      ...this,
      note,
    });
  }

  updateCustomerCount(customerCount: number): Order {
    return new Order({
      ...this,
      customerCount,
    });
  }

  /**
   * Convert the order to a CreateOrderRequestDTO for API requests
   * @returns CreateOrderRequestDTO
   */
  toCreateOrderDTO(): CreateOrderRequestDTO {
    // Convert dishes to the request format using their toRequestDTO method
    const dishesDTO: OrderItemRequestDTO[] = this.dishes.map((dish) => dish.toRequestDTO());

    return {
      table: this.table,
      type: this.type,
      dishes: dishesDTO,
      linkedOrderId: this.linkedOrderId || undefined,
      note: this.note || undefined,
      customerCount: this.customerCount,
    };
  }

  toCreateAdditionalOrderDTO(): CreateAdditionalOrderRequestDTO {
    return {
      originalOrderId: this.linkedOrderId || '',
      dishes: this.dishes.map((dish) => dish.toRequestDTO()),
      note: this.note,
    };
  }

  /**
   * Convert the order to an UpdateOrderRequestDTO for API requests
   * @returns UpdateOrderRequestDTO with orderId
   */
  toUpdateOrderDTO(): { orderId: string; data: UpdateOrderRequestDTO } {
    if (!this.id) {
      throw new Error('Cannot update an order without an ID');
    }

    return {
      orderId: this.id,
      data: {
        table: this.table,
        type: this.type,
        note: this.note || undefined,
        status: this.status,
        customerCount: this.customerCount,
      },
    };
  }

  getFormattedTotalAmount(): string {
    if (this.status === EOrderStatus.DRAFT) {
      return formatCurrency(this.calculateTotalAmount());
    }
    return formatCurrency(this.totalAmount);
  }

  private calculateTotalAmount(): string {
    const totalAmount = this.dishes.reduce((sum, dish) => {
      return sum + dish.getParsedTotalPrice();
    }, 0);
    return totalAmount.toFixed(6);
  }

  public isMainOrder(): boolean {
    return this.type === EOrderType.MAIN;
  }

  public canEditOrderDish(): boolean {
    return this.status === EOrderStatus.DRAFT;
  }

  public canEditOrder(): boolean {
    return this.status !== EOrderStatus.PAID && this.status !== EOrderStatus.CANCELLED;
  }

  public getParsedTotalAmount(): number {
    if (this.status === EOrderStatus.DRAFT) {
      return parseFloat(this.calculateTotalAmount());
    }
    return parseFloat(this.totalAmount);
  }

  public getDisplayCustomerCount(): string {
    return this.customerCount > 0 ? `${this.customerCount} Khách` : '';
  }

  public getDisplayStatus(): string {
    switch (this.status) {
      case EOrderStatus.DRAFT:
        return 'Nháp';
      case EOrderStatus.COOKING:
        return 'Đang nấu';
      case EOrderStatus.READY:
        return 'Sẵn sàng';
      case EOrderStatus.PAID:
        return 'Đã thanh toán';
      case EOrderStatus.CANCELLED:
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  }

  public canMakePayment(): boolean {
    if (!this.isMainOrder()) {
      return false;
    }

    if (this.status !== EOrderStatus.READY) {
      return false;
    }

    if (!this.linkedOrders || this.linkedOrders.length === 0) {
      return true;
    }

    return this.linkedOrders.every((order) => order.status === EOrderStatus.READY);
  }

  public isPaid(): boolean {
    return this.status === EOrderStatus.PAID;
  }

  private convertToTableStatus(): ETableStatus {
    if (this.status === EOrderStatus.PAID) {
      return ETableStatus.PAID;
    }
    return ETableStatus.IN_PROGRESS;
  }

  public getDisplayTableStatus(): string {
    switch (this.tableStatus) {
      case ETableStatus.IN_PROGRESS:
        return 'Đang xử lý';
      case ETableStatus.PAID:
        return 'Đã thanh toán';
      default:
        return 'Không xác định';
    }
  }

  public getDisplayOrderId(): string {
    return this.id.substring(0, 8);
  }

  public isDraft(): boolean {
    return this.status === EOrderStatus.DRAFT;
  }
}
