import React, { useMemo, useState } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Modal component for Add User and Delete Confirmation
const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  onSave,
  onSaveEdit,
  user,
  type,
  loading,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white shadow-lg p-6 rounded-lg w-96">
        {type === "add" ? (
          <>
            <h2 className="mb-4 font-bold text-xl">Add New User</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-sm">
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={user.fullname}
                onChange={onSave}
                required
                className="border-gray-300 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 w-full focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={onSave}
                className="border-gray-300 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 w-full focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={onSave}
                className="border-gray-300 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 w-full focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-sm">Role</label>
              <select
                name="role"
                value={user.role}
                onChange={onSave}
                className="border-gray-300 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 w-full focus:outline-none"
              >
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="buyer">Buyer</option>
                <option value="service_provider">Service Provider</option>
              </select>
            </div>
          </>
        ) : type === "edit" ? (
          <>
            <h2 className="mb-4 font-bold text-xl">Edit User</h2>
            {/* Edit User Form */}
            <div className="mb-4">
              <label className="block mb-1 font-medium text-sm">
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={user.fullname}
                onChange={onSave}
                className="border-gray-300 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 w-full focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                disabled
                className="border-gray-300 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 w-full focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-sm">
                User Type
              </label>
              <select
                name="role"
                value={user.role}
                onChange={onSave}
                className="border-gray-300 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 w-full focus:outline-none"
              >
                <option value="buyer">Buyer</option>
                <option value="service provider">Service Provider</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-sm">Verified</label>
              <select
                name="verify"
                value={user.verify}
                onChange={onSave}
                className="border-gray-300 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 w-full focus:outline-none"
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-4 font-bold text-xl">Confirm Deletion</h2>
            <p>
              Are you sure you want to delete user <strong>{user.name}</strong>?
            </p>
          </>
        )}

        <div className="flex justify-end gap-2 mt-4">
          {type === "add" ? (
            <>
              <button
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
                ) : (
                  "Save"
                )}
              </button>
            </>
          ) : type === "edit" ? (
            <>
              <button
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => onSaveEdit(user)} // Call the separate save edit function here
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(user)}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Home = ({ user, update }) => {
  const [users, setUsers] = useState(user.users || []);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
    verify: false
  });
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for deletion
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState(""); // Modal type (add or delete)

  const handleInputChange = (e) => {

    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const columns = useMemo(
    () => [
      { Header: "#", accessor: (_, index) => index + 1 },
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      {
        Header: "User Type",
        accessor: (row) =>
          row.user_type == "service provider"
            ? "Service Provider"
            : row.user_type == "admin"
            ? "Admin"
            : "Buyer",
      },
      { Header: "Verified", accessor: (row) => (row.verify ? "Yes" : "No") },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-white"
              onClick={() => handleEdit(row.original)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-white"
              onClick={() => handleDelete(row.original)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const data = useMemo(() => users, [users]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageOptions,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  const handleEdit = (user) => {
    setSelectedUser(user); // Set the selected user for editing
    setModalType("edit"); // Set modal type to edit
    setNewUser({
      fullname: user.name,
      email: user.email,
      role: user.user_type,
      verify: user.verify,
    });
    setShowModal(true); // Open the modal
  };

  const handleSaveEdit = async (user) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `https://backend-qyb4mybn.b4a.run/api/admin/edit/${user._id}`,
        {
          fullName: newUser.fullname,
          user_type: newUser.role,
          verify: newUser.verify,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Extract the updated user from the response body
        // Log the updated user
        const updatedUser = response.data.data

        // Update the user list by replacing the old user with the updated user
        setUsers((prevUsers) =>
          prevUsers.map(
            (u) => (u._id === updatedUser._id ? { ...u, ...updatedUser } : u) // Replace old user with updated user
          )
        );
        setLoading(false);
        setShowModal(false);
        toast.success("User updated successfully!");
      } else {
        toast.error("Failed to update user.");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating user:", error);
      toast.error("An error occurred while updating the user.");
    }
  };

  const handleDelete = (user) => {
    setSelectedUser(user); // Set the selected user for deletion
    setModalType("delete"); // Set modal type to delete
    setShowModal(true); // Open the modal
  };

  const handleAddUser = () => {
    setModalType("add"); // Set modal type to add
    setShowModal(true); // Open the modal for adding a new user
  };

  const notifyError = (message) => toast.error(message);

  const handleSaveUser = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://backend-qyb4mybn.b4a.run/api/admin/create",
        {
          fullName: newUser.fullname,
          email: newUser.email,
          password: newUser.password,
          user_type: newUser.role,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        const createdUser = response.data;
        setUsers((prevUsers) => [createdUser, ...prevUsers]);
        setLoading(false);
        setShowModal(false);
        setNewUser({ fullname: "", email: "", password: "", role: "" });
      } else {
        alert("Failed to create user. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error creating user:", error);
      alert("An error occurred while adding the user. Please try again.");
    }
  };

  const handleConfirmDelete = async (user) => {
    try {
      await axios.delete(
        `https://backend-qyb4mybn.b4a.run/api/admin/delete/${user._id}`,
        {
          withCredentials: true,
        }
      );

      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id)); // Remove the user from the list
      setShowModal(false);
      toast.success(`User ${user.name} deleted successfully!`);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting the user.");
      setShowModal(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-7xl">
      <ToastContainer />
      <h1 className="mb-6 font-bold text-2xl text-center">User Management</h1>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleAddUser}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
        >
          Add User
        </button>
      </div>
      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="border-gray-200 bg-white border rounded-xl min-w-full table-auto"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="border-gray-200 bg-gray-100 px-4 py-2 border-b text-left"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " ▼"
                          : " ▲"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="border-gray-200 px-4 py-2 border-b"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="bg-gray-300 disabled:opacity-50 px-4 py-2 rounded"
        >
          Previous
        </button>
        <span>
          Page {pageIndex + 1} of {pageOptions.length}
        </span>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="bg-gray-300 disabled:opacity-50 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

      {/* Modal for Add User and Delete Confirmation */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        onSave={handleInputChange}
        onSaveEdit={handleSaveEdit}
        user={modalType === "add" ? newUser : selectedUser}
        type={modalType} // Pass the modal type (add or delete)
        loading={loading}
      />
    </div>
  );
};

export default Home;
