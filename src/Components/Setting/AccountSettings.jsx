import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AccountSettings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const userEmail = currentUser?.email; // Ensure email exists
  const isGoogleUser = currentUser?.is_google; // Check if user logged in via Google
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      notifyError("New passwords do not match.");
      return;
    }

    // API call to change the password
    try {
      const response = await axios.post(
        "https://backend-qyb4mybn.b4a.run/api/change-password",
        {
          email: userEmail,
          currentPassword,
          newPassword,
        }
      );

      // Handle success and error response
      if (response.data.success) {
        notifySuccess(response.data.message);
      } else {
        notifyError(response.data.message);
      }
    } catch (error) {
      // Show error message in case of request failure
      notifyError("Failed to update password. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer /> {/* Include ToastContainer to display toasts */}
      <h2 className="font-bold text-3xl text-center text-gray-900 md:text-4xl">
        Account Settings
      </h2>
      {isGoogleUser ? (
        <p className="mt-4 text-center text-gray-600">
          Password changes are managed through your Google account. Please visit
          your Google account settings to update your password.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 w-full">
          {/* Current Password */}
          <div className="flex flex-col">
            <label className="font-semibold text-base text-gray-600 md:text-lg">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border-gray-300 mt-2 p-2 md:p-3 border rounded-lg focus:ring focus:ring-blue-200 w-full focus:outline-none"
              placeholder="Enter your current password"
              required
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col">
            <label className="font-semibold text-base text-gray-600 md:text-lg">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border-gray-300 mt-2 p-2 md:p-3 border rounded-lg focus:ring focus:ring-blue-200 w-full focus:outline-none"
              placeholder="Enter a new password"
              required
            />
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col">
            <label className="font-semibold text-base text-gray-600 md:text-lg">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-gray-300 mt-2 p-2 md:p-3 border rounded-lg focus:ring focus:ring-blue-200 w-full focus:outline-none"
              placeholder="Confirm your new password"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 px-4 md:px-6 py-2 md:py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full max-w-xs font-semibold text-white focus:outline-none transition duration-300 ease-in-out"
            >
              Change Password
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default AccountSettings;
