import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaBell,
  FaEnvelope,
  FaBars,
  FaQuestionCircle,
  FaTh,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import ProfileDropdown from "./profileDropDown"; // Ensure the import path is correct
import { useSelector } from "react-redux";
import logo from '../../assets/Logo.jpg'

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const userRole = currentUser?.user_type || "guest"; // Fallback to 'guest' if currentUser is undefined
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/services?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="flex justify-between items-center bg-white shadow-md px-6 py-4">
      {/* Left Side - Logo and Links */}
      <div className="flex items-center">
        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="LSP Logo"
            className="mr-6 h-6"
          />
        </Link>

        {/* Links */}
        <div className={`md:flex space-x-6 hidden`}>
          {userRole === "buyer" && (
            <>
              <Link
                to="/services"
                className="text-gray-700 text-sm hover:text-indigo-600 transition duration-300"
              >
                Buy Service
              </Link>
              <Link
                to="/client-dashboard"
                className="text-gray-700 text-sm hover:text-indigo-600 transition duration-300"
              >
                Dashboard
              </Link>
              <Link
                to="/message"
                className="text-gray-700 text-sm hover:text-indigo-600 transition duration-300"
              >
                Messages
              </Link>
            </>
          )}
          {userRole === "service provider" && (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 text-sm hover:text-indigo-600 transition duration-300"
              >
                Dashboard
              </Link>
              <Link
                to="/analytics"
                className="text-gray-700 text-sm hover:text-indigo-600 transition duration-300"
              >
                Analytics
              </Link>
              <Link
                to="/message"
                className="text-gray-700 text-sm hover:text-indigo-600 transition duration-300"
              >
                Messages
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Center - Search Bar (Desktop) */}
      <div className="md:block flex-grow hidden mx-6">
        <div className="relative">
          <FaSearch className="top-3 left-3 absolute text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            onChange={handleSearchChange}
            onKeyDown={handleSearch}
            className="bg-gray-100 py-2 pr-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-violet w-full text-gray-700"
          />
        </div>
      </div>

      {/* Right Side - Icons and Profile */}
      <div className="flex items-center space-x-4">
        <FaQuestionCircle className="w-5 h-5 text-gray-600 hover:text-indigo-600 cursor-pointer" />
        {userRole === "buyer" && (
          <Link to="/services">
            <FaTh className="w-5 h-5 text-gray-600 hover:text-indigo-600 cursor-pointer" />
          </Link>
        )}
        {userRole === "service provider" && (
          <Link to="/dashboard">
            <FaTh className="w-5 h-5 text-gray-600 hover:text-indigo-600 cursor-pointer" />
          </Link>
        )}
        <Link to="/message">
          <FaEnvelope className="w-5 h-5 text-gray-600 hover:text-indigo-600 cursor-pointer" />
        </Link>

        {currentUser ? (
          <ProfileDropdown />
        ) : (
          <Link to="/signup">
            <FaUser className="w-5 h-5 text-gray-600 hover:text-indigo-600 cursor-pointer" />
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-gray-700" onClick={toggleMenu}>
        <FaBars className="w-6 h-6" />
      </button>

      {/* Mobile Menu */}
      {menuOpen && userRole === "buyer" && (
        <div className="top-14 right-0 left-0 z-30 absolute flex flex-col space-y-4 md:hidden bg-white shadow-md p-4 text-gray-700">
          <Link to="/" className="hover:text-indigo-600">
            Home
          </Link>
          <Link to="/client-dashboard" className="hover:text-indigo-600">
            Dashboard
          </Link>
          <Link to="/services" className="hover:text-indigo-600">
            Services
          </Link>
          <Link to="/message" className="hover:text-indigo-600">
            Messages
          </Link>

          {/* Mobile Search Bar */}
          <div className="relative mt-4">
            <FaSearch className="top-3 left-3 absolute text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              onChange={handleSearchChange}
              onKeyDown={handleSearch}
              className="bg-gray-100 py-2 pr-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-violet w-full text-gray-700"
            />
          </div>
        </div>
      )}

      {menuOpen && userRole === "service provider" && (
        <div className="top-14 right-0 left-0 z-30 absolute flex flex-col space-y-4 md:hidden bg-white shadow-md p-4 text-gray-700">
          <Link to="/" className="hover:text-indigo-600">
            Home
          </Link>
          <Link to="/dashboard" className="hover:text-indigo-600">
            Dashboard
          </Link>
          <Link to="/analytics" className="hover:text-indigo-600">
            Analytics
          </Link>
          <Link to="/message" className="hover:text-indigo-600">
            Messages
          </Link>

          {/* Mobile Search Bar */}
          <div className="relative mt-4">
            <FaSearch className="top-3 left-3 absolute text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              onChange={handleSearchChange}
              onKeyDown={handleSearch}
              className="bg-gray-100 py-2 pr-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-violet w-full text-gray-700"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
