import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../Components/Chat/Sidebar";
import ChatArea from "../Components/Chat/ChatArea";
import socket from "../Components/sockets/socket";
import dummyimg from "../assets/dummy.png";

const ChatSection = () => {
  const [activeChatId, setActiveChatId] = useState(); // Default active chat ID
  const [activeChatTitle, setActiveChatTitle] = useState()
  const [activeChatImg, setActiveChatImg] = useState("");
  const [chats, setChats] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser._id

  useEffect(() => {
    // Establish socket connection when the component mounts
    socket.on("connect", () => {
      console.log("Connected to Socket.io");
    });


    return () => {
      // Cleanup socket connection on unmount
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const chatId = queryParams.get("query"); // Assuming you may pass chat ID in the URL
    console.log(chatId)
    if (chatId) {
      setActiveChatId(chatId);
      setActiveChatTitle(queryParams.get("title"));
      setActiveChatImg(queryParams.get("img") || dummyimg);
      initializeChat(chatId);
    }
  }, [location.search]);

  useEffect(() => {
    // Initialize chat for the active chat ID when it changes
    if (activeChatId) {
      initializeChat(activeChatId);
      console.log()
    }
  }, [activeChatId]);

  const sendMessage = (message) => {
    const newChats = { ...chats };
    const timestamp = new Date().toISOString();
    newChats[activeChatId] = newChats[activeChatId] || [];
    newChats[activeChatId].push({ isSent: true, message, timestamp });
    setChats(newChats);
  };

  const initializeChat = (chatId) => {
    if (chatId && !chats[chatId]) {
      socket.emit("getChatHistory", chatId); // Fetch chat history
    }
  };

  useEffect(() => {
    // Listen for incoming messages
    socket.on("messageReceived", (newMessage) => {
      const updatedChats = { ...chats };
      updatedChats[newMessage.chatId] = [
        ...(updatedChats[newMessage.chatId] || []),
        newMessage,
      ];
      setChats(updatedChats);
    });

  }, [chats, activeChatId]);

  console.log('Image', activeChatImg)

  return (
    <div className="flex h-screen text-gray-800 antialiased">
      <div className="flex flex-row w-full h-full overflow-x-hidden">
        <Sidebar
          activeChat={activeChatId}
          setActiveChat={setActiveChatId}
          userId={userId}
          setActiveChatTitle={setActiveChatTitle}
          setActiveChatImg={setActiveChatImg} // Pass this down
        />
        <ChatArea
          activeChatId={activeChatId} // Use the active chat ID here
          activeChatTitle={activeChatTitle}
          userId={userId}
          img = {activeChatImg}
        />
      </div>
    </div>
  );
};

export default ChatSection