import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import { FaMicrophone } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import useSendMessage from "../../context/useSendMessage.js";

function Typesend() {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { loading, sendMessages } = useSendMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      await sendMessages(message);
      setMessage("");
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implementation for voice recording would go here
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-lg h-[8vh] border border-gray-700">
        {/* Left side - attachment icon */}
        <div className="flex-none hidden sm:block">
          <button
            type="button"
            className="text-gray-400 hover:text-blue-400 transition-colors duration-200 p-2 rounded-full hover:bg-gray-700"
            aria-label="Add attachment"
          >
            <FaImage className="text-lg" />
          </button>
        </div>

        {/* Input field - grows to fill available space */}
        <div className="flex-grow mx-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 rounded-full outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 border border-gray-600"
          />
        </div>

        {/* Right side - voice recording and send buttons */}
        <div className="flex-none flex items-center space-x-2">
          <button
            type="button"
            className={`p-2 rounded-full transition-colors duration-200 ${isRecording
              ? "bg-red-500 text-white animate-pulse"
              : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-200"
              }`}
            onClick={toggleRecording}
            aria-label={isRecording ? "Stop recording" : "Start voice recording"}
          >
            <FaMicrophone className="text-lg" />
          </button>

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className={`p-3 rounded-full transition-all duration-200 ${message.trim()
              ? "bg-blue-600 hover:bg-blue-500 text-white transform hover:scale-105"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            aria-label="Send message"
          >
            <IoSend className={`text-xl ${loading ? "animate-pulse" : ""}`} />
          </button>
        </div>
      </div>
    </form>
  );
}

export default Typesend;