// src/components/HelpSupport.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import ContactModal from "./ContactModal"; // Import the new ContactModal component

const HelpSupport = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissionResponse, setSubmissionResponse] = useState(null);

  const handleContactClick = () => {
    // Open the modal to contact support
    setIsModalOpen(true);
  };

  const handleFormSubmit = (formData) => {
    // Here, you can handle the form data (e.g., call an API or store the data)
    console.log("Form Data Submitted:", formData);

    // Mock response after submission
    setSubmissionResponse(
      "Thank you for contacting us! We will get back to you shortly."
    );

    // Reset the form data state (optional)
    setIsModalOpen(false);
  };

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
              onClick={handleContactClick}
              className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 text-white focus:outline-none transition duration-300 ease-in-out"
            >
              Contact
            </button>
          </div>

          {/* FAQs Link */}
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

        {/* Show submission response */}
        {submissionResponse && (
          <div className="border-green-300 bg-green-100 mt-6 p-4 border rounded-md text-green-700">
            {submissionResponse}
          </div>
        )}
      </div>

      {/* Modal for Contact Form */}
      {isModalOpen && (
        <ContactModal
          onClose={() => setIsModalOpen(false)}
          onFormSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default HelpSupport;
