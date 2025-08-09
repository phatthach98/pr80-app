import mongoose, { Schema } from "mongoose";

const DishSchemaDefinition = new Schema(
  {
    _id: { type: String, required: true, unique: true },
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
    versionKey: false,
    _id: false // Disable auto _id generation
  }
);

// No need for pre-save hook as we're now directly using _id

export const DishSchema = mongoose.model("Dish", DishSchemaDefinition);