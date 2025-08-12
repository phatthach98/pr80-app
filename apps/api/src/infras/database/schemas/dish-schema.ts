import mongoose, { Schema } from "mongoose";

const DishSchemaDefinition = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: (price: mongoose.Types.Decimal128): string | null => {
        if (!price) return null;
        return parseFloat(price.toString()).toFixed(6);
      },
      set: (price: string): mongoose.Types.Decimal128 => {
        return mongoose.Types.Decimal128.fromString(price);
      },
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
