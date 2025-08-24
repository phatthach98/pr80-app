import { OrderStatus, OrderType } from '../enums/order-status.enum';

// Pure DTO interfaces - no domain entity imports

// Selected option in a request
export interface SelectedOptionRequestDTO {
  name: string;
  value: string;
}

// Order item in a request
export interface OrderItemRequestDTO {
  dishId: string;
  quantity: number;
  selectedOptions: SelectedOptionRequestDTO[];
  takeAway: boolean;
}

// Response DTO for order dish items
export interface OrderDishItemResponseDTO {
  id: string; // Unique identifier for this specific dish item
  dishId: string;
  name: string;
  quantity: number;
  price: string;
  selectedOptions: {
    name: string;
    value: string;
    extraPrice: string;
  }[];
  takeAway: boolean;
}

// Response DTO for orders
export interface OrderResponseDTO {
  id: string;
  linkedOrderId: string | null;
  createdBy: string;
  status: OrderStatus;
  table: string;
  totalAmount: string;
  type: OrderType;
  note: string;
  dishes: OrderDishItemResponseDTO[];
  createdAt?: Date;
  updatedAt?: Date;
}

// DTO for creating a new order
export interface CreateOrderRequestDTO {
  table: string;
  type?: OrderType;
  dishes?: OrderItemRequestDTO[];
  linkedOrderId?: string;
  note?: string;
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
  status?: OrderStatus;
  type?: OrderType;
  note?: string;
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
  status: OrderStatus;
}

// DTO for updating order table
export interface UpdateOrderTableRequestDTO {
  table: string;
}
