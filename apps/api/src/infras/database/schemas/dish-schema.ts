import mongoose, { Schema } from "mongoose";

const DishSchemaDefinition = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: mongoose.Schema.Types.Decimal128, required: true },
    options: [
      {
        id: { type: String, required: true }
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const DishSchema = mongoose.model("Dish", DishSchemaDefinition);