import { Store } from '@tanstack/react-store';
import { Socket } from 'socket.io-client';

export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

export type SocketStoreType = {
  socket: Socket | null;
  connectionStatus: ConnectionStatus;
  error: Error | null;
};

export const socketStore = new Store<SocketStoreType>({
  socket: null,
  connectionStatus: ConnectionStatus.DISCONNECTED,
  error: null,
});

export const updateSocketConnection = (socket: Socket | null) => {
  socketStore.setState((state) => ({
    ...state,
    socket,
  }));
};

export const updateConnectionStatus = (status: ConnectionStatus) => {
  socketStore.setState((state) => ({
    ...state,
    connectionStatus: status,
  }));
};

export const updateSocketError = (error: Error | null) => {
  socketStore.setState((state) => ({
    ...state,
    error,
  }));
};

export const resetSocketStore = () => {
  socketStore.setState({
    socket: null,
    connectionStatus: ConnectionStatus.DISCONNECTED,
    error: null,
  });
};
