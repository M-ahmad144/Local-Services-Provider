import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility

  // Toggle the sidebar visibility
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Button to toggle sidebar */}
      <button
        className="top-4 left-4 z-50 fixed md:hidden bg-blue-600 shadow-md p-3 rounded-full text-white"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 bg-white shadow-lg border-r h-full w-64 z-40 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4">
          <div className="font-semibold text-gray-900 text-xl">Logo</div>
          <button
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={toggleSidebar}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <ul className="space-y-4 p-4">
          {["editProfile", "account", "help"].map((item) => (
            <li key={item}>
              <Link
                to={`/settings/${item}`}
                className="block hover:bg-blue-50 p-2 rounded-lg text-gray-700 transition duration-300 ease-in-out"
                onClick={() => setIsOpen(false)} // Close sidebar on link click (mobile)
              >
                {item.charAt(0).toUpperCase() + item.slice(1).replace("-", " ")}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="z-30 fixed inset-0 md:hidden bg-black opacity-50"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
