import React, { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ChatMessage from "./ChatMessage";
import { fetchMessageHistory } from "../../Api/api";
import socket from "../sockets/socket";
import Loader from '../loader/index';

const ChatArea = ({ activeChatId, userId, activeChatTitle, img }) => {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null); // Ref to track end of messages

  const {
    data: messages = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chatHistory", activeChatId],
    queryFn: () => fetchMessageHistory(activeChatId),
    enabled: !!activeChatId,
  });

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    if (activeChatId) {
      socket.emit("joinChat", activeChatId);
    }

    const handleNewMessage = (newMessage) => {
      queryClient.setQueryData(["chatHistory", activeChatId], (oldMessages) => {
        const existingMessageIds = new Set(oldMessages.map((msg) => msg._id));
        if (!existingMessageIds.has(newMessage._id)) {
          const obj = {
            _id: newMessage._id,
            message_text: newMessage.message_text,
            sender: newMessage.sender._id,
            sent_at: newMessage.sent_at,
          };
          return [...oldMessages, obj];
        }
        return oldMessages;
      });
    };

    socket.on("messageReceived", handleNewMessage);

    return () => {
      socket.off("messageReceived", handleNewMessage);
    };
  }, [activeChatId, queryClient]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      const messageData = {
        chatId: activeChatId,
        senderId: userId,
        text: message,
      };
      socket.emit("sendMessage", messageData);
      setMessage("");
    }
  };

  if (error) return <div className="text-center text-red-500">Error fetching messages</div>;

  return (
    <div className="flex flex-col flex-auto bg-gray-50 shadow-lg p-6 rounded-3xl h-full">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* Chat Header */}
          <div className="flex justify-between items-center bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md mb-4 p-4 rounded-lg">
            <div className="flex items-center">
              <img
                src={img === "default-profile.png" ? "https://via.placeholder.com/150" : img}
                alt={`${activeChatId}'s profile`}
                className="mr-2 rounded-full w-10 h-10"
              />
              <div>
                <h2 className="font-bold text-2xl text-white">{activeChatTitle}</h2>
                <span className="text-gray-200 text-sm">Online</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-auto bg-gray-100 p-4 rounded-lg h-full overflow-hidden">
            <div className="flex flex-col flex-grow mb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {messages.map((chatMessage) => (
                <ChatMessage
                  key={chatMessage._id}
                  isSent={chatMessage.sender === userId}
                  message={chatMessage.message_text}
                  senderName={activeChatTitle}
                  timestamp={chatMessage.sent_at}
                />
              ))}
              <div ref={messagesEndRef} /> {/* Auto-scroll target */}
            </div>

            <form onSubmit={handleSendMessage} className="flex items-center bg-white shadow-sm rounded-xl w-full h-16">
              <input
                className="flex-grow border-gray-300 focus:border-indigo-500 pl-4 border rounded-xl focus:outline-none h-10 transition duration-200"
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 ml-2 px-4 py-1 rounded-xl text-white transition duration-200">
                Send
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatArea;
