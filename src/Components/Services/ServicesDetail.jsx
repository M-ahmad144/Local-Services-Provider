import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHandshake, FaEnvelope } from 'react-icons/fa'; // Import icons
import HireModal from './HireModal'; // Import the modal component
import socket from '../sockets/socket';
import { useSelector } from 'react-redux';
import { current } from '@reduxjs/toolkit';
import Loader from '../loader';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


const getReviews = async (serviceId) => {
    const response = await axios.get(`https://backend-qyb4mybn.b4a.run/review/review-by-service?serviceId=${serviceId}`);
    return response.data;
};

const ServiceDetails = () => {
    const navigate = useNavigate()
    const { currentUser } = useSelector((state) => state.user)
    const userId = currentUser._id


    const location = useLocation();
    const { service } = location.state || {};
    const receiveId = service.user_id._id
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
    const [showModal, setShowModal] = useState(false);

    // Limit to 5 reviews for initial display


    const { data: reviews, error: reviewError, isLoading: reviewLoading, refetch: refetchreview } = useQuery({
        queryKey: ['review', service._id],
        queryFn: () => getReviews(service._id),
        staleTime: 0,
        cacheTime: 0,
    });

    if (reviewLoading) {
        return <Loader />;
    }

    // Show error if there is one
    if (reviewError) {
        return <div>Error: {reviewError?.message}</div>;
    }

    if (!service) return <p>No service data available</p>;
    const displayedReviews = reviews.slice(0, 3);

    console.log(reviews)
    const handleContactClick = () => {
        if (!socket.connected) {
            console.error("Socket not connected");
            return;
        }

        // Trigger the createChat event when the user clicks Contact
        socket.emit("createChat", { senderId: userId, receiverId: receiveId });
        // Listen for either the existing or newly created chat
        socket.on("chatExists", (chat) => {
            const chatId = chat._id; // Extract chat ID
            socket.emit("joinRoom", chat._id);
            console.log(service.user_id.name)
            console.log(service.user_id.profile_image)
            navigate(`/message/id?query=${encodeURIComponent(chatId)}&title=${encodeURIComponent(service?.user_id?.name)}&img=${encodeURIComponent(service?.user_id?.profile_image)}`); // Navigate to the messageSection with chat ID
        });
        socket.on("chatCreated", (newChat) => {
            const chatId = newChat._id; // Extract chat ID
            socket.emit("joinRoom", newChat._id);
            navigate(`/message/id?query=${encodeURIComponent(chatId)}`);
        });
    };



    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = parseFloat(totalRating / reviews.length).toFixed(2);


    return (
        <div className="container mx-auto px-4 py-10 max-w-4xl">
            <div className="flex flex-col md:flex-row">
                {/* Main content on the left */}
                <div className="flex-1 md:mr-8">
                    <h1 className="text-2xl font-bold mb-4">{service.title}</h1>

                    <img
                        src={service.service_images}
                        alt={service.title}
                        className="w-full h-64 object-cover rounded-md mb-4"
                    />


                    <p className="text-xl font-bold mb-4">From Price: Rs {service.price}</p>
                    <p className="text-xl font-bold mb-4">No of revisions: Rs {service.revision_count}</p>


                    <div className="flex items-center mb-4">
                        <Link to='/profile' state={{ userId: service.user_id._id }}>
                            <img
                                src={service.user_id.profile_image}
                                alt={service.name}
                                className="w-12 h-12 rounded-full mr-2"
                            />
                        </Link>
                        <div className="text-lg font-semibold">{service.user_id.name}</div>
                    </div>

                    <div className="text-sm mb-4 flex items-center">
                        <span className="text-yellow-400 text-xl mr-1">★</span> {/* Single star */}
                        <span className="mr-2">{averageRating}</span> {/* Rating value */}
                        <span className="text-gray-500">({reviews.length} ratings)</span> {/* Number of ratings */}
                    </div>

                    <div className="flex gap-4 mb-3">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-1/2 bg-green-500 hover:bg-green-600 py-3 rounded-full flex items-center justify-center font-medium text-sm text-white sm:text-base transition duration-300"
                        >
                            <FaHandshake className="mr-2" /> Hire
                        </button>

                        <button
                            onClick={handleContactClick}
                            className="w-1/2" // Ensure the Link behaves like a block element
                        >
                            <div className="w-full bg-[#5433FF] hover:bg-indigo-600 py-3 rounded-full flex items-center justify-center font-medium text-sm text-white sm:text-base transition duration-300">
                                <FaEnvelope className="mr-2" /> Contact
                            </div>
                        </button>
                    </div>

                </div>

                {/* About My Services section on the right */}
                <div className="space-y-4">
                    {reviews.length ? (
                        <>
                            {displayedReviews.map((review, index) => (
                                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-sm font-bold">{review.buyer_id.name}</div>
                                        <div className="text-sm text-gray-500 ml-2">{new Date(review.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <div className="text-yellow-500">
                                        {Array(review.rating).fill('★').join('')}
                                        {Array(5 - review.rating).fill('☆').join('')}
                                    </div>
                                    <p>{review.review_text}</p>
                                </div>
                            ))}

                            {reviews.length > 5 && (
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Show More
                                </button>
                            )}

                            {showModal && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                    <div className="relative bg-white rounded-lg w-full max-w-3xl h-[80vh] p-6 overflow-y-auto">
                                        {/* Close Button */}
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                                        >
                                            ✕
                                        </button>

                                        <h2 className="text-lg font-bold mb-4">All Reviews</h2>
                                        <div className="space-y-4">
                                            {reviews.map((review, index) => (
                                                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="text-sm font-bold">{review.buyer_id.name}</div>
                                                        <div className="text-sm text-gray-500">
                                                            {new Date(review.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="text-yellow-500">
                                                        {Array(review.rating).fill('★').join('')}
                                                        {Array(5 - review.rating).fill('☆').join('')}
                                                    </div>
                                                    <p>{review.review_text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </div>
            </div>

            {/* Modal for Hiring */}
            {isModalOpen && <HireModal onClose={() => setIsModalOpen(false)} service={service} />}
        </div>
    );
};

export default ServiceDetails;
