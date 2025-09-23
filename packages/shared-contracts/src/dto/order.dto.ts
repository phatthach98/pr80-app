import { EOrderStatus, EOrderType } from "../enums/order-status.enum";

// Pure DTO interfaces - no domain entity imports

// Selected option in a request
export interface SelectedOptionRequestDTO {
  dishOptionId: string;
  dishOptionName: string;
  itemValue: string;
  itemLabel: string;
}

export interface SelectedOptionDTO {
  dishOptionId: string;
  dishOptionName: string;
  itemValue: string;
  itemLabel: string;
  extraPrice: string;
}

// Order item in a request
export interface OrderItemRequestDTO {
  dishId: string;
  quantity: number;
  selectedOptions: SelectedOptionRequestDTO[];
  takeAway: boolean;
}

export interface OrderDishItemOptionResponseDTO {
  dishOptionId: string;
  dishOptionName: string;
  itemValue: string;
  itemLabel: string;
  extraPrice: string;
}

// Response DTO for order dish items
export interface OrderDishItemResponseDTO {
  id: string; // Unique identifier for this specific dish item
  dishId: string;
  name: string;
  quantity: number;
  totalPrice: string;
  priceIncludingSelectedOption: string;
  basePrice: string;
  selectedOptions: OrderDishItemOptionResponseDTO[];
  takeAway: boolean;
}

// Response DTO for orders
export interface OrderResponseDTO {
  id: string;
  linkedOrderId: string | null;
  createdBy: string;
  status: EOrderStatus;
  table: string;
  totalAmount: string;
  type: EOrderType;
  note: string;
  dishes: OrderDishItemResponseDTO[];
  customerCount: number;
  createdAt?: Date;
  updatedAt?: Date;
  linkedOrders?: OrderResponseDTO[];
}

// DTO for creating a new order
export interface CreateOrderRequestDTO {
  table: string;
  type?: EOrderType;
  dishes?: OrderItemRequestDTO[];
  linkedOrderId?: string;
  note?: string;
  customerCount?: number;
}

// DTO for creating an additional order
export interface CreateAdditionalOrderRequestDTO {
  originalOrderId: string;
  dishes: OrderItemRequestDTO[];
  note?: string;
}

// DTO for updating an order
export interface UpdateOrderRequestDTO {
  table?: string;
  status?: EOrderStatus;
  type?: EOrderType;
  note?: string;
  customerCount?: number;
}

// DTO for adding or updating an order item
export interface AddOrderItemRequestDTO {
  orderId?: string;
  dishId: string;
  quantity: number;
  selectedOptions: SelectedOptionRequestDTO[];
  takeAway: boolean;
  table?: string;
}

// DTO for updating order item quantity
export interface UpdateOrderItemQuantityRequestDTO {
  quantity: number;
}

// DTO for updating order status
export interface UpdateOrderStatusRequestDTO {
  status: EOrderStatus;
}

// DTO for updating order table
export interface UpdateOrderTableRequestDTO {
  table: string;
}
