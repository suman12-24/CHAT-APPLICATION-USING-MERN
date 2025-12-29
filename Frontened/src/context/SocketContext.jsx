import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useAuth } from "./AuthProvider";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [authUser] = useAuth();
  const socketRef = useRef(null);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    // Only create a new socket if we have a user and either no socket exists
    // or the user ID changed
    if (authUser?.user?._id) {
      if (socketRef.current) {
        socketRef.current.close();
      }

      const newSocket = io("http://localhost:3000", {
        query: {
          userId: authUser.user._id,
        },
      });

      // Set the socket reference
      socketRef.current = newSocket;
      setSocket(newSocket);
      
      // Handle socket events
      newSocket.on("connect", () => {
        setConnectionError(null);
      });
      
      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setConnectionError("Failed to connect to server");
      });

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Clean up function
      return () => {
        if (newSocket) {
          newSocket.off("connect");
          newSocket.off("connect_error");
          newSocket.off("getOnlineUsers");
          newSocket.close();
          socketRef.current = null;
        }
      };
    } else {
      // No authenticated user, clean up socket if it exists
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        setSocket(null);
      }
    }
  }, [authUser?.user?._id]); // Only depend on the user ID, not the entire authUser object

  const contextValue = {
    socket,
    onlineUsers,
    connectionError
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};