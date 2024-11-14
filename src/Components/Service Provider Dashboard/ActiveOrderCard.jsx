import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCompletedOrder } from "../../Redux/orderSlice"; // Import the Redux action
import socket from "../sockets/socket";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ActiveOrderCard = ({ order, onOrderComplete }) => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch(); // Dispatch to Redux
  const navigate = useNavigate();
  const user_id = currentUser._id;
  const user_type = currentUser.user_type;

  // Handle chat initiation (for buyer or service provider)
  const handleChatClick = () => {
    if (!socket.connected) {
      console.error("Socket not connected");
      return;
    }

    // If the user is a buyer, initiate chat with the service provider
    const receiverId =
      user_type === "buyer"
        ? order.service_provider_id._id
        : order.buyer_id._id;

    socket.emit("createChat", {
      senderId: user_id,
      receiverId: receiverId,
    });

    socket.on("chatExists", (chat) => {
      const chatId = chat._id;
      socket.emit("joinRoom", chatId);
      navigate(`/message/id?query=${encodeURIComponent(chatId)}`);
    });

    socket.on("chatCreated", (newChat) => {
      const chatId = newChat._id;
      socket.emit("joinRoom", chatId);
      navigate(`/message/id?query=${encodeURIComponent(chatId)}`);
    });
  };

  // Handle order completion (for freelancer or buyer)
  const handleOrderComplete = async () => {
    try {
      const response = await axios.patch(
        "https://backend-qyb4mybn.b4a.run/order/complete_by_freelancer",
        {
          order_id: order._id,
        }
      );

      if (response.data.success) {
        // Dispatch the action to store the completed order in Redux
        dispatch(setCompletedOrder(order));
        onOrderComplete(order._id); // Parent callback to update state

        // If the user is a buyer, navigate to the payment page
        if (user_type === "buyer") {
          navigate("/payment");
        }
      }
    } catch (error) {
      console.error("Failed to mark order as complete", error);
      alert("Could not mark the order as complete. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-md hover:shadow-lg p-6 rounded-lg transition-shadow">
      {/* Client's Name */}
      <h3 className="font-bold text-lg">
        {user_type === "buyer" ? "Service Provider: " : "Client: "}
        {user_type === "buyer"
          ? order.service_provider_id.name
          : order.buyer_id.name}
      </h3>

      {/* Service Provided */}
      <p className="text-gray-600">Service: {order.description}</p>

      {/* Time and Date */}
      <p className="text-gray-600">
        Time:{" "}
        {order.accepted_by === "buyer"
          ? order.service_provider_time
          : order.appointment_time}
      </p>
      <p className="text-gray-600">
        Date:{" "}
        {order.accepted_by === "buyer"
          ? new Date(order.service_provider_date).toLocaleDateString("en-GB")
          : new Date(order.appointment_date).toLocaleDateString("en-GB")}
      </p>

      {/* Price */}
      <p className="font-bold text-green-500 text-xl">
        Price:{" "}
        {order.accepted_by === "buyer" && order.service_provider_price !== 0
          ? order.service_provider_price
          : order.price}
      </p>

      {/* Chat and Mark Complete Buttons */}
      <div className="mt-4">
        <button
          onClick={handleChatClick}
          className="inline-block bg-custom-violet px-4 py-2 rounded-lg w-full text-center text-white"
        >
          {/* Dynamically change button text */}
          {user_type === "buyer"
            ? "Chat with Service Provider"
            : "Chat with Client"}
        </button>
        <button
          onClick={handleOrderComplete}
          className="inline-block bg-green-500 px-4 py-2 rounded-lg w-full text-center text-white"
        >
          {/* Mark order as complete and navigate for buyer */}
          Mark as Complete
        </button>
      </div>
    </div>
  );
};

export default ActiveOrderCard;
