import React, { useState } from 'react';
import ActiveOrderCard from './ActiveOrderCard';

const ActiveOrders = ({in_progressOrders , onUpdate}) => {
    // Sample data for active orders
    const [activeOrders, setActiveOrders] = useState(in_progressOrders);
    console.log('In progress' , activeOrders)

    const handleOrderComplete = (orderId) => {
        console.log(activeOrders)
    };
    return (
        <>
            <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {activeOrders.map(order => (
                    <ActiveOrderCard 
                        key={order._id} 
                        order={order} 
                        onOrderComplete={handleOrderComplete}
                        onUpdate = {onUpdate}
                    />
                ))}
            </div>
        </>
    );
};

export default ActiveOrders;
