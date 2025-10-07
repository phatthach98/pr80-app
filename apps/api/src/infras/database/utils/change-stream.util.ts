import mongoose from "mongoose";
import {
  SocketService,
  SocketEventSource,
} from "@application/interface/service";
import { OrderSchema } from "../schemas/order-schema";
import { OrderRepositoryImpl } from "../repo-impl/order-repo.impl";

/**
 * Sets up MongoDB change streams for the Order collection or falls back to repository-based events
 * @param socketService The socket service to emit events
 */
let retryTimer: NodeJS.Timeout | null = null;
// TODO: persist resume token on redis or local cache instead
let lastResumeToken: mongoose.mongo.ResumeToken | undefined;

export const checkMongoDBDeployment = async () => {
  if (!mongoose.connection.db) {
    throw new Error("MongoDB connection not established");
  }
  const admin = mongoose.connection.db.admin();
  const helloCommand: any =
    (await admin.command({ hello: 1 } as any).catch(() => null)) ??
    (await admin.command({ isMaster: 1 } as any));
  const isReplicaSet = Boolean(helloCommand?.setName);
  const isSharded = helloCommand?.msg === "isdbgrid";
  return isReplicaSet || isSharded;
};

export const setupOrderChangeStream = async (socketService: SocketService) => {
  try {
    const orderRepo = new OrderRepositoryImpl();
    console.log(
      "MongoDB deployment supports change streams, setting up change stream"
    );

    // Set up change stream for Order collection
    const changeStream = OrderSchema.watch([], {
      fullDocument: "updateLookup",
      ...(lastResumeToken ? { resumeAfter: lastResumeToken } : {}),
    });

    // Handle change stream events
    changeStream.on("change", async (change) => {
      try {
        console.log(
          `Change detected in Order collection: ${change.operationType}`
        );
        lastResumeToken = change._id as any;
        switch (change.operationType) {
          case "insert": {
            // New order created
            const orderDoc = change.fullDocument;
            const order = orderRepo.mapFromDocument(orderDoc);
            if (order) {
              socketService.emitOrderCreated(
                order,
                SocketEventSource.CHANGE_STREAM
              );
            }
            break;
          }
          case "update": {
            // Order updated
            const orderDoc = change.fullDocument;
            const order = orderRepo.mapFromDocument(orderDoc);
            if (order) {
              socketService.emitOrderUpdated(
                order,
                SocketEventSource.CHANGE_STREAM
              );
            }
            break;
          }
          case "delete": {
            // Order deleted
            const orderId = change.documentKey._id.toString();
            socketService.emitOrderDeleted(
              orderId,
              SocketEventSource.CHANGE_STREAM
            );
            break;
          }
          default:
            // Ignore other operations
            break;
        }
      } catch (error) {
        console.error("Error processing order change stream:", error);
      }
    });

    // Handle errors
    changeStream.on("error", (error) => {
      console.error("Error in order change stream:", error);
      changeStream.close().catch((err) => {
        console.error("Error closing change stream:", err);
      });
      // Try to resume the change stream after a delay
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
      retryTimer = setTimeout(
        () => setupOrderChangeStream(socketService),
        5000
      );
    });

    return changeStream;

    return null;
  } catch (error) {
    console.error("Error setting up change stream:", error);
    console.log("Falling back to repository-based events");
    return null;
  }
};

/**
 * Closes a MongoDB change stream
 * @param changeStream The change stream to close
 */
export const closeChangeStream = async (
  changeStream: mongoose.mongo.ChangeStream | null
) => {
  if (changeStream) {
    try {
      await changeStream.close();
      console.log("Change stream closed");
    } catch (error) {
      console.error("Error closing change stream:", error);
      throw error;
    }
  }
};
