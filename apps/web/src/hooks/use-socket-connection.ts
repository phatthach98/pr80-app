import { createSocketClient } from '@/api/socket-client';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

export const useSocketConnection = (jwtToken: string) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.DISCONNECTED,
  );
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }

    if (!jwtToken) {
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
      return;
    }

    // Create new socket connection
    setConnectionStatus(ConnectionStatus.CONNECTING);
    setError(null);

    const newSocket = createSocketClient(jwtToken);
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnectionStatus(ConnectionStatus.CONNECTED);
    });

    newSocket.on('disconnect', () => {
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
    });

    newSocket.on('connect_error', (err) => {
      setConnectionStatus(ConnectionStatus.ERROR);
      setError(err);
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
    };
  }, [jwtToken]);

  return {
    isConnected: connectionStatus === ConnectionStatus.CONNECTED,
    connectionStatus,
    socket,
    error,
  };
};
