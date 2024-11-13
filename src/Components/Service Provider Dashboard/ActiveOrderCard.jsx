import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import socket from "../sockets/socket";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const ActiveOrderCard = ({ order, onOrderComplete, onUpdate }) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const user_id = currentUser?._id;
  const user_type = currentUser?.user_type;
  const [loadingState, setLoadingState] = useState({
    complete: false,
    buyerComplete: false,
    buyerReport: false,
  });

  useEffect(() => {
    // Cleanup socket listeners on unmount
    return () => {
      socket.off("chatExists");
      socket.off("chatCreated");
    };
  }, []);

  const setLoading = (action, value) => {
    setLoadingState((prevState) => ({ ...prevState, [action]: value }));
  };

  const handleChatClick = () => {
    if (!socket.connected) {
      console.error("Socket not connected");
      return;
    }

    // Trigger the createChat event when the user clicks Contact
    socket.emit("createChat", {
      senderId: user_id,
      receiverId: order?.buyer_id?._id,
    });

    // Listen for either the existing or newly created chat
    socket.on("chatExists", (chat) => {
      const chatId = chat._id;
      socket.emit("joinRoom", chat._id);
      navigate(`/message/id?query=${encodeURIComponent(chatId)}`);
    });

    socket.on("chatCreated", (newChat) => {
      const chatId = newChat._id;
      socket.emit("joinRoom", newChat._id);
      navigate(`/message/id?query=${encodeURIComponent(chatId)}`);
    });
  };

  const handleOrderAction = async (action) => {
    setLoading(action, true);
    try {
      const response = await axios.patch(
        "https://backend-qyb4mybn.b4a.run/order/confirm_completion",
        {
          order_id: order?._id,
          action,
        }
      );
      if (response.data) {
        onUpdate();
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error completing order:", error);
    } finally {
      setLoading(action, false);
    }
  };

  const handleOrderComplete = () => handleOrderAction("complete");
  const handleBuyerOrderComplete = () => handleOrderAction("confirm");
  const handleBuyerOrderDispute = () => handleOrderAction("dispute");

  return (
    <div className="bg-white shadow-md hover:shadow-lg p-6 rounded-lg transition-shadow">
      {/* Client's Name */}
      <h3 className="font-bold text-lg">
        {user_type === "buyer" ? "Service Provider: " : "Client: "}{" "}
        {user_type === "buyer"
          ? order?.service_provider_id?.name
          : order?.buyer_id?.name}
      </h3>

      {/* Service Provided */}
      <p className="text-gray-600">Service: {order?.description}</p>

      {/* Time */}
      <p className="text-gray-600">
        Time:{" "}
        {order?.accepted_by === "buyer"
          ? order?.service_provider_time
          : order?.appointment_time}
      </p>
      <p className="text-gray-600">
        Date:{" "}
        {order?.accepted_by === "buyer"
          ? new Date(order?.service_provider_date).toLocaleDateString("en-GB")
          : new Date(order?.appointment_date).toLocaleDateString("en-GB")}
      </p>

      {/* Price */}
      <p className="font-bold text-green-500 text-xl">
        Price:{" "}
        {order?.accepted_by === "buyer" && order?.service_provider_price !== 0
          ? order?.service_provider_price
          : order?.price}
      </p>

      {/* Chat Button */}
      <div className="mt-4">
        <button
          onClick={handleChatClick}
          className="inline-block bg-custom-violet px-4 py-2 rounded-lg w-full text-center text-white"
        >
          Chat with Client
        </button>

        {user_type === "buyer" &&
        order?.order_status === "pending confirmation" ? (
          <div className="flex flex-col space-y-2 mt-2">
            <p className="font-medium text-gray-700">
              Your service provider has marked this order as{" "}
              <span className="font-semibold text-green-600">completed</span>.
              Please confirm or report any issues.
            </p>

            <div className="flex space-x-2">
              <button
                onClick={handleBuyerOrderComplete}
                disabled={loadingState.buyerComplete}
                className="inline-flex flex-1 justify-center items-center bg-green-500 px-4 py-2 rounded-lg text-white"
              >
                {loadingState.buyerComplete ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
                ) : (
                  "Mark as Complete"
                )}
              </button>

              <button
                onClick={handleBuyerOrderDispute}
                disabled={loadingState.buyerReport}
                className="inline-flex flex-1 justify-center items-center bg-red-500 px-4 py-2 rounded-lg text-white"
              >
                {loadingState.buyerReport ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
                ) : (
                  "Report"
                )}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleOrderComplete}
            disabled={loadingState.complete}
            className={`w-full inline-block px-4 py-2 ${
              loadingState.complete ? "bg-green-400" : "bg-green-500"
            } text-white rounded-lg text-center mt-1`}
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
