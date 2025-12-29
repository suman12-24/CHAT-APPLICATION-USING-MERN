import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaCamera, FaEdit, FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import { uploadProfilePicture, updateUserName } from "../Modal/UserService";

function ProfilePage({
    authUser,
    onBack,
    onUpdate,
    onRefreshProfile}) {
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Name state
    const [name, setName] = useState("");
    const [isNameEditing, setIsNameEditing] = useState(false);
    const [isNameUpdating, setIsNameUpdating] = useState(false);

    // Phone state
    const [phone, setPhone] = useState("");
    const [isPhoneEditing, setIsPhoneEditing] = useState(false);
    const [isPhoneUpdating, setIsPhoneUpdating] = useState(false);

    // Bio state
    const [bio, setBio] = useState("");
    const [isBioEditing, setIsBioEditing] = useState(false);
    const [isBioUpdating, setIsBioUpdating] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        // Initialize state with current user data
        if (authUser?.user) {
            setName(authUser.user.fullname || "");
            setPhone(authUser.user.phone || "");
            setBio(authUser.user.bio || "Hey there! I am using this chat app.");
        }
    }, [authUser]);

    // Clean up preview URL when component unmounts
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            if (!file.type.match('image.*')) {
                toast.error("Please select an image file", {
                    style: {
                        background: "#1e293b",
                        color: "#fff",
                        borderRadius: "8px",
                    },
                });
                return;
            }

            // Check file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB", {
                    style: {
                        background: "#1e293b",
                        color: "#fff",
                        borderRadius: "8px",
                    },
                });
                return;
            }

            setProfileImage(file);

            // Create a preview URL
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // Name handlers
    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleNameEditToggle = () => {
        setIsNameEditing(!isNameEditing);
        if (isNameEditing) {
            setName(authUser?.user?.fullname || "");
        }
    };

    const handleNameUpdate = async () => {
        if (!name.trim()) {
            toast.error("Name cannot be empty", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
            return;
        }

        if (!phone.trim()) {
            toast.error("Phone number cannot be empty", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
            return;
        }

        if (!bio.trim()) {
            toast.error("Bio cannot be empty", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
            return;
        }

        // Basic phone validation (at least 10 digits)
        const phoneDigits = phone.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
            toast.error("Please enter a valid phone number", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
            return;
        }

        if (bio.length > 139) {
            toast.error("Bio must be 139 characters or less", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
            return;
        }

        setIsNameUpdating(true);

        try {
            const result = await updateUserName(name, phone, bio, authUser?.user?.email);

            if (result.success) {
                toast.success(result.message || "Details updated successfully!", {
                    style: {
                        background: "#1e293b",
                        color: "#fff",
                        borderRadius: "8px",
                    },
                    icon: "✅",
                });

                setIsNameEditing(false);
                onRefreshProfile();
            } else {
                throw new Error(result.message || "Failed to update details");
            }
        } catch (error) {
            console.error("Error updating details:", error);
            toast.error(error.message || "Failed to update details", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
        } finally {
            setIsNameUpdating(false);
        }
    };

    // Phone handlers
    const handlePhoneChange = (e) => {
        // Only allow numbers, spaces, +, -, (, )
        const value = e.target.value.replace(/[^0-9+\-\s()]/g, '');
        setPhone(value);
    };

    const handlePhoneEditToggle = () => {
        setIsPhoneEditing(!isPhoneEditing);
        if (isPhoneEditing) {
            setPhone(authUser?.user?.phone || "");
        }
    };

    const handlePhoneUpdate = async () => {
        if (!name.trim()) {
            toast.error("Name cannot be empty", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
            return;
        }

        if (!phone.trim()) {
            toast.error("Phone number cannot be empty", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
            return;
        }

        if (!bio.trim()) {
            toast.error("Bio cannot be empty", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
            return;
        }

        // Basic phone validation (at least 10 digits)
        const phoneDigits = phone.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
            toast.error("Please enter a valid phone number", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
            return;
        }

        if (bio.length > 139) {
            toast.error("Bio must be 139 characters or less", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
            return;
        }

        setIsPhoneUpdating(true);

        try {
            const result = await updateUserName(name, phone, bio, authUser?.user?.email);

            if (result.success) {
                toast.success(result.message || "Details updated successfully!", {
                    style: {
                        background: "#1e293b",
                        color: "#fff",
                        borderRadius: "8px",
                    },
                    icon: "✅",
                });

                setIsPhoneEditing(false);
                onRefreshProfile();
            } else {
                throw new Error(result.message || "Failed to update details");
            }
        } catch (error) {
            console.error("Error updating details:", error);
            toast.error(error.message || "Failed to update details", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
        } finally {
            setIsPhoneUpdating(false);
        }
    };

    // Bio handlers
    const handleBioChange = (e) => {
        setBio(e.target.value);
    };

    const handleBioEditToggle = () => {
        setIsBioEditing(!isBioEditing);
        if (isBioEditing) {
            setBio(authUser?.user?.bio || "Hey there! I am using this chat app.");
        }
    };

    const handleBioUpdate = async () => {
        if (!name.trim()) {
            toast.error("Name cannot be empty", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
            return;
        }

        if (!phone.trim()) {
            toast.error("Phone number cannot be empty", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
            return;
        }

        if (!bio.trim()) {
            toast.error("Bio cannot be empty", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
            return;
        }

        // Basic phone validation (at least 10 digits)
        const phoneDigits = phone.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
            toast.error("Please enter a valid phone number", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
            return;
        }

        if (bio.length > 139) {
            toast.error("Bio must be 139 characters or less", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
            return;
        }

        setIsBioUpdating(true);

        try {
            const result = await updateUserName(name, phone, bio, authUser?.user?.email);

            if (result.success) {
                toast.success(result.message || "Details updated successfully!", {
                    style: {
                        background: "#1e293b",
                        color: "#fff",
                        borderRadius: "8px",
                    },
                    icon: "✅",
                });

                setIsBioEditing(false);
                onRefreshProfile();
            } else {
                throw new Error(result.message || "Failed to update details");
            }
        } catch (error) {
            console.error("Error updating details:", error);
            toast.error(error.message || "Failed to update details", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
        } finally {
            setIsBioUpdating(false);
        }
    };

    const handleProfilePictureUpdate = async () => {
        if (!profileImage) {
            toast.error("Please select an image first", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
            return;
        }

        setIsUploading(true);

        try {
            const result = await uploadProfilePicture(profileImage, authUser?.user?.email);

            if (result.success) {
                toast.success("Profile picture updated successfully!", {
                    style: {
                        background: "#1e293b",
                        color: "#fff",
                        borderRadius: "8px",
                    },
                    icon: "✅",
                });

                // Update the profile picture immediately in the auth context
                if (result.profilePicture) {
                    // Update auth user state immediately
                    onUpdate(result.profilePicture);

                    // Also update the auth context directly for instant reflection
                    const updatedAuthUser = {
                        ...authUser,
                        user: {
                            ...authUser.user,
                            profilePicture: result.profilePicture
                        }
                    };

                    // This should trigger the parent component to update
                    onRefreshProfile(updatedAuthUser);
                }

                // Clear the preview states AFTER successful update
                setProfileImage(null);
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                }
                setPreviewUrl(null);
            } else {
                throw new Error(result.message || "Failed to upload profile picture");
            }
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            toast.error(error.message || "Failed to upload profile picture", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                },
            });
        } finally {
            setIsUploading(false);
        }
    };



    return (
        <div className="h-full bg-slate-900 flex flex-col">
            {/* Header */}
            <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center">
                <button
                    onClick={onBack}
                    className="text-gray-400 hover:text-white transition-colors mr-4"
                >
                    <FaArrowLeft className="text-xl" />
                </button>
                <h1 className="text-xl font-semibold text-white">Profile</h1>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-40 h-40 rounded-full bg-slate-700 border-2 border-gray-600 overflow-hidden flex items-center justify-center relative mb-4">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : authUser?.user?.profilePicture ? (
                                <img
                                    src={authUser.user.profilePicture}
                                    alt="Current Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "";
                                        console.error("Failed to load profile image");
                                    }}
                                />
                            ) : (
                                <FaUserCircle className="text-8xl text-gray-400" />
                            )}

                            <div
                                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={triggerFileInput}
                            >
                                <FaCamera className="text-white text-2xl" />
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />

                        <button
                            type="button"
                            onClick={triggerFileInput}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors mb-4 flex items-center"
                        >
                            <FaCamera className="mr-2" /> Change Photo
                        </button>

                        {profileImage && (
                            <div className="text-center mb-4">
                                <p className="text-sm text-gray-400 mb-2">
                                    Selected: {profileImage.name} ({(profileImage.size / 1024).toFixed(1)} KB)
                                </p>
                                <button
                                    onClick={handleProfilePictureUpdate}
                                    disabled={isUploading}
                                    className={`px-4 py-2 rounded-lg transition-colors flex items-center ${isUploading
                                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-500 text-white"
                                        }`}
                                >
                                    {isUploading ? (
                                        <>
                                            <span className="mr-2 inline-block w-4 h-4 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin"></span>
                                            Uploading...
                                        </>
                                    ) : (
                                        "Save Photo"
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Profile Information */}
                    <div className="max-w-md mx-auto space-y-6">
                        {/* Name Section */}
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-gray-300">Name</label>
                                {!isNameEditing && (
                                    <button
                                        onClick={handleNameEditToggle}
                                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                                    >
                                        <FaEdit className="mr-1" /> Edit
                                    </button>
                                )}
                            </div>

                            {isNameEditing ? (
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={handleNameChange}
                                        className="flex-1 px-3 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your name"
                                        autoFocus
                                    />
                                    <div className="flex ml-2">
                                        <button
                                            onClick={handleNameUpdate}
                                            disabled={isNameUpdating}
                                            className={`p-2 rounded-lg ${isNameUpdating
                                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-500 text-white"
                                                }`}
                                        >
                                            {isNameUpdating ? (
                                                <span className="inline-block w-4 h-4 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin"></span>
                                            ) : (
                                                "✓"
                                            )}
                                        </button>
                                        <button
                                            onClick={handleNameEditToggle}
                                            disabled={isNameUpdating}
                                            className="p-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white ml-1"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="px-3 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white">
                                    {name || "Not set"}
                                </div>
                            )}
                        </div>

                        {/* Phone Section */}
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-gray-300">Phone Number</label>
                                {!isPhoneEditing && (
                                    <button
                                        onClick={handlePhoneEditToggle}
                                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                                    >
                                        <FaEdit className="mr-1" /> Edit
                                    </button>
                                )}
                            </div>

                            {isPhoneEditing ? (
                                <div className="flex items-center">
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        className="flex-1 px-3 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your phone number"
                                        autoFocus
                                    />
                                    <div className="flex ml-2">
                                        <button
                                            onClick={handlePhoneUpdate}
                                            disabled={isPhoneUpdating}
                                            className={`p-2 rounded-lg ${isPhoneUpdating
                                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-500 text-white"
                                                }`}
                                        >
                                            {isPhoneUpdating ? (
                                                <span className="inline-block w-4 h-4 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin"></span>
                                            ) : (
                                                "✓"
                                            )}
                                        </button>
                                        <button
                                            onClick={handlePhoneEditToggle}
                                            disabled={isPhoneUpdating}
                                            className="p-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white ml-1"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="px-3 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white">
                                    {phone || "Not set"}
                                </div>
                            )}
                        </div>

                        {/* Email Section (Read-only) */}
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                            <label className="text-sm font-medium text-gray-300 block mb-3">Email</label>
                            <div className="px-3 py-2 bg-slate-700 border border-gray-600 rounded-lg text-gray-400">
                                {authUser?.user?.email || "Not available"}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>

                        {/* Bio Section */}
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-gray-300">Bio</label>
                                {!isBioEditing && (
                                    <button
                                        onClick={handleBioEditToggle}
                                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                                    >
                                        <FaEdit className="mr-1" /> Edit
                                    </button>
                                )}
                            </div>

                            {isBioEditing ? (
                                <div>
                                    <textarea
                                        value={bio}
                                        onChange={handleBioChange}
                                        className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        placeholder="Tell us about yourself..."
                                        rows="3"
                                        maxLength="139"
                                        autoFocus
                                    />
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-gray-400">
                                            {bio.length}/139 characters
                                        </span>
                                        <div className="flex">
                                            <button
                                                onClick={handleBioUpdate}
                                                disabled={isBioUpdating}
                                                className={`p-2 rounded-lg ${isBioUpdating
                                                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                                    : "bg-green-600 hover:bg-green-500 text-white"
                                                    }`}
                                            >
                                                {isBioUpdating ? (
                                                    <span className="inline-block w-4 h-4 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin"></span>
                                                ) : (
                                                    "✓"
                                                )}
                                            </button>
                                            <button
                                                onClick={handleBioEditToggle}
                                                disabled={isBioUpdating}
                                                className="p-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white ml-1"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="px-3 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white min-h-[4rem] flex items-start">
                                    <span className="whitespace-pre-wrap">
                                        {bio || "Hey there! I am using this chat app."}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;