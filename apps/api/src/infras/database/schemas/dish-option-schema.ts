import mongoose, { Schema, model } from "mongoose";
import { DishSelectOption } from "../../../types";

interface DishOptionDocument {
  _id: string;
  name: string;
  description: string;
  options: DishSelectOption[];
}

const dishOptionSchema = new Schema<DishOptionDocument>(
  {
    _id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    options: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
        extraPrice: { type: mongoose.Schema.Types.Decimal128, required: true },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    _id: false // Disable auto _id generation
  }
);

// No need for pre-save hook as we're now directly using _id

export const DishOptionSchema = model<DishOptionDocument>(
  "DishOption",
  dishOptionSchema
);