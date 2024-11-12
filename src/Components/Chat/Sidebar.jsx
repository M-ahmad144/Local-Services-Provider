import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchChats } from "../../Api/api";
import socket from "../sockets/socket";
import Loader from "../loader/index";

// Sidebar Component
const Sidebar = ({ activeChat, setActiveChat, userId, setActiveChatTitle, setActiveChatImg }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar auto open by default

  // Fetching chats data using React Query
  const { data: chats = [], isLoading, error } = useQuery({
    queryKey: ["chats"],
    queryFn: () => fetchChats(userId),
  });

  // Show loader while fetching data
  if (isLoading) return <Loader />;

  // Show error if fetching fails
  if (error) return <div>Error fetching chats</div>;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex h-full">
          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} z-40`}
            style={{ transition: "transform 0.3s ease" }}
          >
            <div className="flex flex-col py-8 pr-2 pl-6 h-full">
              <div className="flex flex-row justify-center items-center w-full h-12">
                <div className="ml-2 font-bold text-2xl">QuickChat</div>
              </div>
              <div className="flex flex-col mt-8">
                <div className="flex flex-row justify-between items-center text-xs">
                  <span className="font-bold">Active Conversations</span>
                </div>
                <div className="flex flex-col space-y-1 -mx-2 mt-4 h-48 overflow-auto">
                  {chats.map((chat) => {
                    return chat.participants.map((participant) => {
                      if (participant._id !== userId) {
                        return (
                          <ConversationButton
                            key={participant._id}
                            name={participant.name}
                            img={participant.profile_image}
                            chatId={chat._id}
                            activeChat={activeChat}
                            setActiveChat={setActiveChat}
                            setActiveChatTitle={setActiveChatTitle}
                            setActiveChatImg={setActiveChatImg}
                          />
                        );
                      }
                      return null;
                    });
                  })}
                </div>
              </div>
            </div>
          </div>
  
          {/* Overlay to close sidebar */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-30"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}
        </div>
      )}
    </>
  );
};

// ConversationButton Component
const ConversationButton = ({ name, chatId, activeChat, setActiveChat, setActiveChatTitle ,setActiveChatImg  , img }) => {
  return (
    <button
      onClick={() => {
        if (!activeChat) {
          setActiveChat(chatId); // Set the active chat
          setActiveChatTitle(name)
          setActiveChatImg(img);  
        }
        else {
          setActiveChat(chatId);
          // You might want to navigate to the chat area here if you're using react-router
          setActiveChatTitle(name)
          setActiveChatImg(img);  

        }
      }}
      className={`flex flex-row items-center hover:bg-gray-100 rounded-xl p-2 ${activeChat === name ? "bg-gray-200" : ""
        }`}
    >
      <div className="flex justify-center items-center bg-indigo-200 rounded-full w-8 h-8">
        {name.charAt(0)}
      </div>
      <div className="ml-2 font-semibold text-sm">{name}</div>
    </button>
  );
};

export default Sidebar;
