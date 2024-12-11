import React, { useMemo, useState } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import "./Pagination.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Home = ({ user, update }) => {
    const [users, setUsers] = useState(user.users || []);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        fullname: "",
        email: "",
        password: "",
        role: "",
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };

    console.log(users)

    const columns = useMemo(
        () => [
            { Header: "#", accessor: (_, index) => index + 1 },
            { Header: "Name", accessor: "name" },
            { Header: "Email", accessor: "email" },
            { Header: "User Type", accessor: "user_type" },
            { Header: "Verified", accessor: (row) => (row.verify ? "Yes" : "No") },
            {
                Header: "Actions",
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            onClick={() => handleEdit(row.original)}
                        >
                            Edit
                        </button>
                        <button
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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
        console.log("Edit:", user);
    };

    const handleDelete = (user) => {
        const confirmDelete = window.confirm(`Are you sure to delete ${user.name}?`);
        if (confirmDelete) {
            setUsers(users.filter((u) => u._id !== user._id));
        }
    };

    const handleAddUser = () => {
        setShowModal(true);
    }

    const notifyError = (message) => toast.error(message);
    const handleSaveUser = async () => {
        try {
            setLoading(true)
            // if (!newUser.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/)) {
            //     notifyError("Password must be at least 8 characters long and contain at least one number, one lowercase letter, one uppercase letter, and one special character."); // Display error notification
            //     setLoading(false); // Hide loader after request completes
            //     setShowModal(false);
            //     return;
            // }


            // // check the gmail is end with @gmail.com or not
            // if (!newUser.email.endsWith("@gmail.com")) {
            //     notifyError("Please enter a valid Gmail address."); // Display error notification
            //     setLoading(false); // Hide loader after request completes
            //     setShowModal(false);
            //     return;
            // }
            const response = await axios.post(
                "https://backend-qyb4mybn.b4a.run/api/admin/create",
                {
                    fullName: newUser.fullname,
                    email: newUser.email,
                    password: newUser.password,
                    user_type: newUser.role,
                }, {
                withCredentials: true, // Include credentials (cookies, HTTP auth, etc.)
            }
            );

            console.log(response)

            // Assuming the API returns the created user object
            if (response.status === 201) {
                const createdUser = response.data;
                console.log(createdUser)
                setUsers((prevUsers) => [createdUser, ...prevUsers]);
                setLoading(false)
                
                setShowModal(false);
                setNewUser({ fullname: "", email: "", password: "", role: "" });
            } else {
                alert("Failed to create user. Please try again.");
            }
        } catch (error) {
            setLoading(false)
            console.error("Error creating user:", error);
            alert("An error occurred while adding the user. Please try again.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto mt-10">
            <ToastContainer />
            <h1 className="text-2xl font-bold text-center mb-6">User Management</h1>
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handleAddUser}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Add User
                </button>
            </div>
            <div className="overflow-x-auto">
                <table
                    {...getTableProps()}
                    className="min-w-full bg-white border border-gray-200 rounded-xl table-auto"
                >
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-left"
                                    >
                                        {column.render("Header")}
                                        <span>
                                            {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
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
                                <tr {...row.getRowProps()} className="hover:bg-gray-50 transition-colors">
                                    {row.cells.map((cell) => (
                                        <td
                                            {...cell.getCellProps()}
                                            className="px-4 py-2 border-b border-gray-200"
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
                    className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {pageIndex + 1} of {pageOptions.length}
                </span>
                <button
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Add New User</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <input
                                type="text"
                                name="fullname"
                                value={newUser.fullname}
                                onChange={handleInputChange}
                                className="border-gray-300 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 w-full focus:outline-none"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={newUser.email}
                                onChange={handleInputChange}
                                className="border-gray-300 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 w-full focus:outline-none"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={newUser.password}
                                onChange={handleInputChange}
                                className="border-gray-300 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 w-full focus:outline-none"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Role</label>
                            <select
                                name="role"
                                value={newUser.role}
                                onChange={handleInputChange}
                                className="border-gray-300 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 w-full focus:outline-none"
                            >
                                <option value="">Select a role</option>
                                <option value="admin">Admin</option>
                                <option value="buyer">Buyer</option>
                                <option value="service_provider">Service Provider</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveUser}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                {loading ? (
                                    <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
                                ) : (
                                    'Save'
                                )}

                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
