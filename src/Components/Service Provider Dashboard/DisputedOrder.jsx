import React, { useState } from 'react';
import DisputedOrderCard from './DisputedOrderCard';

const DisputedOrders = ({ in_DisputedOrders, onUpdate, user }) => {

    const [disputedOrders, setDisputedOrders] = useState(in_DisputedOrders);
    console.log(in_DisputedOrders)
    console.log(user)

    return (
        <>
            {
                user === 'service provider' ? (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Disputed Orders</h2>
                        <p className="text-red-500">You have got disputed orders. Chat with your client to fix them.</p>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Reported Orders</h2>
                    </>
                )
            }
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {disputedOrders.map(order => (
                    <DisputedOrderCard
                        key={order._id}
                        order={order}
                        onUpdate={onUpdate}
                    />
                ))}
            </div>
        </>
    );
};

export default DisputedOrders;
