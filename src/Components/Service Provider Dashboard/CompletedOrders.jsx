import React, { useState } from 'react';
import CompletedOrderCard from './CompletedOrderCard';

const CompletedOrders = ({completedOrders}) => {
    return (
        <>
            <h2 className="text-3xl font-semibold mb-4">Completed Orders</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {completedOrders.map(order => (
                    <CompletedOrderCard 
                        key={order.id} 
                        order={order} 
                    />
                ))}
            </div>
        </>
    );
};

export default CompletedOrders;
