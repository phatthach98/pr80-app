import { createSocketClient } from '@/api/socket-client';
import { useEffect, useRef } from 'react';
import {
  ConnectionStatus,
  updateConnectionStatus,
  updateSocketConnection,
  updateSocketError,
} from '@/store/socket.store';
import { authLocalStorageUtil } from '@/utils/auth-local-storage.util';
import { Socket } from 'socket.io-client';

export const useSocketConnection = () => {
  const { current: socket } = useRef<Socket>(
    createSocketClient(authLocalStorageUtil.getToken() || ''),
  );

  const startConnectionListener = () => {
    socket.on('connect', () => {
      updateConnectionStatus(ConnectionStatus.CONNECTED);
    });

    socket.on('disconnect', () => {
      updateConnectionStatus(ConnectionStatus.DISCONNECTED);
    });

    socket.on('connect_error', (err) => {
      updateConnectionStatus(ConnectionStatus.ERROR);
      updateSocketError(err);
      setTimeout(() => {
        socket.auth = {
          token: authLocalStorageUtil.getToken() || '',
        };
        socket.connect();
      }, 2000);
    });
  };

  useEffect(() => {
    updateConnectionStatus(ConnectionStatus.CONNECTING);
    startConnectionListener();
    socket.connect();
    updateSocketConnection(socket);
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  return socket;
};
