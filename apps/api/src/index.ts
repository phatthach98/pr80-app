// src/index.js
import express, { Express } from "express";
import http from "http";
import dotenv from "dotenv";
import { connectToDB } from "@infras/database/connection";
import { authRouter } from "@presentation/router/auth.router";
import { errorHandler } from "@presentation/middleware/error-handler.middleware";
import { responseInterceptor } from "@presentation/middleware/response-interceptor.middleware";
import { userRouter } from "@presentation/router/user.router";
import { roleRouter } from "@presentation/router/role.router";
import { settingRouter } from "@presentation/router/setting.router";
import { dishOptionRouter } from "@presentation/router/dish-option.router";
import { dishRouter } from "@presentation/router/dish.router";
import { orderRouter } from "@presentation/router/order.router";
import { container } from "@infras/di";
import { JWT_TOKEN_SERVICE, SOCKET_SERVICE } from "@infras/di/tokens";
import {
  JwtTokenService,
  SocketService,
  SocketEventSource,
} from "@application/interface/service";
import { authMiddlewareFactory } from "@presentation/middleware/request-authenticator.middleware";
import {
  checkMongoDBDeployment,
  setupOrderChangeStream,
} from "@infras/database/utils/change-stream.util";
import cors from "cors";

dotenv.config();
const app: Express = express();
// Create HTTP server for Express and Socket.io
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
// sleep 1 second
const jwtService = container.resolve<JwtTokenService>(JWT_TOKEN_SERVICE);
const socketService = container.resolve<SocketService>(SOCKET_SERVICE);
const authenticateRequest = authMiddlewareFactory(jwtService);

const startServer = async () => {
  try {
    await connectToDB();

    // Apply the response interceptor middleware before routes
    app.use(responseInterceptor);
    app.use(`/api/health`, (req, res) => {
      res.send("OK");
    });

    // Public routes that do not require authentication
    app.use("/api/auth", authenticateRequest, authRouter);

    // Apply the authentication middleware to all user and role routes.
    app.use("/api", authenticateRequest, userRouter);
    app.use("/api", authenticateRequest, roleRouter);
    app.use("/api", authenticateRequest, settingRouter);
    app.use("/api", authenticateRequest, dishOptionRouter);
    app.use("/api", authenticateRequest, dishRouter);
    app.use("/api", authenticateRequest, orderRouter);

    app.use(errorHandler);

    // Determine if MongoDB deployment supports change streams
    // Read from environment variable or default to USE_CASE
    const eventSource =
      process.env.SOCKET_EVENT_SOURCE === "change_stream"
        ? SocketEventSource.CHANGE_STREAM
        : SocketEventSource.USE_CASE;

    // Initialize socket server with HTTP server and event source

    // If using change streams, set up MongoDB change stream
    if (eventSource === SocketEventSource.CHANGE_STREAM) {
      if (!(await checkMongoDBDeployment())) {
        console.log("MongoDB deployment does not support change streams");
        socketService.initialize(server, SocketEventSource.USE_CASE);
      } else {
        socketService.initialize(server, eventSource);
        await setupOrderChangeStream(socketService);
        console.log(
          "MongoDB change stream set up successfully for order updates"
        );
      }
    }

    if (eventSource === SocketEventSource.USE_CASE) {
      socketService.initialize(server, eventSource);
      console.log(
        "Socket server initialized for order updates from application layer"
      );
    }

    // Start HTTP server
    server.listen(3000, () => {
      console.log(`[server]: Server is running at http://localhost:3000`);
      console.log(`[socket]: Socket.IO server is running`);
    });
  } catch (error) {
    console.log("Cannot connect to the database!", error);
    process.exit(1);
  }
};

startServer();
