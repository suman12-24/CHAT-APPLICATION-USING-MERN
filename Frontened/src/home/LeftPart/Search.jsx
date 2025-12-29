import React, { useState, useEffect } from "react";
import useGetAllUsers from "../../context/useGetAllUsers";
import useConversation from "../../zustand/useConversation";
import { useAuth } from "../../context/AuthProvider";
import { fetchUserProfile } from "../Modal/UserService";
import ProfileModal from "../Modal/ProfileModal";
import ProfileSection from "../Modal/ProfileSection";
import SearchBar from "../Modal/Searchbar";

function Search() {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allUsers] = useGetAllUsers();
  const { setSelectedConversation } = useConversation();
  const [authUser, setAuthUser] = useAuth();

  // Fetch user profile details when component mounts
  useEffect(() => {
    if (authUser?.user?.email) {
      loadUserProfile(authUser.user.email);
    }
  }, [authUser?.user?.email]);

  const loadUserProfile = async (email) => {
    if (!email) return;

    setIsLoading(true);
    try {
      const userData = await fetchUserProfile(email);
      if (userData) {
        // Update auth user with the profile data
        setAuthUser({
          ...authUser,
          user: {
            ...authUser.user,
            profilePicture: userData.profilePicture,
            fullname: userData.fullname,
            // Include any other user details you need
          }
        });
      }
    } catch (error) {
      console.error("Error in loadUserProfile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleProfileUpdate = (profilePicture) => {
    setAuthUser({
      ...authUser,
      user: {
        ...authUser.user,
        profilePicture
      }
    });
    setShowModal(false);
  };

  const handleSearchSubmit = (searchTerm) => {
    if (!searchTerm) return;

    const conversation = allUsers.find((user) =>
      user.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (conversation) {
      setSelectedConversation(conversation);
      return true; // Search successful
    }
    return false; // User not found
  };

  return (
    <div className="px-3 py-3 md:py-3 lg:py-3 bg-slate-800 shadow-md border-b border-gray-700">
      <div className="flex items-center justify-between max-w-6xl mx-auto h-10">
        <SearchBar onSubmit={handleSearchSubmit} />

        {/* <ProfileSection
          isLoading={isLoading}
          profilePicture={authUser?.user?.profilePicture}
          onClick={handleProfileClick}
        /> */}
      </div>

      {/* {showModal && (
        <ProfileModal
          show={showModal}
          onClose={handleCloseModal}
          onUpdate={handleProfileUpdate}
          currentProfilePicture={authUser?.user?.profilePicture}
          userEmail={authUser?.user?.email}
          userName={authUser?.user?.fullname}
          onRefreshProfile={() => loadUserProfile(authUser?.user?.email)}
        />
      )} */}
    </div>
  );
}

export default Search;
