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
      <h1 className="text-3xl font-semibold mb-4 mt-4">Active Orders</h1>
      {activeOrders.length === 0 ? (
        <p className="text-center text-xl font-semibold col-span-full">You don't have any active orders.</p>
      ) : (
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {activeOrders.map((order) => (
            <ActiveOrderCard
              key={order._id}
              order={order}
              onOrderComplete={handleOrderComplete}
              onUpdate={onUpdate}
            />
          ))}
        </div>)}
    </>
  );
};

export default ActiveOrders;
