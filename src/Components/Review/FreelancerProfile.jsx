import React, { useState, useEffect } from 'react';
import Review from './Review';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { set } from 'react-hook-form';

const FreelancerProfile = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { order_id, buyer_id } = location.state || {};
    const { currentUser } = useSelector((state) => state.user);
    const [freelancerData, setFreelancerData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Fetch freelancer data on component mount
    useEffect(() => {
        const getFreelancerData = async () => {
            try {
                const response = await axios.post("http://localhost:8080/review/reviewdata", {
                    order_id,
                    buyer_id,
                });

                console.log('Freelancer data:', response.data);
                setFreelancerData(response.data);
                setName(response.data.serviceprovider_name);
                setDescription(response.data.description);
                if (response.data.reviews) {
                    setReviews(response.data.reviews);
                }
            } catch (error) {
                console.error('Error fetching freelancer data:', error);
            }
        };

        getFreelancerData();
    }, [order_id, buyer_id]);

    const addReview = (newReview) => {
        setReviews([...reviews, newReview]);
    };

    return (
        <div className="container mx-auto px-4 mt-3">
            <div className="bg-white rounded-lg p-6 shadow-md">
                {freelancerData ? (
                    <>
                        <div className="flex items-center mb-6">
                            {/* Freelancer Display Picture */}
                            <img
                                src={freelancerData.image || 'https://via.placeholder.com/80'}
                                alt={`${freelancerData.serviceprovider_name || 'Freelancer'} profile`}
                                className="w-20 h-20 rounded-full object-cover mr-4"
                            />
                            <div>
                                <h2 className="text-2xl font-bold">{name}</h2>
                                <p>{description || 'No description available.'}</p>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold mt-6 mb-2">Reviews</h3>
                        <div className="space-y-4">
                            {reviews.length ? (
                                reviews.map((review, index) => (
                                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="text-sm font-bold">{review.clientName || 'Anonymous'}</div>
                                            <div className="text-sm text-gray-500">{new Date(review.timestamp).toLocaleDateString()}</div>
                                        </div>
                                        <div className="text-yellow-500">
                                            {Array(review.rating).fill('★').join('')}
                                            {Array(5 - review.rating).fill('☆').join('')}
                                        </div>
                                        <p>{review.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews yet.</p>
                            )}
                        </div>

                        {/* Add Review Component */}
                        <Review order_id={order_id} buyer_id={buyer_id} addReview={addReview} />
                    </>
                ) : (
                    <p>Loading freelancer data...</p>
                )}
            </div>
        </div>
    );
};

export default FreelancerProfile;
