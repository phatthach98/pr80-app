import { createSocketClient } from '@/api/socket-client';
import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { 
  ConnectionStatus, 
  socketStore, 
  updateConnectionStatus, 
  updateSocketConnection, 
  updateSocketError 
} from '@/store/socket.store';
import { useStore } from '@tanstack/react-store';

/**
 * Hook to manage socket connection
 * @param jwtToken The JWT token for authentication
 * @returns Socket connection state and instance
 */
export const useSocketConnection = (jwtToken: string) => {
  const { socket, connectionStatus, error } = useStore(socketStore);

  useEffect(() => {
    // Clean up previous socket connection if it exists
    if (socket) {
      socket.disconnect();
      updateSocketConnection(null);
    }
    
    if (!jwtToken) {
      updateConnectionStatus(ConnectionStatus.DISCONNECTED);
      return;
    }
    
    // Create new socket connection
    updateConnectionStatus(ConnectionStatus.CONNECTING);
    updateSocketError(null);
    
    const newSocket = createSocketClient(jwtToken);
    newSocket.connect();
    updateSocketConnection(newSocket);

    newSocket.on('connect', () => {
      updateConnectionStatus(ConnectionStatus.CONNECTED);
    });

    newSocket.on('disconnect', () => {
      updateConnectionStatus(ConnectionStatus.DISCONNECTED);
    });

    newSocket.on('connect_error', (err) => {
      updateConnectionStatus(ConnectionStatus.ERROR);
      updateSocketError(err);
    });

    return () => {
      newSocket.disconnect();
      updateSocketConnection(null);
      updateConnectionStatus(ConnectionStatus.DISCONNECTED);
    };
  }, [jwtToken]);

  return {
    isConnected: connectionStatus === ConnectionStatus.CONNECTED,
    connectionStatus,
    socket,
    error,
  };
};