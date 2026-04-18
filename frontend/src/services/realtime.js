import { io } from 'socket.io-client';

const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:4000';

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket'],
    });
  }

  return socket;
}

export function connectSession(sessionId) {
  const liveSocket = getSocket();
  if (!liveSocket.connected) {
    liveSocket.connect();
  }
  if (sessionId) {
    liveSocket.emit('join-session', { sessionId });
  }
  return liveSocket;
}

export function disconnectSession(sessionId) {
  const liveSocket = getSocket();
  if (sessionId) {
    liveSocket.emit('leave-session', { sessionId });
  }
  liveSocket.disconnect();
}
