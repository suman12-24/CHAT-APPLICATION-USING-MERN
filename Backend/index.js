import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { app, server } from "./SocketIO/server.js";

import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";

// Load environment variables
dotenv.config();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);
app.use("/uploads", express.static("uploads"));

// Environment variables
const PORT = process.env.PORT || 4001;
const URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start server after successful DB connection
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Handle server shutdown gracefully
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown() {
  console.log('Gracefully shutting down...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });

  // Force close if graceful shutdown fails
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);

  }, 10000);
}