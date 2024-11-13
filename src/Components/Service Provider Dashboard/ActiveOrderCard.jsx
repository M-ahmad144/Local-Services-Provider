import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCompletedOrder } from "../../Redux/orderSlice"; // Import the setCompletedOrder action
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ActiveOrderCard = ({ order, onOrderComplete, onUpdate }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const user_type = currentUser?.user_type || "";

  const navigate = useNavigate();
  const [loadingState, setLoadingState] = useState({
    complete: false,
    buyerComplete: false,
    buyerReport: false,
  });

  // Helper function to set loading state for different actions
  const setLoading = (action, value) => {
    setLoadingState((prevState) => ({ ...prevState, [action]: value }));
  };

  // Handle the order action (e.g., confirming completion, disputing)
  const handleOrderAction = async (action) => {
    setLoading(action, true); // Set loading state to true for the action

    try {
      // Make the API call to confirm the action (complete, dispute, etc.)
      const response = await axios.patch(
        "https://backend-qyb4mybn.b4a.run/order/confirm_completion",
        {
          order_id: order?._id,
          action,
        }
      );

      if (response.data) {
        if (action === "complete") {
          dispatch(setCompletedOrder(order));

          // Navigate to the payment page only if the user type is "buyer"
          if (user_type === "buyer") {
            navigate("/payment");
          }
        }
        onUpdate(); // Call onUpdate to refresh the UI
      }
    } catch (error) {
      console.error("Error completing order:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(action, false); // Set loading state back to false after the action is complete
    }
  };

  // Handler to confirm completion of the order (Buyer marks it as complete)
  const handleBuyerOrderComplete = () => handleOrderAction("confirm");

  // Handler to complete the order (Admin/Service provider marks it as complete)
  const handleOrderComplete = () => handleOrderAction("complete");

  // Handler for the buyer to dispute the order
  const handleBuyerOrderDispute = () => handleOrderAction("dispute");

  // Render the component
  if (!order) {
    return <div>Loading...</div>; // Handle case if order is not available
  }

  return (
    <div className="bg-white shadow-md hover:shadow-lg p-6 rounded-lg transition-shadow">
      {/* Client's Name */}
      <h3 className="mb-2 font-bold text-lg">
        {order?.accepted_by === "buyer"
          ? "Service Provider: " + order?.service_provider_id?.name
          : "Client: " + order?.buyer_id?.name}
      </h3>

      {/* Service Provided */}
      <p className="mb-2 text-gray-600">Service: {order?.description}</p>

      {/* Time and Date */}
      <p className="mb-2 text-gray-600">
        Time:{" "}
        {order?.accepted_by === "buyer"
          ? order?.service_provider_time
          : order?.appointment_time}
      </p>
      <p className="mb-4 text-gray-600">
        Date:{" "}
        {order?.accepted_by === "buyer"
          ? new Date(order?.service_provider_date).toLocaleDateString("en-GB")
          : new Date(order?.appointment_date).toLocaleDateString("en-GB")}
      </p>

      {/* Price */}
      <p className="mb-4 font-bold text-green-500 text-xl">
        Price:{" "}
        {order?.accepted_by === "buyer" && order?.service_provider_price !== 0
          ? order?.service_provider_price
          : order?.price}
      </p>

      {/* Action Buttons */}
      <div className="mt-4">
        {/* Buttons for the buyer to confirm completion or dispute */}
        {order?.order_status === "pending confirmation" && (
          <>
            <button
              onClick={handleBuyerOrderComplete} // Handle order complete action for the buyer
              disabled={loadingState.buyerComplete} // Disable button when loading
              className="inline-flex justify-center items-center bg-green-500 mb-2 px-4 py-2 rounded-lg w-full text-white"
            >
              {loadingState.buyerComplete ? (
                <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
              ) : (
                "Mark as Complete"
              )}
            </button>

            <button
              onClick={handleBuyerOrderDispute} // Handle the buyer dispute action
              disabled={loadingState.buyerReport} // Disable button when loading
              className="inline-flex justify-center items-center bg-red-500 px-4 py-2 rounded-lg w-full text-white"
            >
              {loadingState.buyerReport ? (
                <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
              ) : (
                "Report"
              )}
            </button>
          </>
        )}

        {/* Button for the service provider to complete the order */}
        {order?.order_status !== "pending confirmation" && (
          <button
            onClick={handleOrderComplete} // Service provider marks the order as complete
            disabled={loadingState.complete} // Disable button when loading
            className={`w-full inline-block px-4 py-2 ${
              loadingState.complete ? "bg-green-400" : "bg-green-500"
            } text-white rounded-lg text-center mt-4`}
          >
            {loadingState.complete ? (
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                className="mx-auto w-5 h-5"
              />
            ) : (
              "Mark as Complete"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ActiveOrderCard;
