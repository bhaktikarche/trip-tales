import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

let socket = null;

export const connectSocket = (userId) => {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    autoConnect: true,
    auth: { userId }
  });

  socket.on("connect", () => {
    console.log("✅ Connected to server");
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔴 Disconnected:", reason);
  });

  return socket;
};

export const joinChat = (chatId, userId) => {
  if (!socket || !socket.connected) {
    console.error("Socket not connected");
    return;
  }
  
  console.log(`🟢 User ${userId} joining chat ${chatId}`);
  socket.emit("joinChat", { chatId, userId });
};

export const sendMessage = (chatId, senderId, body) => {
  if (!socket || !socket.connected) {
    console.error("Socket not connected");
    return;
  }
  
  console.log(`📨 Sending message: ${body} in chat ${chatId}`);
  socket.emit("sendMessage", { chatId, senderId, body });
};

export const receiveMessage = (callback) => {
  if (!socket) return;
  socket.on("receiveMessage", callback);
};

export const getChatHistory = (callback) => {
  if (!socket) return;
  socket.on("chatHistory", callback);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const removeAllListeners = () => {
  if (socket) {
    socket.removeAllListeners();
  }
};

export default socket;