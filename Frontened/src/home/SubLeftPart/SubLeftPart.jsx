import React, { useState } from 'react';
import { MessageCircle, Users, Archive, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import ProfileSection from '../Modal/ProfileSection';
import ProfilePage from '../Modal/ProfileModal';
import Logout from '../LeftPart/Logout';

function SubLeftPart() {
  const [activeTab, setActiveTab] = useState('chats');
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authUser, setAuthUser] = useAuth();

  const menuItems = [
    { id: 'chats', icon: MessageCircle, label: 'Chats', count: 12 },
    { id: 'status', icon: Users, label: 'Status', count: 3 },
    { id: 'archived', icon: Archive, label: 'Archived', count: 0 },
  ];

  const bottomActions = [
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const handleProfileClick = () => {
    setShowProfilePage(true);
  };

  const handleBackFromProfile = () => {
    setShowProfilePage(false);
  };

  const handleProfileUpdate = (newProfilePicture) => {
    // Handle profile picture update - update immediately
    console.log('Profile updated:', newProfilePicture);

    // Update the auth user state immediately for instant reflection
    setAuthUser(prevAuthUser => ({
      ...prevAuthUser,
      user: {
        ...prevAuthUser.user,
        profilePicture: newProfilePicture
      }
    }));

    // Also refresh profile to get latest data from server
    onRefreshProfile();
  };

  const loadUserProfile = async (email) => {
    if (!email) return;

    setIsLoading(true);
    try {
      const userData = await fetchUserProfile(email);
      if (userData) {
        // Update auth user with the profile data
        setAuthUser(prevAuthUser => ({
          ...prevAuthUser,
          user: {
            ...prevAuthUser.user,
            profilePicture: userData.profilePicture,
            fullname: userData.fullname,
            phone: userData.phone,
            bio: userData.bio,
            // Include any other user details you need
          }
        }));
      }
    } catch (error) {
      console.error("Error in loadUserProfile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle hover events for settings
  const handleSettingsMouseEnter = () => {
    setShowSettings(true);
  };

  const handleSettingsMouseLeave = () => {
    setShowSettings(false);
  };

  // If profile page is shown, render it instead of the sidebar
  if (showProfilePage) {
    return (
      <ProfilePage
        authUser={authUser}
        onBack={handleBackFromProfile}
        onUpdate={handleProfileUpdate}
        onRefreshProfile={() => loadUserProfile(authUser?.user?.email)}
      />
    );
  }

  return (

    <div className="w-16 lg:w-20 bg-slate-800 border-r border-slate-700 flex flex-col h-screen">
      {/* Header */}
      <div className="p-3 lg:p-4 border-b border-slate-700">
        <div className="w-8 h-10 lg:w-8 lg:h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <MessageCircle className="w-5 h-5 lg:w-5 lg:h-5 text-white" />
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center p-3 lg:p-4 cursor-pointer transition-all duration-200 hover:bg-slate-700 group ${isActive ? 'bg-slate-700 border-r-2 border-blue-500' : ''
                }`}
              title={item.label}
            >
              <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}>
                <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>

              {/* Badge for count */}
              {item.count > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.count > 99 ? '99+' : item.count}
                </div>
              )}

              {/* Label - hidden on smaller screens */}
              <span className="hidden lg:block text-xs mt-1 text-gray-400 group-hover:text-white transition-colors">
                {item.label}
              </span>

              {/* Hover tooltip for small screens */}
              <div className="lg:hidden absolute left-full ml-2 opacity-0 group-hover:opacity-100 bg-slate-700 text-xs text-white px-2 py-1 rounded-md whitespace-nowrap transform -translate-y-1/2 top-1/2 transition-all duration-300 pointer-events-none">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-slate-700 space-y-1">
        {/* Settings and other actions */}
        {bottomActions.map((action) => {
          const Icon = action.icon;
          const isActive = action.id === 'settings' && showSettings;

          return (
            <div
              key={action.id}
              onMouseEnter={handleSettingsMouseEnter}
              onMouseLeave={handleSettingsMouseLeave}
              className={`relative flex flex-col items-center p-3 lg:p-4 text-gray-400 hover:text-white hover:bg-slate-700 cursor-pointer transition-all duration-200 group ${isActive ? 'bg-slate-700 text-white' : ''}`}
              title={action.label}
            >
              <Icon className="w-5 h-5 lg:w-6 lg:h-6" />

              {/* Label - hidden on smaller screens */}
              <span className="hidden lg:block text-xs mt-1 text-gray-400 group-hover:text-white transition-colors">
                {action.label}
              </span>

              {/* Hover tooltip for small screens */}
              <div className="lg:hidden absolute left-full ml-2 opacity-0 group-hover:opacity-100 bg-slate-700 text-xs text-white px-2 py-1 rounded-md whitespace-nowrap transform -translate-y-1/2 top-1/2 transition-all duration-300 pointer-events-none">
                {action.label}
              </div>

              {/* Settings Panel - Show on hover */}
              {showSettings && action.id === 'settings' && (
                <div className="absolute bottom-0 left-full bg-slate-800 border border-slate-700 rounded-lg shadow-lg ml-2 min-w-64 z-50">
                  <div className="p-2">
                    <div className="text-sm text-gray-300 font-medium px-3 py-2 border-b border-slate-700">
                      Settings
                    </div>
                    {/* Your existing Logout component */}
                    <Logout />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Profile Section */}
        <div className="relative flex flex-col items-center p-3 lg:p-4 transition-all duration-200 hover:bg-slate-700 group">
          <ProfileSection
            isLoading={isLoading}
            profilePicture={authUser?.user?.profilePicture}
            onClick={handleProfileClick}
          />

          {/* Label - hidden on smaller screens */}
          <span className="hidden lg:block text-xs mt-1 text-gray-400 group-hover:text-white transition-colors">
            Profile
          </span>

          {/* Hover tooltip for small screens */}
          <div className="lg:hidden absolute left-full ml-2 opacity-0 group-hover:opacity-100 bg-slate-700 text-xs text-white px-2 py-1 rounded-md whitespace-nowrap transform -translate-y-1/2 top-1/2 transition-all duration-300 pointer-events-none">
            Profile
          </div>
        </div>
      </div>

    </div>

  );
}

export default SubLeftPart;