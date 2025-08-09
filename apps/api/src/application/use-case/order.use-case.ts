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
  name: string;
  value: string;
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

  async getOrdersByType(type: OrderType) {
    return this.orderRepository.getOrdersByType(type);
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
   * Calculate dish price with options - enhanced method that fetches option prices from the backend
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

    // If no options are selected, return the base dish
    if (!selectedOptions || selectedOptions.length === 0) {
      const id = uuid();
      return {
        id,
        dishId: dish.id,
        name: dish.name,
        quantity: quantity,
        price: basePrice,
        selectedOptions: [],
        takeAway: takeAway,
      };
    }

    // Extract all option IDs from the dish
    const optionIds = dish.options.map((option) => option.id);

    // Fetch all dish options in a single database call
    const dishOptions = await this.dishOptionRepository.getDishOptionsByIds(
      optionIds
    );

    // Create a map for quick lookup
    const dishOptionsMap = new Map(
      dishOptions.map((option) => [option.name.toLowerCase(), option])
    );
    // Process each selected option using the map and calculate total price
    let totalExtraPrice = 0;
    const processedOptions = [];

    for (const selectedOption of selectedOptions) {
      const dishOption = dishOptionsMap.get(selectedOption.name.toLowerCase());

      if (!dishOption) {
        throw new NotFoundError(`Option not found: ${selectedOption.name}`);
      }

      const optionValue = dishOption.options.find(
        (o) => o.value.toLowerCase() === selectedOption.value.toLowerCase()
      );

      if (!optionValue) {
        throw new NotFoundError(
          `Option value not found: ${selectedOption.value} for option ${selectedOption.name}`
        );
      }

      processedOptions.push({
        name: selectedOption.name,
        value: optionValue.label,
        extraPrice: optionValue.extraPrice,
      });

      totalExtraPrice += parseFloat(optionValue.extraPrice.toString());
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

      // If this is a sub-order, recalculate the main order's total
      if (order.linkedOrderId) {
        await this.recalculateMainOrderTotal(order.linkedOrderId);
      }
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

    // If this is a sub-order, recalculate the main order's total
    if (order.linkedOrderId) {
      await this.recalculateMainOrderTotal(order.linkedOrderId);
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

    // If this is a sub-order, recalculate the main order's total
    if (order.linkedOrderId) {
      await this.recalculateMainOrderTotal(order.linkedOrderId);
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

    // Create the additional order
    const createdOrder = await this.orderRepository.create(additionalOrder);

    // Recalculate the main order's total amount
    const mainOrder = await this.recalculateMainOrderTotal(originalOrderId);

    return mainOrder;
  }

  /**
   * Update an existing order
   */
  async updateOrder(id: string, changes: Partial<Order>) {
    const order = await this.getOrderById(id);

    // Store the original linkedOrderId for later comparison
    const originalLinkedOrderId = order.linkedOrderId;

    // Create a new Order instance with the updated properties
    const updatedOrder = new Order(
      order.id,
      changes.createdBy || order.createdBy,
      changes.table || order.table,
      changes.status || order.status,
      changes.type || order.type,
      changes.dishes || order.dishes,
      changes.linkedOrderId !== undefined
        ? changes.linkedOrderId
        : order.linkedOrderId,
      changes.note !== undefined ? changes.note : order.note
    );

    // Update the order
    const result = await this.orderRepository.update(updatedOrder);

    // If this is a sub-order (has a linkedOrderId), recalculate the main order's total
    if (updatedOrder.linkedOrderId) {
      await this.recalculateMainOrderTotal(updatedOrder.linkedOrderId);
    }

    // If the linkedOrderId was changed, also update the old main order's total
    if (
      originalLinkedOrderId &&
      originalLinkedOrderId !== updatedOrder.linkedOrderId
    ) {
      await this.recalculateMainOrderTotal(originalLinkedOrderId);
    }

    return result;
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

    // If this is a sub-order, get the main order ID before deleting
    const mainOrderId = order.linkedOrderId;

    const deleted = await this.orderRepository.delete(id);

    if (!deleted) {
      throw new Error(`Failed to delete order with id ${id}`);
    }

    // If this was a sub-order, recalculate the main order's total
    if (mainOrderId) {
      await this.recalculateMainOrderTotal(mainOrderId);
    }

    return { success: true, message: "Order deleted successfully" };
  }

  /**
   * Recalculate the total amount of a main order by summing up all its linked orders
   */
  async recalculateMainOrderTotal(mainOrderId: string): Promise<Order> {
    // Get the main order
    const mainOrder = await this.getOrderById(mainOrderId);

    // Get all linked orders
    const linkedOrders = await this.orderRepository.getLinkedOrders(
      mainOrderId
    );

    // Calculate the total amount of the main order (its own dishes)
    let totalAmount = mainOrder.totalAmount;

    // Add the total amount of each linked order
    if (linkedOrders && linkedOrders.length > 0) {
      const linkedOrdersTotal = linkedOrders.reduce((sum, order) => {
        return sum + order.totalAmount;
      }, 0);

      // Create a new order with the updated total amount
      // We're creating a new instance to ensure all values are properly set
      const updatedOrder = new Order(
        mainOrder.id,
        mainOrder.createdBy,
        mainOrder.table,
        mainOrder.status,
        mainOrder.type,
        mainOrder.dishes,
        mainOrder.linkedOrderId,
        mainOrder.note
      );

      // Set the new total amount that includes linked orders
      updatedOrder.totalAmount = parseFloat(
        (totalAmount + linkedOrdersTotal).toFixed(2)
      );
      console.log(
        "🚀 ~ OrderUseCase ~ recalculateMainOrderTotal ~ parseFloat((totalAmount + linkedOrdersTotal).toFixed(2)):",
        parseFloat((totalAmount + linkedOrdersTotal).toFixed(2))
      );

      // Update the order in the database
      const result = await this.orderRepository.update(updatedOrder);
      if (!result) {
        throw new Error(`Failed to update main order ${mainOrderId}`);
      }
      return result;
    }

    // If there are no linked orders, return the main order as is
    return mainOrder;
  }
}
