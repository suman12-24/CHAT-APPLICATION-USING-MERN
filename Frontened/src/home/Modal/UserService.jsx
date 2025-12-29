import axios from "axios";
import toast from "react-hot-toast";

// Base URL for the server - update this with your actual server URL
const SERVER_BASE_URL = "http://localhost:3000";

export const getProfileImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Handle relative paths
  return `${SERVER_BASE_URL}/${imagePath}`;
};


export const fetchUserProfile = async (email) => {
  if (!email) return null;

  try {
    const response = await axios.get(`/api/user/getDetails/${encodeURIComponent(email)}`);

    if (response.data.success && response.data.user) {
      // Get the full profile image URL
      const profilePicture = getProfileImageUrl(response.data.user.profilePhoto);

      return {
        profilePicture,
        fullname: response.data.user.fullname,
        // Include any other user details you need
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    toast.error("Failed to load profile information", {
      style: {
        background: "#1e293b",
        color: "#fff",
        borderRadius: "8px",
      },
    });
    return null;
  }
};

export const uploadProfilePicture = async (profileImage, email) => {
  if (!profileImage || !email) {
    return {
      success: false,
      message: "Missing required information"
    };
  }

  try {
    // Create FormData object to send the file
    const formData = new FormData();
    formData.append("profilePicture", profileImage);
    formData.append("email", email);

    // Make the API call using axios
    const response = await axios.post("/api/user/upload-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Handle success
    if (response?.data?.message === "Profile picture uploaded successfully") {
      return {
        success: true,
        message: "Profile picture uploaded successfully",
        profilePicture: response.data.profilePicture ?
          getProfileImageUrl(response.data.profilePicture) : null
      };
    } else {
      return {
        success: false,
        message: response?.data?.message || "Failed to upload profile picture"
      };
    }
  } catch (error) {
    console.error("Error uploading profile picture:", error);

    return {
      success: false,
      message: error.response?.data?.message || "Failed to upload profile picture"
    };
  }
};

export const updateUserName = async (newFullname, phoneNo, bio, email) => {
  if (!email || !newFullname || !phoneNo || !bio) {
    return {
      success: false,
      message: "Email and full name are required."
    };
  }

  try {
    const response = await axios.put("/api/user/update-Fullname", {
      email,
      fullname: newFullname,
      phone: phoneNo,
      bio: bio

    });
    console.log("res", response?.data);

    if (response.data.message === "Full name updated successfully") {
      return {
        success: true,
        user: response.data.user,
        message: "Details updated successfully"
      };
    } else {
      return {
        success: false,
        message: "Failed to update Details."
      };
    }
  } catch (error) {
    console.error("Error updating Details:", error);
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred while updating full name."
    };
  }
};


