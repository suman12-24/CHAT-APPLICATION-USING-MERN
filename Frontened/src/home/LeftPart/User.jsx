import React, { useState, useEffect } from "react";
import useConversation from "../../zustand/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import defaultProfile from "../../../public/user.jpg";

function User({ user }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === user._id;
  const { socket, onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(user._id);
  const [animate, setAnimate] = useState(false);
  const [hover, setHover] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Animation on mount
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Handle click animation
  const handleClick = () => {
    setAnimate(false);
    setTimeout(() => {
      setAnimate(true);
      setSelectedConversation(user);
    }, 100);
  };

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  // Get user profile image from user object or use default
  // Using profilePhoto field from API response and prepending server URL if needed
  const getProfileImage = () => {
    if (imageError || !user.profilePhoto) {
      return defaultProfile;
    }
    // If the path is relative, prepend with server URL
    // Adjust the baseURL according to your API server address
    const baseURL = "http://localhost:3000/"; // Change this if your API is on a different domain
    return user.profilePhoto.startsWith("http") ? user.profilePhoto : `${baseURL}${user.profilePhoto}`;
  };

  return (
    <div
      className={`relative transform transition-all duration-300 rounded-lg mx-2 my-1 overflow-hidden
      ${animate ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-70"}
      ${isSelected ? "bg-blue-600 shadow-lg shadow-blue-500/30" : "bg-slate-700/50"}
      ${hover ? "scale-102" : "scale-100"}
      `}
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Background pulse animation for online users */}
      {isOnline && (
        <div className="absolute inset-0 bg-green-500/5 z-0">
          <div className={`absolute inset-0 bg-green-400/10 rounded-lg animate-pulse`}></div>
        </div>
      )}

      <div className="relative z-10 flex items-center space-x-4 px-6 py-3">
        <div className={`relative`}>
          {/* Avatar container with custom animation */}
          <div className={`w-12 h-12 rounded-full transform transition-all duration-300 ${hover ? "scale-110" : "scale-100"}`}>
            <img
              src={getProfileImage()}
              className="w-full h-full rounded-full object-cover border-2 shadow-md shadow-black/20
              transition-all duration-300 ease-in-out
              hover:shadow-lg
              transform"
              onError={handleImageError}
              alt={`${user.fullname}'s profile picture`}
            />

            {/* Online indicator with pulse animation */}
            {isOnline && (
              <div className="absolute bottom-0 right-0">
                <span className="flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={`flex flex-col transition-all duration-300 ${hover ? "translate-x-1" : ""}`}>
          <h1 className={`font-bold text-lg transition-all duration-300 ${isSelected ? "text-white" : "text-slate-200"}`}>
            {user.fullname}
          </h1>
          <span className={`text-sm transition-all duration-300 ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
            {user.phone || "No phone number"}
          </span>
        </div>

        {/* Subtle indicator arrow on hover */}
        <div className={`ml-auto transform transition-all duration-300 ${hover ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Bottom border animation on hover */}
      <div className={`h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform transition-all duration-300 origin-left ${hover ? "scale-x-100" : "scale-x-0"}`}></div>
    </div>
  );
}

export default User;

