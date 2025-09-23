import { io } from 'socket.io-client';

export const createSocketClient = (jwtToken: string) => {
  return io('http://localhost:3000', {
    autoConnect: false,
    auth: {
      token: jwtToken,
    },
  });
};
