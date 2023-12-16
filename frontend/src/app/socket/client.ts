import io from "socket.io-client";
import store from "../store";

interface SocketClientProps {
  api_url?: string;
}

export const createSocketClient = ({
  api_url = import.meta.env.VITE_REACT_APP_URL,
}: SocketClientProps) => {

  const socket = io(api_url, {
    transports: ["websocket"],
    // reconnection: false,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    // rejectUnauthorized: false,
    query: {
      token: store.getState().auth.accessToken,
      userId: store.getState().auth.userId,
    },
  });

  // socket.setMaxListeners(15);
  return socket;
};
