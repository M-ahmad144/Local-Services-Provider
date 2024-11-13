import React from "react";
import { useSelector } from "react-redux";
import socket from "../sockets/socket";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ActiveOrderCard = ({ order, onOrderComplete }) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const user_id = currentUser._id;
  const user_type = currentUser.user_type;
  const handleChatClick = () => {
    if (!socket.connected) {
      console.error("Socket not connected");
      return;
    }

    // Trigger the createChat event when the user clicks Contact
    socket.emit("createChat", {
      senderId: user_id,
      receiverId: order.buyer_id._id,
    });
    // Listen for either the existing or newly created chat
    socket.on("chatExists", (chat) => {
      const chatId = chat._id; // Extract chat ID
      socket.emit("joinRoom", chat._id);
      navigate(`/message/id?query=${encodeURIComponent(chatId)}`); // Navigate to the messageSection with chat ID
    });
    socket.on("chatCreated", (newChat) => {
      console.log(newChat);
      const chatId = newChat._id; // Extract chat ID
      socket.emit("joinRoom", newChat._id);
      navigate(`/message/id?query=${encodeURIComponent(chatId)}`);
    });
  };

  const handleOrderComplete = async () => {
    try {
      const response = await axios.patch(
        "https://backend-qyb4mybn.b4a.run/order/complete_by_freelancer",
        {
          order_id: order._id,
        }
      );

      if (response.data.success) {
        onOrderComplete(order._id); // Callback to update the parent component's state
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
        {user_type == "buyer" ? "Service Provider: " : "Client: "}{" "}
        {user_type == "buyer"
          ? order.service_provider_id.name
          : order.buyer_id.name}
      </h3>

      {/* Service Provided */}
      <p className="text-gray-600">Service: {order.description}</p>

      {/* Time */}
      <p className="text-gray-600">
        Time:{" "}
        {order.accepted_by == "buyer"
          ? order.service_provider_time
          : order.appointment_time}
      </p>
      <p className="text-gray-600">
        Date:{" "}
        {order.accepted_by == "buyer"
          ? new Date(order.service_provider_date).toLocaleDateString("en-GB")
          : new Date(order.appointment_date).toLocaleDateString("en-GB")}
      </p>

      {/* Price */}
      <p className="font-bold text-green-500 text-xl">
        Price:{" "}
        {order.accepted_by == "buyer" && order.service_provider_price != 0
          ? order.service_provider_price
          : order.price}
      </p>

      {/* Chat Button */}
      <div className="mt-4">
        <button
          onClick={handleChatClick}
          className="inline-block bg-custom-violet px-4 py-2 rounded-lg w-full text-center text-white"
        >
          Chat with Client
        </button>
        <button
          onClick={handleOrderComplete}
          className="inline-block bg-green-500 px-4 py-2 rounded-lg w-full text-center text-white"
        >
          Mark as Complete
        </button>
      </div>
    </div>
  );
};

export default ActiveOrderCard;
