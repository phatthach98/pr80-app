import mongoose, { Schema } from "mongoose";
import { formatDecimal, parseDecimal } from "../utils/mongodb.util";

const DishSchemaDefinition = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: formatDecimal,
      set: parseDecimal,
    },
    options: [
      {
        id: { type: String, required: true },
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

export const DishSchema = mongoose.model("Dish", DishSchemaDefinition);
