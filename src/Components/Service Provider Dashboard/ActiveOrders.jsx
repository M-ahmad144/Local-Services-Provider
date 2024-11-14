import React, { useState } from "react";
import ActiveOrderCard from "./ActiveOrderCard";

const ActiveOrders = ({ in_progressOrders, onUpdate }) => {
  // Sample data for active orders
  const [activeOrders, setActiveOrders] = useState(in_progressOrders);
  console.log("In progress", activeOrders);

  const handleOrderComplete = (orderId) => {
    alert("order completed");
  };
  return (
    <>
      <h2 className="mb-4 font-semibold text-xl">Active Orders</h2>
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {activeOrders.map((order) => (
          <ActiveOrderCard
            key={order._id}
            order={order}
            onOrderComplete={handleOrderComplete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </>
  );
};

export default ActiveOrders;
