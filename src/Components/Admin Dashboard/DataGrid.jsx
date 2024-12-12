import React, { useState, useEffect } from "react";
import axios from "axios";
import ResponsivePagination from "react-responsive-pagination";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./Pagination.css";

const AdminDashboard = ({user}) => {
  const [users, setUsers] = useState(user.users || []);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;


  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startingRowNumber = (currentPage - 1) * usersPerPage + 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">User Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-xl table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-left rounded-tl-xl">
                #
              </th>
              <th className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-left">
                Name
              </th>
              <th className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-left">
                Email
              </th>
              <th className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-left">
                User Type
              </th>
              <th className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-left">
                Verified
              </th>
              <th className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-left">
                Profile Description
              </th>
              <th className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-left">
                Location
              </th>
              <th className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-left rounded-tr-xl">
                Skills
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2 border-b border-gray-200">
                  {startingRowNumber + index}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {user.name}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {user.email}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {(user.user_type == "buyer" && "Buyer") ||
                    (user.user_type == "service_provider" &&
                      "Service Provider") ||
                    "Admin"}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {user.verify ? "Yes" : "No"}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {user.profile_description || "N/A"}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {user.location || "N/A"}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {user.skills.join(", ") || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 py-3">
        <ResponsivePagination
          current={currentPage}
          total={totalPages}
          onPageChange={handlePageChange}
          previousLabel="Previous"
          nextLabel="Next"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;