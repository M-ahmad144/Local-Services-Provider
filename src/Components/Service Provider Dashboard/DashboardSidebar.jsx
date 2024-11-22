import React from 'react';

const Sidebar = () => {
  return (
    <div className="bg-white text-gray-900 p-4 space-y-6 sticky top-0 shadow-md mr-1">
      <ul className="space-y-4">
        <li>
          <a
            href="#services"
            className="block px-4 py-2 rounded-md hover:bg-gray-100 transition duration-300"
          >
            Current Services
          </a>
        </li>
        <li>
          <a
            href="#activeOrders"
            className="block px-4 py-2 rounded-md hover:bg-gray-100 transition duration-300"
          >
            Active Orders
          </a>
        </li>
        <li>
          <a
            href="#disputedOrders"
            className="block px-4 py-2 rounded-md hover:bg-gray-100 transition duration-300"
          >
            Disputed Orders
          </a>
        </li>
        <li>
          <a
            href="#pendingOrders"
            className="block px-4 py-2 rounded-md hover:bg-gray-100 transition duration-300"
          >
            Pending Orders
          </a>
        </li>
        <li>
          <a
            href="#completedOrders"
            className="block px-4 py-2 rounded-md hover:bg-gray-100 transition duration-300"
          >
            Completed Orders
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
