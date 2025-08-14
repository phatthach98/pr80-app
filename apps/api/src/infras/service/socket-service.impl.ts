import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import {
  SocketService,
  SocketEventSource,
  SocketEvents
} from "@application/interface/service";
import { Order } from "@domain/entity/order";
import { JwtTokenService } from "@application/interface/service";

export class SocketServiceImpl implements SocketService {
  private io: SocketIOServer | null = null;
  private readonly jwtService: JwtTokenService;
  private eventSource: SocketEventSource = SocketEventSource.USE_CASE;

  constructor(jwtService: JwtTokenService) {
    this.jwtService = jwtService;
  }

  initialize(
    server: HttpServer,
    eventSource: SocketEventSource = SocketEventSource.USE_CASE
  ): void {
    this.eventSource = eventSource;
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // Socket middleware for authentication
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.headers.token as string;
        if (!token) {
          return next(new Error("Authentication error: Token not provided"));
        }

        const decoded = await this.jwtService.verifyToken(token);
        if (!decoded) {
          return next(new Error("Authentication error: Invalid token"));
        }

        // Attach user data to socket
        socket.data.user = decoded;
        return next();
      } catch (error) {
        return next(new Error("Authentication error"));
      }
    });

    // Handle connection
    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);
      socket.join(SocketEvents.ROOMS.ORDERS);
      console.log(`User ${socket.id} subscribe to ${SocketEvents.ROOMS.ORDERS}`);

    

      // Handle disconnection
      socket.on("disconnect", () => {
        socket.leave(SocketEvents.ROOMS.ORDERS);
        console.log(`User ${socket.id} unsubscribed from ${SocketEvents.ROOMS.ORDERS}`);
        console.log(`User disconnected: ${socket.id}`);
      });
    });

    console.log("Socket.IO server initialized");
  }

  emitOrderCreated(
    order: Order,
    source: SocketEventSource = SocketEventSource.USE_CASE
  ): void {
    if (!this.io) {
      console.error("Socket server not initialized");
      return;
    }

    // Only emit events from the configured source to prevent duplicates
    if (source === this.eventSource) {
      this.io.to(SocketEvents.ROOMS.ORDERS).emit(SocketEvents.ORDER.CREATED, order);
      console.log(
        `Order created event emitted from ${source} source for order ${order.id}`
      );
    }
  }

  emitOrderUpdated(
    order: Order,
    source: SocketEventSource = SocketEventSource.USE_CASE
  ): void {
    if (!this.io) {
      console.error("Socket server not initialized");
      return;
    }

    // Only emit events from the configured source to prevent duplicates
    if (source === this.eventSource) {
      this.io.to(SocketEvents.ROOMS.ORDERS).emit(SocketEvents.ORDER.UPDATED, order);
      console.log(
        `Order updated event emitted from ${source} source for order ${order.id}`
      );
    }
  }

  emitOrderDeleted(
    orderId: string,
    source: SocketEventSource = SocketEventSource.USE_CASE
  ): void {
    if (!this.io) {
      console.error("Socket server not initialized");
      return;
    }

    // Only emit events from the configured source to prevent duplicates
    if (source === this.eventSource) {
      this.io.to(SocketEvents.ROOMS.ORDERS).emit(SocketEvents.ORDER.DELETED, { id: orderId });
      console.log(
        `Order deleted event emitted from ${source} source for order ${orderId}`
      );
    }
  }

  getSocketServer(): SocketIOServer | null {
    return this.io;
  }

  getEventSource(): SocketEventSource {
    return this.eventSource;
  }

  close(): void {
    if (this.io) {
      this.io.close();
      this.io = null;
      console.log("Socket.IO server closed");
    }
  }
}
