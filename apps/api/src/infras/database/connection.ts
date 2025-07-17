import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectToDB = () => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      await mongoose.connect(process.env.DB_URL!, {
        dbName: "pr-80-db",
      });
      console.log("mongodb connected");
      resolve(true);
    } catch (error) {
      console.error("MongoDB connection error:", error);
      reject(error);
    }
  });
};
