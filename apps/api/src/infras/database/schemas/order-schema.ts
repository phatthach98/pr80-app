import mongoose, { Schema } from "mongoose";
import { formatDecimal, parseDecimal } from "../utils/mongodb.util";
import { OrderStatus, OrderType } from "@pr80-app/shared-contracts";

// Define the OrderDishItem schema
const OrderDishItemSchema = new Schema(
  {
    id: { type: String, required: true },
    dishId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: formatDecimal,
      set: parseDecimal,
    },
    selectedOptions: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
        extraPrice: {
          type: mongoose.Schema.Types.Decimal128,
          required: true,
          get: formatDecimal,
          set: parseDecimal,
        },
      },
    ],
    takeAway: { type: Boolean, required: true, default: false },
  },
  {
    _id: false, // Disable auto _id generation for subdocuments
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// Define the Order schema
const OrderSchemaDefinition = new Schema(
  {
    _id: { type: String, required: true },
    linkedOrderId: { type: String, default: null },
    createdBy: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      required: true,
      default: OrderStatus.PENDING,
    },
    table: { type: String, required: true },
    totalAmount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: formatDecimal,
      set: parseDecimal,
    },
    type: {
      type: String,
      enum: Object.values(OrderType),
      required: true,
      default: OrderType.MAIN,
    },
    note: { type: String, default: "" },
    dishes: [OrderDishItemSchema],
  },
  {
    timestamps: true,
    versionKey: false,
    _id: false, // Disable auto _id generation
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// No need for pre-save hook as we're now directly using _id

export const OrderSchema = mongoose.model("Order", OrderSchemaDefinition);
