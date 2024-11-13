<<<<<<< Updated upstream
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import socket from '../sockets/socket';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const ActiveOrderCard = ({ order, onOrderComplete, onUpdate }) => {

    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate()
    const user_id = currentUser._id;
    const user_type = currentUser.user_type;
    const [completeLoader, setCompleteLoader] = useState(false)
    const [buyerCompleteLoader, setbuyerCompleteLoader] = useState(false)
    const [buyerReportLoader , setbuyerReportLoader] = useState(false)

    console.log(order)
    const handleChatClick = () => {
        if (!socket.connected) {
            console.error("Socket not connected");
            return;
=======
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "../sockets/socket";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setCompletedOrder } from "../../Redux/orderSlice";

const ActiveOrderCard = ({ order, onOrderComplete }) => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user_id = currentUser._id;
  const user_type = currentUser.user_type;

  const handleChatClick = () => {
    if (!socket.connected) {
      console.error("Socket not connected");
      return;
    }

    socket.emit("createChat", {
      senderId: user_id,
      receiverId: order.buyer_id._id,
    });

    // Ensure that only one of these events fires using `once` instead of `on`
    socket.once("chatExists", (chat) => {
      const chatId = chat._id;
      socket.emit("joinRoom", chatId);
      navigate(`/message/id?query=${encodeURIComponent(chatId)}`);
    });
    socket.once("chatCreated", (newChat) => {
      const chatId = newChat._id;
      socket.emit("joinRoom", chatId);
      navigate(`/message/id?query=${encodeURIComponent(chatId)}`);
    });
  };

  const handleOrderComplete = async () => {
    try {
      const response = await axios.patch(
        "https://backend-qyb4mybn.b4a.run/order/complete_by_freelancer",
        { order_id: order._id }
      );

      if (response.data.success) {
        onOrderComplete(order._id);

        // Store completed order in Redux and navigate to /payment if user is buyer
        dispatch(setCompletedOrder(order));
        if (user_type === "buyer") {
          navigate("/payment");
>>>>>>> Stashed changes
        }
      }
    } catch (error) {
      console.error("Failed to mark order as complete", error);
      alert("Could not mark the order as complete. Please try again.");
    }
  };

<<<<<<< Updated upstream
        // Trigger the createChat event when the user clicks Contact
        socket.emit("createChat", { senderId: user_id, receiverId: order.buyer_id._id });
        // Listen for either the existing or newly created chat
        socket.on("chatExists", (chat) => {
            const chatId = chat._id; // Extract chat ID
            socket.emit("joinRoom", chat._id);
            navigate(`/message/id?query=${encodeURIComponent(chatId)}`); // Navigate to the messageSection with chat ID
        });
        socket.on("chatCreated", (newChat) => {
            console.log(newChat)
            const chatId = newChat._id; // Extract chat ID
            socket.emit("joinRoom", newChat._id);
            navigate(`/message/id?query=${encodeURIComponent(chatId)}`);
        });
    };

    const handleOrderComplete = async () => {

        setCompleteLoader(true)
        try {
            const response = await axios.patch('https://backend-qyb4mybn.b4a.run/order/complete_by_freelancer', {
                order_id: order._id
            });

            console.log(response)

            if (response.data) {
                console.log('yes')
                onUpdate()
            }
            setCompleteLoader(false)
        } catch (error) {
            setCompleteLoader(false)
            console.error("Failed to mark order as complete", error);
            alert("Could not mark the order as complete. Please try again.");
        }
=======
  // Clean up socket events on component unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      socket.off("chatExists");
      socket.off("chatCreated");
>>>>>>> Stashed changes
    };
  }, []);

