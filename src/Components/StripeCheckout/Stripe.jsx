import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initialize Stripe with your public key
const stripePromise = loadStripe(
  "pk_test_51QJEhZRs4hqDZ7PFRqSx4rS5oo3KuOulU1GfFP3f0jmLkMn1PzxCfYs7V3MfHng6zHkFgP8WIBbjD2LEqP18ECcZ00cIDA6jow"
);

const StripePaymentPage = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false); // Loading state to track progress

  const handleCheckout = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    setLoading(true); // Set loading to true when starting the payment process

    try {
      const stripe = await stripePromise;

      // Convert dollars to cents
      const amountInCents = parseInt(amount) * 100;

      // Send amount to backend to create a checkout session
      const { data } = await axios.post(
        "http://localhost:8080/create-checkout-session",
        {
          amount: amountInCents,
        }
      );

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.id,
      });

      if (error) {
        console.error("Stripe Checkout error:", error.message);
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
      toast.error(
        "There was an issue creating the payment session. Please try again."
      );
    } finally {
      setLoading(false); // Reset loading state after the process is complete
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 p-10 min-h-screen">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-lg">
        {/* Logo and Title */}
        <div className="mb-6 text-center">
          <img
            src="https://your-logo-url.com/logo.png" // Replace with your logo image URL
            alt="Logo"
            className="mx-auto mb-4 w-20 h-20"
          />
          <h1 className="font-bold text-3xl text-gray-800">Payment</h1>
          <p className="mt-2 text-gray-500">
            Enter the amount you'd like to pay
          </p>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label
            htmlFor="amount"
            className="block mb-2 font-medium text-gray-600 text-sm"
          >
            Amount (USD)
          </label>
          <input
            type="number"
            id="amount"
            placeholder="Enter amount in USD"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border-2 border-gray-300 p-4 rounded-md focus:ring-2 focus:ring-indigo-500 w-full text-xl focus:outline-none"
          />
        </div>

        {/* Payment Button */}
        <button
          onClick={handleCheckout}
          className={`bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg w-full font-semibold text-white text-xl transform transition duration-200 ease-in-out hover:scale-105 focus:outline-none ${
            loading ? "cursor-wait opacity-50" : ""
          }`}
          disabled={loading} // Disable button during loading
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <svg
                className="mr-3 w-5 h-5 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="4"></circle>
                <path
                  d="M4 12a8 8 0 0 1 16 0"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                ></path>
              </svg>
              Processing...
            </div>
          ) : (
            "Proceed to Payment"
          )}
        </button>

        {/* Information and Footer */}
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-sm">
            Your payment is processed securely through Stripe.
          </p>
        </div>
      </div>

      {/* Toastify container for notifications */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
      />
    </div>
  );
};

export default StripePaymentPage;
