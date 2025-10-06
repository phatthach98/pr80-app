import { io } from 'socket.io-client';

export const createSocketClient = (jwtToken: string) => {
  return io(import.meta.env.PUBLIC_API_BASE_URL, {
    autoConnect: false,
    auth: {
      token: jwtToken,
    },
    transports: ['websocket'],
  });
};