<<<<<<< Updated upstream
    const handleBuyerOrderComplete = async () => {

        setbuyerCompleteLoader(true)
        try {
            const response = await axios.patch('https://backend-qyb4mybn.b4a.run/order/confirm_completion', {
                order_id: order._id,
                action: "confirm"
            });
            if (response.data) {
                console.log('yes')
                onUpdate()
            }
            setbuyerCompleteLoader(false)
        } catch (error) {
            setbuyerCompleteLoader(false)
            console.error("Failed to mark order as complete", error);
            alert("Could not mark the order as complete. Please try again.");
        }
    };


    const handleBuyerOrderDispute = async () => {

        setbuyerReportLoader(true)
        try {
            const response = await axios.patch('https://backend-qyb4mybn.b4a.run/order/confirm_completion', {
                order_id: order._id,
                action: "dispute"
            });
            if (response.data) {
                console.log('yes')
                onUpdate()
            }
            setbuyerReportLoader(false)
        } catch (error) {
            setbuyerReportLoader(false)
            console.error("Failed to mark order as complete", error);
            alert("Could not mark the order as complete. Please try again.");
        }
    };




    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            {/* Client's Name */}
            <h3 className="text-lg font-bold">{user_type == 'buyer' ? 'Service Provider: ' : 'Client: '} {user_type == 'buyer' ? order.service_provider_id.name : order.buyer_id.name}</h3>

            {/* Service Provided */}
            <p className="text-gray-600">Service: {order.description}</p>

            {/* Time */}
            <p className="text-gray-600">Time: {order.accepted_by == 'buyer' ? order.service_provider_time : order.appointment_time}</p>
            <p className="text-gray-600">Date: {order.accepted_by == 'buyer' ? new Date(order.service_provider_date).toLocaleDateString('en-GB') : new Date(order.appointment_date).toLocaleDateString('en-GB')}</p>


            {/* Price */}
            <p className="text-xl font-bold text-green-500">Price: {order.accepted_by == 'buyer' && order.service_provider_price != 0 ? order.service_provider_price : order.price}</p>



            {/* Chat Button */}
            <div className="mt-4">
                <button
                    onClick={handleChatClick}
                    className="w-full inline-block px-4 py-2 bg-custom-violet text-white rounded-lg text-center"
                >
                    Chat with Client
                </button>

                {user_type === 'buyer' && order.order_status === 'pending confirmation' ? (
                    <div className="flex flex-col space-y-2 mt-2">
                        <p className="text-gray-700 font-medium">
                            Your service provider has marked this order as <span className="font-semibold text-green-600">completed</span>.
                            Please confirm or report any issues.
                        </p>

                        <div className="flex space-x-2">
                            <button
                                onClick={handleBuyerOrderComplete}
                                disabled={buyerCompleteLoader}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg"
                            >
                                {buyerCompleteLoader ? (
                                    <FontAwesomeIcon icon={faSpinner} spin className="h-5 w-5" />
                                ) : (
                                    'Mark as Complete'
                                )}
                            </button>

                            <button
                                onClick={handleBuyerOrderDispute}
                                disabled={buyerCompleteLoader}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg"
                            >
                                {buyerReportLoader ? (
                                    <FontAwesomeIcon icon={faSpinner} spin className="h-5 w-5" />
                                ) : (
                                    'Report'
                                )}
                            </button>
                        </div>
                    </div>
                ) : user_type == 'buyer' && order.order_status !== 'pending confirmation' ? (
                    <p className="text-gray-500 mt-1">Waiting for response</p>
                ) : user_type !== 'buyer' && order.order_status === 'pending confirmation' ? (
                    <p className="text-gray-500 mt-1">Waiting for response</p>
                ) : (
                    <button
                        onClick={handleOrderComplete}
                        disabled={completeLoader}
                        className={`w-full inline-block px-4 py-2 ${completeLoader ? 'bg-green-400' : 'bg-green-500'} text-white rounded-lg text-center mt-1`}
                    >
                        {completeLoader ? (
                            <FontAwesomeIcon icon={faSpinner} spin className="h-5 w-5 mx-auto" />
                        ) : (
                            'Mark as Complete'
                        )}
                    </button>
                )}


            </div>
        </div>
    );
=======
  return (
    <div className="bg-white shadow-md hover:shadow-lg p-6 rounded-lg transition-shadow">
      <h3 className="font-bold text-lg">
        {user_type === "buyer" ? "Service Provider: " : "Client: "}
        {user_type === "buyer"
          ? order.service_provider_id.name
          : order.buyer_id.name}
      </h3>
      <p className="text-gray-600">Service: {order.description}</p>
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
      <p className="font-bold text-green-500 text-xl">
        Price:{" "}
        {order.accepted_by === "buyer" && order.service_provider_price !== 0
          ? order.service_provider_price
          : order.price}
      </p>
      <div className="mt-4">
        <button
          onClick={handleChatClick}
          className="inline-block bg-custom-violet px-4 py-2 rounded-lg w-full text-center text-white"
        >
          Chat with Client
        </button>
        <button
          onClick={handleOrderComplete}
          className="inline-block bg-green-500 mt-2 px-4 py-2 rounded-lg w-full text-center text-white"
        >
          Mark as Complete
        </button>
      </div>
    </div>
  );
>>>>>>> Stashed changes
};

export default ActiveOrderCard;
