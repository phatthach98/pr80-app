import mongoose, { Schema, model } from "mongoose";
import { formatDecimal, parseDecimal } from "../utils/mongodb.util";

const dishOptionSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    options: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
        extraPrice: {
          type: mongoose.Schema.Types.Decimal128,
          required: true,
          get: formatDecimal,
          set: parseDecimal,
        },
      },
    ],
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

export const DishOptionSchema = model("DishOption", dishOptionSchema);
