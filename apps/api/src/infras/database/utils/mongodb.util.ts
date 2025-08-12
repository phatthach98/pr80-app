import mongoose from "mongoose";

export const formatDecimal = (price: mongoose.Types.Decimal128): string => {
  if (!price) return "0.000000";
  return parseFloat(price.toString()).toFixed(6);
};

export const parseDecimal = (price: string): mongoose.Types.Decimal128 => {
  return mongoose.Types.Decimal128.fromString(price);
};
