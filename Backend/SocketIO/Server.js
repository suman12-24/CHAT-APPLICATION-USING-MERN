// server.js
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Store active user connections
const users = {};

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
});

// Function to get receiver's socket ID
export const getReceiverSocketId = (receiverId) => {
  return users[receiverId];
};

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  
  // Get user ID from handshake query
  const userId = socket.handshake.query.userId;
  
  if (userId) {
    // Store user's socket ID
    users[userId] = socket.id;
    console.log("User connected:", userId);
    
    // Broadcast online users to all clients
    io.emit("getOnlineUsers", Object.keys(users));
  }

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    
    // Find and remove the disconnected user
    if (userId) {
      delete users[userId];
      // Update online users list for all clients
      io.emit("getOnlineUsers", Object.keys(users));
    }
  });
});

export { app, io, server };
