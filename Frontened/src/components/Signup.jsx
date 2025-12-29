import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function Signup() {
  const [authUser, setAuthUser] = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange", // Enable real-time validation
  });

  // Watch the password field for confirm password validation
  const password = watch("password", "");

  // Validation functions
  const validateFullname = (value) => {
    if (!value) return "Full name is required";
    if (value.length < 2) return "Full name must be at least 2 characters";
    if (value.length > 50) return "Full name must be less than 50 characters";
    if (!/^[a-zA-Z\s]+$/.test(value)) return "Full name should only contain letters and spaces";
    return true;
  };

  const validateEmail = (value) => {
    if (!value) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return true;
  };

  const validatePhone = (value) => {
    if (!value) return "Phone number is required";
    // Remove any spaces, dashes, or parentheses
    const cleanPhone = value.replace(/[\s\-\(\)]/g, '');

    // Check if it's exactly 10 digits
    if (!/^\d{10}$/.test(cleanPhone)) {
      return "Phone number must be exactly 10 digits";
    }

    // Check if it starts with 6, 7, 8, or 9
    const firstDigit = cleanPhone.charAt(0);
    if (!['6', '7', '8', '9'].includes(firstDigit)) {
      return "Phone number must start with 6-9";
    }

    return true;
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters long";
    if (value.length > 50) return "Password must be less than 50 characters";
    return true;
  };

  const validatePasswordMatch = (value) => {
    if (!value) return "Please confirm your password";
    return value === password || "Passwords do not match";
  };

  const onSubmit = async (data) => {
    const userInfo = {
      fullname: data.fullname.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.replace(/[\s\-\(\)]/g, ''), // Clean phone number
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    try {
      const response = await axios.post("/api/user/signup", userInfo);
      if (response.data) {
        toast.success("Signup successful");
        localStorage.setItem("ChatApp", JSON.stringify(response.data));
        setAuthUser(response.data);
      }
    } catch (error) {
      if (error.response) {
        toast.error("Error: " + error.response.data.error);
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-white px-6 py-2 rounded-md space-y-3 w-96"
        >
          <h1 className="text-2xl text-center">
            Chat<span className="text-green-500 font-semibold">App</span>
          </h1>
          <h2 className="text-xl text-white font-bold">Signup</h2>
          <br />

          {/* Fullname */}
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Full Name"
              {...register("fullname", {
                validate: validateFullname
              })}
            />
          </label>
          {errors.fullname && (
            <span className="text-red-500 text-sm font-semibold">
              {errors.fullname.message}
            </span>
          )}

          {/* Email */}
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.020.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="email"
              className="grow"
              placeholder="Email"
              inputMode="email"
              {...register("email", {
                validate: validateEmail
              })}
            />
          </label>
          {errors.email && (
            <span className="text-red-500 text-sm font-semibold">
              {errors.email.message}
            </span>
          )}

          {/* Phone no */}
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122L9.98 10.8a.678.678 0 0 1-.725-.332 5.612 5.612 0 0 1-.632-2.775.678.678 0 0 1 .178-.643l1.315-1.315a.678.678 0 0 0 .122-.58L8.444 2.847a.678.678 0 0 0-1.015-.063L6.393 3.82a.678.678 0 0 0-.18.643 5.612 5.612 0 0 1-.632 2.775.678.678 0 0 1-.725.332L2.05 6.735a.678.678 0 0 0-.58.122L3.654 1.328Z" />
            </svg>
            <input
              type="tel"
              className="grow"
              maxLength={10}
              inputMode="numeric"
              placeholder="Phone Number (10 digits)"
              {...register("phone", {
                validate: validatePhone
              })}
            />
          </label>
          {errors.phone && (
            <span className="text-red-500 text-sm font-semibold">
              {errors.phone.message}
            </span>
          )}

          {/* Password */}
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              className="grow"
              placeholder="Password (min 6 characters)"
              {...register("password", {
                validate: validatePassword
              })}
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm p-1 min-h-0 h-auto"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l10.5 10.5a.75.75 0 1 0 1.06-1.06l-1.322-1.323a7.012 7.012 0 0 0 2.16-3.11.87.87 0 0 0 0-.567A7.003 7.003 0 0 0 4.82 3.76l-1.54-1.54Zm3.196 3.195 1.135 1.136A1.502 1.502 0 0 1 9.45 8.389l1.136 1.135a3 3 0 0 0-4.109-4.109Z"
                    clipRule="evenodd"
                  />
                  <path d="m7.812 10.994 1.816 1.816A7.003 7.003 0 0 1 1.38 8.28a.87.87 0 0 1 0-.566 6.985 6.985 0 0 1 1.113-2.039l2.513 2.513a3 3 0 0 0 2.806 2.806Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                  <path
                    fillRule="evenodd"
                    d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </label>
          {errors.password && (
            <span className="text-red-500 text-sm font-semibold">
              {errors.password.message}
            </span>
          )}

          {/* Confirm Password */}
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="grow"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                validate: validatePasswordMatch,
              })}
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm p-1 min-h-0 h-auto"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l10.5 10.5a.75.75 0 1 0 1.06-1.06l-1.322-1.323a7.012 7.012 0 0 0 2.16-3.11.87.87 0 0 0 0-.567A7.003 7.003 0 0 0 4.82 3.76l-1.54-1.54Zm3.196 3.195 1.135 1.136A1.502 1.502 0 0 1 9.45 8.389l1.136 1.135a3 3 0 0 0-4.109-4.109Z"
                    clipRule="evenodd"
                  />
                  <path d="m7.812 10.994 1.816 1.816A7.003 7.003 0 0 1 1.38 8.28a.87.87 0 0 1 0-.566 6.985 6.985 0 0 1 1.113-2.039l2.513 2.513a3 3 0 0 0 2.806 2.806Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                  <path
                    fillRule="evenodd"
                    d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </label>
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm font-semibold">
              {errors.confirmPassword.message}
            </span>
          )}

          {/* Text & Button */}
          <div className="flex justify-between">
            <p>
              Have an account?
              <Link
                to="/login"
                className="text-blue-500 underline cursor-pointer ml-1"
              >
                Login
              </Link>
            </p>
            <input
              type="submit"
              value="Signup"
              className="text-white bg-green-500 px-2 py-1 cursor-pointer rounded-lg hover:bg-green-600 transition-colors"
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default Signup;