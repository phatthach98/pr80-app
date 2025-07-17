// src/index.js
import express, { Express } from "express";
import dotenv from "dotenv";
import { connectToDB } from "./infras/database/connection";

dotenv.config();
const app: Express = express();
app.use(express.json());

const startServer = async () => {
  try {
    await connectToDB();
    app.use(`/api/health`, (req, res) => {
      res.send("OK");
    });

    // app.use(errorHandler);

    app.listen(3000, () => {
      console.log(`[server]: Server is running at http://localhost:3000`);
    });
  } catch (error) {
    console.log("Cannot connect to the database!", error);
    process.exit(1);
  }
};

startServer();
