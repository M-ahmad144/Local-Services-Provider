import React from "react";
import { Link } from "react-router-dom";

const HelpSupport = () => {
  return (
    <div className="flex justify-center items-center p-4 min-h-screen">
      <div className="bg-white shadow-lg p-6 border rounded-lg w-full max-w-lg">
        <h2 className="mb-6 font-bold text-3xl text-gray-900">
          Help & Support
        </h2>
        <div className="space-y-6">
          {/* Contact Support */}
          <div className="flex justify-between items-center bg-gray-50 shadow-sm hover:shadow-md p-4 rounded-lg transition-shadow duration-300 ease-in-out">
            <span className="font-medium text-gray-800 text-lg">
              Contact Support
            </span>
            <button
              aria-label="Contact support"
              className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 text-white focus:outline-none transition duration-300 ease-in-out"
            >
              Contact
            </button>
          </div>

          {/* FAQs */}
          <div className="flex justify-between items-center bg-gray-50 shadow-sm hover:shadow-md p-4 rounded-lg transition-shadow duration-300 ease-in-out">
            <span className="font-medium text-gray-800 text-lg">FAQs</span>
            <Link
              to="/settings/FAQ"
              aria-label="View FAQs"
              className="font-medium text-blue-600 text-lg hover:underline transition duration-300 ease-in-out"
            >
              View FAQs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
