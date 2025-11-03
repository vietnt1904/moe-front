import { io } from "socket.io-client";
import { baseURL } from "../constants";

const socket = io(baseURL, {
  autoConnect: true,
  transports: ["websocket"],
});

export default socket;
