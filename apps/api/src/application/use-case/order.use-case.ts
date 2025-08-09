import { v4 as uuid } from "uuid";
import {
  Order,
  OrderDishItem,
  OrderStatus,
  OrderType,
} from "@domain/entity/order";
import { OrderRepository } from "../interface/repository/order-repo.interface";
import { DishRepository } from "../interface/repository/dish-repo.interface";
import { DishOptionRepository } from "../interface/repository/dish-option-repo.interface";
import { NotFoundError } from "@application/errors";

// Define interfaces for the enhanced use case
interface SelectedOption {
  optionId: string;
  valueId: string;
}

interface OrderItemRequest {
  dishId: string;
  quantity: number;
  selectedOptions: SelectedOption[];
  takeAway: boolean;
}

export class OrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly dishRepository: DishRepository,
    private readonly dishOptionRepository: DishOptionRepository
  ) {}

  async getOrders() {
    return this.orderRepository.getOrders();
  }

  async getOrderById(id: string) {
    const order = await this.orderRepository.getOrderById(id);

    if (!order) {
      throw new NotFoundError(`Order with id ${id} not found`);
    }

    return order;
  }

  async getOrdersByStatus(status: OrderStatus) {
    return this.orderRepository.getOrdersByStatus(status);
  }

  async getOrdersByCreatedBy(userId: string) {
    return this.orderRepository.getOrdersByCreatedBy(userId);
  }

  async getOrderWithLinkedOrders(orderId: string) {
    // Get the main order
    const mainOrder = await this.getOrderById(orderId);

    // Get all orders linked to this order
    const linkedOrders = await this.orderRepository.getLinkedOrders(orderId);

    // Return both the main order and its linked orders
    return {
      mainOrder,
      linkedOrders: linkedOrders || [],
    };
  }

  /**
   * Calculate dish price with options - enhanced method that works with option IDs
   */
  async calculateDishWithOptions(
    dishId: string,
    selectedOptions: SelectedOption[],
    quantity: number,
    takeAway: boolean
  ): Promise<OrderDishItem> {
    // Get dish from database
    const dish = await this.dishRepository.getDishById(dishId);
    if (!dish) {
      throw new NotFoundError(`Dish with id ${dishId} not found`);
    }

    // Get base price from dish
    const basePrice = dish.price;

    // Calculate selected options prices
    const processedOptions = [];
    let totalExtraPrice = 0;

    // Extract all option IDs for batch fetching
    const optionIds = selectedOptions.map(option => option.optionId);
    
    // Fetch all dish options in a single database call
    const dishOptions = await this.dishOptionRepository.getDishOptionsByIds(optionIds);
    
    // Create a map for quick lookup
    const dishOptionsMap = new Map(
      dishOptions.map(option => [option.id, option])
    );

    // Process each selected option using the map
    for (const option of selectedOptions) {
      const dishOption = dishOptionsMap.get(option.optionId);
      if (!dishOption) {
        throw new NotFoundError(`Option not found: ${option.optionId}`);
      }

      const optionValue = dishOption.options.find(
        (o) => o.value === option.valueId
      );
      if (!optionValue) {
        throw new NotFoundError(
          `Option value not found: ${option.valueId} for option ${option.optionId}`
        );
      }

      processedOptions.push({
        name: dishOption.name,
        value: optionValue.label,
        extraPrice: optionValue.extraPrice,
      });

      totalExtraPrice += optionValue.extraPrice;
    }

    // Calculate total price (base + extras)
    const itemPrice = parseFloat((basePrice + totalExtraPrice).toFixed(2));

    // Generate a unique ID for this dish item
    const id = uuid();

    // Return the dish item with calculated prices and unique ID
    return {
      id,
      dishId: dish.id,
      name: dish.name,
      quantity: quantity,
      price: itemPrice,
      selectedOptions: processedOptions,
      takeAway: takeAway,
    };
  }

  /**
   * Add or update a dish item in an order - new method for simplified flow
   */
  async addOrUpdateOrderItem(
    orderId: string | null,
    userId: string,
    orderItem: OrderItemRequest,
    table: string = "default"
  ): Promise<Order> {
    // Calculate dish with options and prices
    const dishWithPrice = await this.calculateDishWithOptions(
      orderItem.dishId,
      orderItem.selectedOptions,
      orderItem.quantity,
      orderItem.takeAway
    );

    let order: Order;

    // If orderId is provided, update existing order
    if (orderId) {
      order = await this.getOrderById(orderId);

      // Add dish to order
      order.addDish(dishWithPrice);

      // Update the order
      const updatedOrder = await this.orderRepository.update(order);
      if (!updatedOrder) {
        throw new Error(`Failed to update order ${orderId}`);
      }
      order = updatedOrder;
    } else {
      // Create new order with this dish
      order = await this.createOrder(
        userId,
        table,
        OrderType.MAIN,
        [dishWithPrice],
        null,
        ""
      );
    }

    return order;
  }

  /**
   * Remove a dish item from an order using its unique id
   *
   * @param orderId The ID of the order
   * @param dishItemId The unique ID of the dish item to remove
   */
  async removeOrderItem(orderId: string, dishItemId: string): Promise<Order> {
    const order = await this.getOrderById(orderId);

    // Find the dish by its unique id
    const dishIndex = order.dishes.findIndex((dish) => dish.id === dishItemId);

    if (dishIndex === -1) {
      throw new NotFoundError(
        `Dish item with id ${dishItemId} not found in order ${orderId}`
      );
    }

    // Remove the dish
    order.removeDish(dishIndex);

    // Update the order
    const updatedOrder = await this.orderRepository.update(order);
    if (!updatedOrder) {
      throw new Error(`Failed to update order ${orderId}`);
    }
    return updatedOrder;
  }

  /**
   * Update dish quantity in an order
   */
  async updateOrderItemQuantity(
    orderId: string,
    dishItemId: string,
    newQuantity: number
  ): Promise<Order> {
    const order = await this.getOrderById(orderId);

    // Find the dish index by its unique id
    const dishIndex = order.dishes.findIndex((dish) => dish.id === dishItemId);

    if (dishIndex === -1) {
      throw new NotFoundError(
        `Dish item with id ${dishItemId} not found in order ${orderId}`
      );
    }

    // Update quantity
    order.updateDishQuantity(dishIndex, newQuantity);

    // Update the order
    const updatedOrder = await this.orderRepository.update(order);
    if (!updatedOrder) {
      throw new Error(`Failed to update order ${orderId}`);
    }
    return updatedOrder;
  }

  /**
   * Create a new order with calculated prices
   */
  async createOrder(
    createdBy: string,
    table: string,
    type: OrderType = OrderType.MAIN,
    dishes: OrderDishItem[] = [],
    linkedOrderId: string | null = null,
    note: string = ""
  ) {
    // If linkedOrderId is provided, verify it exists
    if (linkedOrderId) {
      await this.getOrderById(linkedOrderId);
    }

    const order = Order.create(
      createdBy,
      table,
      type,
      dishes,
      linkedOrderId,
      note
    );

    return this.orderRepository.create(order);
  }

  /**
   * Create an additional order linked to an original order
   */
  async createAdditionalOrder(
    originalOrderId: string,
    createdBy: string,
    orderItems: OrderItemRequest[] = [],
    note: string = ""
  ) {
    // Get the original order to copy table
    const originalOrder = await this.getOrderById(originalOrderId);

    // Calculate prices for all dishes
    const calculatedDishes = await Promise.all(
      orderItems.map((item) =>
        this.calculateDishWithOptions(
          item.dishId,
          item.selectedOptions,
          item.quantity,
          item.takeAway
        )
      )
    );

    // Create a new order linked to the original one
    const additionalOrder = Order.create(
      createdBy,
      originalOrder.table,
      OrderType.SUB, // Always create additional orders as SUB type
      calculatedDishes,
      originalOrderId,
      note
    );

    return this.orderRepository.create(additionalOrder);
  }

  /**
   * Update an existing order
   */
  async updateOrder(id: string, changes: Partial<Order>) {
    const order = await this.getOrderById(id);

    // Create a new Order instance with the updated properties
    const updatedOrder = new Order(
      order.id,
      changes.createdBy || order.createdBy,
      changes.table || order.table,
      changes.status || order.status,
      changes.type || order.type,
      changes.dishes || order.dishes,
      changes.linkedOrderId !== undefined ? changes.linkedOrderId : order.linkedOrderId,
      changes.note !== undefined ? changes.note : order.note
    );

    return this.orderRepository.update(updatedOrder);
  }

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, newStatus: OrderStatus) {
    const order = await this.getOrderById(id);

    order.updateStatus(newStatus);

    return this.orderRepository.update(order);
  }

  /**
   * Update order table
   */
  async updateOrderTable(id: string, newTable: string) {
    const order = await this.getOrderById(id);

    // Update the table
    order.updateTable(newTable);

    return this.orderRepository.update(order);
  }

  /**
   * Delete an order
   */
  async deleteOrder(id: string) {
    const order = await this.getOrderById(id);

    // Check if there are linked orders
    const linkedOrders = await this.orderRepository.getLinkedOrders(id);

    if (linkedOrders && linkedOrders.length > 0) {
      throw new Error(
        `Cannot delete order with id ${id} because it has linked orders`
      );
    }

    const deleted = await this.orderRepository.delete(id);

    if (!deleted) {
      throw new Error(`Failed to delete order with id ${id}`);
    }

    return { success: true, message: "Order deleted successfully" };
  }
}
