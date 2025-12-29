import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

function ProfileSection({ isLoading, profilePicture, onClick }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // Reset image error when profilePicture changes
  useEffect(() => {
    if (profilePicture) {
      setImageError(false);
      setImageLoading(true);
    }
  }, [profilePicture]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = (e) => {
    setImageLoading(false);
    setImageError(true);
    console.error("Failed to load profile image");
  };
  return (
    <div className="flex items-center ml-2">
      <div
        className="relative cursor-pointer group"
        onClick={onClick}
      >
        {isLoading ? (
          <div className="p-1.5 rounded-full bg-slate-700 border border-gray-600 flex items-center justify-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
              <span className="inline-block w-6 h-6 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></span>
            </div>
          </div>
        ) : (
          <div className="p-1 rounded-full bg-slate-700 border border-gray-600 group-hover:border-indigo-400 transition-colors duration-300">
            {profilePicture && !imageError ? (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                <img
                  src={profilePicture}
                  alt="Profile"
                  className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: imageLoading ? 'none' : 'block' }}
                />
              </div>
            ) : (
              <FaUserCircle className="text-2xl sm:text-3xl text-gray-200 group-hover:text-white" />
            )}
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
          </div>
        )}
        <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 bg-slate-700 text-xs text-white px-2 py-1 rounded-md whitespace-nowrap transform translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          {profilePicture && !imageError ? "Change Photo" : "Add Photo"}
        </div>
      </div>
    </div>
  );
}

export default ProfileSection;