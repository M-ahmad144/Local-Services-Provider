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
                        <h1 className="text-3xl font-semibold mb-4 mt-4">Disputed Orders</h1>
                        <p className="text-red-500">You have got disputed orders. Chat with your client to fix them.</p>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-semibold mb-4 mt-4">Reported Orders</h1>
                    </>
                )
            }
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {disputedOrders.length === 0 ? (
                    <p className="text-center text-xl font-semibold col-span-full">You don't have any disputed orders.</p>
                ) : (
                    disputedOrders.map(order => (
                        <DisputedOrderCard
                            key={order._id}
                            order={order}
                            onUpdate={onUpdate}
                        />
                    ))
                )}
            </div>

        </>
    );
};

export default DisputedOrders;
