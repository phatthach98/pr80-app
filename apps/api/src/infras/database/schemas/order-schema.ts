import mongoose, { Schema } from "mongoose";
import { OrderDishItem, OrderStatus, OrderType } from "@domain/entity/order";

// Define the OrderDishItem schema
const OrderDishItemSchema = new Schema(
  {
    id: { type: String, required: true },
    dishId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: mongoose.Schema.Types.Decimal128, required: true },
    selectedOptions: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
        extraPrice: { type: mongoose.Schema.Types.Decimal128, required: true },
      }
    ],
    takeAway: { type: Boolean, required: true, default: false }
  },
  { _id: false } // Disable auto _id generation for subdocuments
);

// Define the Order schema
const OrderSchemaDefinition = new Schema(
  {
    _id: { type: String, required: true, unique: true },
    linkedOrderId: { type: String, default: null },
    createdBy: { type: String, required: true },
    status: { 
      type: String, 
      enum: Object.values(OrderStatus),
      required: true,
      default: OrderStatus.PENDING
    },
    table: { type: String, required: true },
    totalAmount: { type: mongoose.Schema.Types.Decimal128, required: true },
    type: { 
      type: String, 
      enum: Object.values(OrderType),
      required: true,
      default: OrderType.MAIN
    },
    note: { type: String, default: "" },
    dishes: [OrderDishItemSchema]
  },
  {
    timestamps: true,
    versionKey: false,
    _id: false // Disable auto _id generation
  }
);

// No need for pre-save hook as we're now directly using _id

export const OrderSchema = mongoose.model("Order", OrderSchemaDefinition);