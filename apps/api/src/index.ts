// src/index.js
import express, { Express } from "express";
import dotenv from "dotenv";
import { connectToDB } from "@infras/database/connection";
import { authRouter } from "@presentation/router/auth.router";
import { errorHandler } from "@presentation/middleware/error-handler.middleware";
import { userRouter } from "@presentation/router/user.router";
import { roleRouter } from "@presentation/router/role.router";
import { settingRouter } from "@presentation/router/setting.router";
import { dishOptionRouter } from "@presentation/router/dish-option.router";
import { dishRouter } from "@presentation/router/dish.router";
import { container } from "@infras/di";
import { JWT_TOKEN_SERVICE } from "@infras/di/tokens";
import { JwtTokenService } from "@application/interface/service";
import { authMiddlewareFactory } from "@presentation/middleware/request-authenticator.middleware";

dotenv.config();
const app: Express = express();
app.use(express.json());

const jwtService = container.resolve<JwtTokenService>(JWT_TOKEN_SERVICE);
const authenticateRequest = authMiddlewareFactory(jwtService);

const startServer = async () => {
  try {
    await connectToDB();
    app.use(`/api/health`, (req, res) => {
      res.send("OK");
    });

    // Public routes that do not require authentication
    app.use("/api/auth", authRouter);

    // Apply the authentication middleware to all user and role routes.
    app.use("/api", authenticateRequest, userRouter);
    app.use("/api", authenticateRequest, roleRouter);
    app.use("/api", authenticateRequest, settingRouter);
    app.use("/api", authenticateRequest, dishOptionRouter);
    app.use("/api", authenticateRequest, dishRouter);

    app.use(errorHandler);

    app.listen(3000, () => {
      console.log(`[server]: Server is running at http://localhost:3000`);
    });
  } catch (error) {
    console.log("Cannot connect to the database!", error);
    process.exit(1);
  }
};

startServer();
