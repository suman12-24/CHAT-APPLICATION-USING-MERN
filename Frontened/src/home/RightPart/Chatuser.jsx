import React, { useState } from "react";
import useConversation from "../../zustand/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import { IoIosArrowBack } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import defaultProfile from "../../../public/user.jpg";

function Chatuser() {
  const { selectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();
  const [imageError, setImageError] = useState(false);

  const isUserOnline = onlineUsers.includes(selectedConversation._id);

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  // Get user profile image from user object or use default
  // Using profilePhoto field from API response and prepending server URL if needed
  const getProfileImage = () => {
    if (imageError || !selectedConversation.profilePhoto) {
      return defaultProfile;
    }
    // If the path is relative, prepend with server URL
    // Adjust the baseURL according to your API server address
    const baseURL = "http://localhost:3000/"; // Change this if your API is on a different domain
    return selectedConversation.profilePhoto.startsWith("http")
      ? selectedConversation.profilePhoto
      : `${baseURL}${selectedConversation.profilePhoto}`;
  };

  return (
    <div className="relative flex items-center h-16 px-4 bg-gradient-to-r from-slate-800 to-slate-700 shadow-lg">
      {/* Mobile Menu Button */}
      <label
        htmlFor="my-drawer-2"
        className="btn btn-ghost btn-circle drawer-button lg:hidden"
      >
        <IoIosArrowBack className="text-white text-xl" />
      </label>

      {/* User Info */}
      <div className="flex items-center flex-1">
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-400 shadow-md">
            <img
              src={getProfileImage()}
              alt={selectedConversation.fullname}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>
          {isUserOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
          )}
        </div>

        <div className="ml-3">
          <h1 className="font-bold text-white">{selectedConversation.fullname}</h1>
          <div className="flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isUserOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            <span className="text-xs text-gray-300">
              {isUserOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button className="btn btn-circle btn-sm bg-blue-500 hover:bg-blue-600 border-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
        <button className="btn btn-circle btn-sm bg-slate-600 hover:bg-slate-500 border-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button className="btn btn-circle btn-sm bg-slate-600 hover:bg-slate-500 border-none">
          <BsThreeDotsVertical className="text-white" />
        </button>
      </div>
    </div>
  );
}

export default Chatuser;