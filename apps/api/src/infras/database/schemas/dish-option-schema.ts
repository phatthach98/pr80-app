import { Schema, model } from "mongoose";
import { SelectOption } from "../../../types";

interface DishOptionDocument {
  id: string;
  name: string;
  description: string;
  options: SelectOption[];
}

const dishOptionSchema = new Schema<DishOptionDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    options: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const DishOptionSchema = model<DishOptionDocument>(
  "DishOption",
  dishOptionSchema
);