import React, { useState } from "react";
import { BiLogOutCircle } from "react-icons/bi";
import { FiAlertTriangle } from "react-icons/fi";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";


function Logout() {
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const initiateLogout = () => {
    setShowWarning(true);
  };

  const cancelLogout = () => {
    setShowWarning(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/user/logout");
      localStorage.removeItem("ChatApp");
      Cookies.remove("jwt");
      toast.success("Logged out successfully");
      window.location.reload();
    } catch (error) {
      console.log("Error in Logout", error);
      toast.error("Error in logging out");
    } finally {
      setLoading(false);
      setShowWarning(false);
    }
  };

  return (
    <div className="logout-container w-20">
      <hr className="border-gray-700 my-2" />
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={initiateLogout}
            disabled={loading}
            className="flex items-center gap-2 bg-transparent hover:bg-gray-700 text-white font-medium rounded-lg px-4 py-2 transition-all duration-300 ease-in-out"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Logout"
          >
            <BiLogOutCircle className={`text-xl ${isHovered ? 'text-red-400' : 'text-white'}`} />
            <span className="hidden sm:inline">
              {loading ? "Logging out..." : "Logout"}
            </span>
            {loading && (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin ml-1"></div>
            )}
          </button>
        </div>
        <div className="text-xs text-gray-400 hidden sm:block">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Logout Warning Modal - Left Aligned */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-start z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-lg max-w-md w-full ml-4 p-6 border border-gray-700">
            <div className="flex items-center text-amber-500 mb-4">
              <FiAlertTriangle className="text-2xl mr-2" />
              <h3 className="text-lg font-semibold">Confirm Logout</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to log out? You will need to sign in again to access your account.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-transparent hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Logging out...
                  </>
                ) : (
                  "Yes, Log Out"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Logout;