import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast notifications

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { _id, email } = location.state.data; // Destructure the passed data from state
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60); // Timer for resend button

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prevTime) => prevTime - 1);
      }, 1000);
    }

    // Cleanup the timer
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Move to the next input field
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join(""); // Join the OTP array to get the full OTP
    try {
      const response = await fetch('https://backend-qyb4mybn.b4a.run/api/OTP-verification', {
        method: 'POST', // Specify the request method
        headers: {
          'Content-Type': 'application/json', // Indicate the type of content
        },
        body: JSON.stringify({ userId: _id, otp: otpValue }), // Convert the data to JSON format
      });

      if (response.ok) {
        toast.success("OTP verified successfully!");
        navigate('/role-selection', { state: { email } });
      } else {
        toast.error("OTP verification failed. Please try again.");
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error("An error occurred while verifying OTP.");
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true); // Set resending state
    try {
      const response = await axios.post('https://backend-qyb4mybn.b4a.run/api/resend-OTP', { _id: _id ,email: email });
      console.log(response);
      console.log(response.data);
      if (response.ok || response.data.success) {
        toast.success("OTP has been resent successfully.");
      } else {
        toast.error("Failed to resend OTP.");
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error("An error occurred while resending OTP.");
    } finally {
      setIsResending(false); // Reset resending state
      setResendTimer(60); // Reset the timer
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer /> {/* Toast container for notifications */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          OTP Verification
        </h2>
        <p className="text-center text-gray-500">Enter the 6-digit OTP sent to your phone</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center space-x-2">
            {otp.map((data, index) => (
              <input
                className="w-12 h-12 border rounded-lg text-center text-lg outline-none bg-gray-50 focus:ring-2 focus:ring-indigo-600"
                type="text"
                name="otp"
                maxLength="1"
                key={index}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>

          <div className="flex flex-col items-center space-y-2">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300"
            >
              Verify OTP
            </button>
            <button
              type="button"
              className="text-indigo-600 hover:underline"
              onClick={handleResendOtp}
              disabled={isResending || resendTimer > 0}
            >
              {isResending
                ? "Resending..."
                : resendTimer > 0
                ? `Resend OTP in ${resendTimer}s`
                : "Resend OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
