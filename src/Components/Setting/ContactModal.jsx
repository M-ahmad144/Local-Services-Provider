// src/components/ContactModal.js

import React, { useState } from "react";

const ContactModal = ({ onClose, onFormSubmit }) => {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { email, message };

    // Call the parent callback to handle the submission (e.g., store data or call API)
    onFormSubmit(formData);

    onClose(); // Close the modal after submission
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 transition-all duration-300 ease-in-out">
      <div className="bg-white shadow-lg p-8 rounded-xl w-11/12 sm:w-96 max-w-lg transform transition-transform duration-300 ease-in-out scale-95 hover:scale-100">
        <h3 className="mb-6 font-semibold text-2xl text-center text-gray-900">
          Contact Support
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block font-medium text-gray-800">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-gray-300 shadow-sm p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block font-medium text-gray-800"
            >
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="border-gray-300 shadow-sm p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full focus:outline-none"
              placeholder="Describe your issue or inquiry"
              rows="5"
            ></textarea>
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 text-lg hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold text-lg text-white transition duration-300 ease-in-out"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
