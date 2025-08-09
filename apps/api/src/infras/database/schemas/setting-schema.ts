import { Schema, model, SchemaTypes } from "mongoose";

const SettingSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["option", "config"],
      index: true,
    },
    belongTo: {
      type: String,
      required: true,
      index: true,
    },
    data: {
      type: SchemaTypes.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "settings",
    _id: false,
  }
);

export const SettingModel = model("Setting", SettingSchema); 