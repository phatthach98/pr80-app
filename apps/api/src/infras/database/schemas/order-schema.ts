import mongoose, { Schema } from "mongoose";
import { formatDecimal, parseDecimal } from "../utils/mongodb.util";
import { EOrderStatus, EOrderType } from "@pr80-app/shared-contracts";

// Define the OrderDishItem schema
const OrderDishItemSchema = new Schema(
  {
    id: { type: String, required: true },
    dishId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: formatDecimal,
      set: parseDecimal,
    },
    basePrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: formatDecimal,
      set: parseDecimal,
    },
    selectedOptions: [
      {
        dishOptionId: { type: String, required: true },
        dishOptionName: { type: String, required: true },
        itemLabel: { type: String, required: true },
        itemValue: { type: String, required: true },
        extraPrice: {
          type: mongoose.Schema.Types.Decimal128,
          required: true,
          get: formatDecimal,
          set: parseDecimal,
        },
      },
    ],
    takeAway: { type: Boolean, required: true, default: false },
    note: { type: String, default: "" },
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
      enum: Object.values(EOrderStatus),
      required: true,
      default: EOrderStatus.COOKING,
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
      enum: Object.values(EOrderType),
      required: true,
      default: EOrderType.MAIN,
    },
    note: { type: String, default: "" },
    customerCount: { type: Number, required: true, default: 1 },
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
