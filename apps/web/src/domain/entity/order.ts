import {
  CreateOrderRequestDTO,
  EOrderStatus,
  EOrderType,
  OrderItemRequestDTO,
  OrderResponseDTO,
  SelectOption,
  SelectOptionWithPrice,
} from '@pr80-app/shared-contracts';
import { DishOption } from './dish-option';
import { Dish } from './dish';
import { OrderDish } from './order-dish';

/**
 * Order entity representing both draft tables from local storage and orders from API
 */
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
  source: 'local' | 'api';

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
    source: 'local' | 'api';
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
    this.source = props.source;
  }

  /**
   * Create an Order entity from a local table item
   */
  static fromLocalTable(localTable: TableView): Order {
    return new Order({
      id: localTable.id, // Use tableKey as ID for local tables
      linkedOrderId: null,
      createdBy: '',
      status: localTable.status,
      table: localTable.tableNumber,
      totalAmount: '0',
      type: EOrderType.MAIN,
      note: '',
      dishes: [],
      customerCount: localTable.customerCount,
      source: 'local',
    });
  }

  /**
   * Create an Order entity from an API order response
   */
  static fromOrderResponse(orderResponse: OrderResponseDTO): Order {
    // Convert DTO dishes to OrderDish entities
    const dishes = orderResponse.dishes.map((dishDto) => OrderDish.fromResponseDTO(dishDto));

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
      customerCount: 0, // API doesn't provide customer count
      source: 'api',
    });
  }

  /**
   * Create a list of Order entities from a list of order responses
   */
  static fromOrderResponseList(orders: OrderResponseDTO[]): Order[] {
    return orders.map(Order.fromOrderResponse);
  }

  /**
   * Create a list of Order entities from a list of local table items
   */
  static fromLocalOrderList(localOrders: TableView[]): Order[] {
    return localOrders.map(Order.fromLocalTable);
  }

  /**
   * Convert to local table format
   */
  toLocalOrder(): TableView {
    return {
      id: this.id,
      tableNumber: this.table,
      customerCount: this.customerCount,
      status: this.status,
      source: this.source,
      orderId: this.source === 'api' ? this.id : undefined,
      totalAmount: this.totalAmount,
      createdAt: this.createdAt,
      relatedOrderIds: this.source === 'api' ? [this.id] : [],
      type: this.type,
    };
  }

  /**
   * Add a dish to the order
   * @param dish - The Dish entity to add
   * @param selectedOptions - Options selected for this dish
   * @param quantity - Quantity to add
   * @param takeAway - Whether this dish is for take away
   * @returns The updated order
   */
  addDish(
    dish: Dish,
    selectedOptions: Record<string, SelectOptionWithPrice[]>,
    quantity: number,
    takeAway: boolean = false,
  ): Order {
    // Convert selected options to DishOption entities
    const dishOptions = Object.entries(selectedOptions).map(([dishOptionId, optionWithPrice]) => {
      const selectDishOption = dish.options.find((option) => option.id === dishOptionId);
      return DishOption.fromResponseDTO({
        id: dishOptionId,
        name: selectDishOption?.name || '',
        description: '',
        optionItems: [optionWithPrice[0]],
      });
    });

    // Create an OrderDish from the dish and options
    const orderDish = OrderDish.fromDish(dish, {
      quantity,
      takeAway,
      options: dishOptions,
    });

    // Add the dish to the order
    const updatedDishes = [...this.dishes, orderDish];

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
  updateDishOptions(dishItemId: string, selectedOptions: Record<string, SelectOption[]>): Order {
    // Convert selected options to DishOption entities
    const dishOptions = Object.entries(selectedOptions).map(([dishOptionId, options]) => {
      return DishOption.fromResponseDTO({
        id: dishOptionId,
        name: dishOptionId,
        description: '',
        optionItems: options.map((opt) => ({
          label: opt.label,
          value: opt.value,
          extraPrice: '0', // Default extra price
        })),
      });
    });

    const updatedDishes = this.dishes.map((dish) =>
      dish.id === dishItemId ? dish.withOptions(dishOptions) : dish,
    );

    return new Order({
      ...this,
      dishes: updatedDishes,
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

  /**
   * Get the total amount of the order
   * This simply returns the stored total amount from the backend
   * @returns The total amount as a string
   */
  getTotalAmount(): string {
    return this.totalAmount;
  }

  /**
   * Update the total amount with the value from the backend
   * @param totalAmount - The new total amount from the backend
   * @returns The updated order
   */
  updateTotalAmount(totalAmount: string): Order {
    return new Order({
      ...this,
      totalAmount,
    });
  }

  /**
   * Convert the order to a CreateOrderRequestDTO for API requests
   * @returns CreateOrderRequestDTO
   */
  toCreateOrderDTO(): CreateOrderRequestDTO {
    // Convert dishes to the request format using their toRequestDTO method
    const dishesDTO: OrderItemRequestDTO[] = this.dishes.map((dish) => dish.toCreateRequestDTO());

    return {
      table: this.table,
      type: this.type,
      dishes: dishesDTO,
      linkedOrderId: this.linkedOrderId || undefined,
      note: this.note || undefined,
    };
  }

  /**
   * View mapping functions
   */

  /**
   * Map to table view format
   */
  static toTableView(orders: Order[]): TableView[] {
    // Group orders by table
    const tableGroups = orders.reduce<Record<string, Order[]>>((acc, order) => {
      if (!acc[order.table]) {
        acc[order.table] = [];
      }
      acc[order.table].push(order);
      return acc;
    }, {});

    // Create TableView for each table
    return Object.entries(tableGroups).map(([tableNumber, tableOrders]) => {
      // Sort orders by creation date (newest first) or by status priority
      const sortedOrders = [...tableOrders].sort((a, b) => {
        // First sort by source (local first)
        if (a.source !== b.source) {
          return a.source === 'local' ? -1 : 1;
        }

        // Then sort by date for API orders
        if (a.source === 'api' && a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        return 0;
      });

      const mainOrder = sortedOrders[0];
      const relatedOrders = sortedOrders.slice(1);

      return {
        id: mainOrder.id || tableNumber,
        tableNumber,
        customerCount: mainOrder.customerCount,
        status: mainOrder.status,
        source: mainOrder.source,
        orderId: mainOrder.source === 'api' ? mainOrder.id : undefined,
        totalAmount: mainOrder.totalAmount,
        createdAt: mainOrder.createdAt,
        relatedOrderIds: relatedOrders.map((order) => order.id),
        type: mainOrder.type,
      };
    });
  }

  /**
   * Map to chef view format
   */
  static toChefView(orders: Order[]): ChefView[] {
    return orders.map((order) => ({
      id: order.id,
      tableNumber: order.table,
      status: order.status,
      dishes: order.dishes,
      createdAt: order.createdAt,
      type: order.type,
    }));
  }
}

/**
 * View types for different perspectives
 */

export interface TableView {
  id: string;
  tableNumber: string;
  customerCount: number;
  status: EOrderStatus;
  source: 'local' | 'api';
  orderId?: string;
  totalAmount: string;
  createdAt?: Date;
  relatedOrderIds: string[];
  type: EOrderType;
}

export interface ChefView {
  id: string;
  tableNumber: string;
  status: EOrderStatus;
  dishes: OrderDish[];
  createdAt?: Date;
  type: EOrderType;
}
