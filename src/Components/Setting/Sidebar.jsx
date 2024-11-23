import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaCog,
  FaQuestionCircle,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility

  // Toggle the sidebar visibility
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Sidebar toggle button for mobile */}
      <div className="top-18 left-8 z-50 fixed md:hidden">
        <button onClick={toggleSidebar} className="text-gray-800">
          {isOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-20 bg-white shadow-lg border-r h-full w-64 z-40 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="space-y-6 p-6">
          {["editProfile", "account", "help"].map((item) => (
            <li key={item}>
              <Link
                to={`/settings/${item}`}
                className="flex items-center  hover:bg-gray-200 px-4 py-2 rounded-lg text-black transition duration-300"
                onClick={() => setIsOpen(false)} // Close sidebar on link click (mobile)
              >
                {/* Display icons based on the item */}
                {item === "editProfile" && <FaUser size={20} />}
                {item === "account" && <FaCog size={20} />}
                {item === "help" && <FaQuestionCircle size={20} />}

                <span className="ml-2">
                  {item.charAt(0).toUpperCase() +
                    item.slice(1).replace("-", " ")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="z-30 fixed inset-0 bg-black opacity-50"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
