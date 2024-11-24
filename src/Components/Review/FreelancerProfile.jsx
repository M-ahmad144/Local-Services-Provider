import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Loader from '../loader/index';
import Review from './Review';

const FreelancerProfile = () => {
    const [loading, setLoading] = useState(false);
    const [serviceProviderName, setServiceProviderName] = useState('');
    const [description, setDescription] = useState('');
    const [reviews, setReviews] = useState([]);
    const location = useLocation();
    const { order_id, buyer_id } = location.state || {};
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchFreelancerData = async () => {
            try {
                setLoading(true);
                const response = await axios.post('https://backend-qyb4mybn.b4a.run/review/reviewdata', {
                    order_id,
                    buyer_id,
                });
                const { service_provider_name, description, reviews } = response.data;

                setServiceProviderName(service_provider_name || 'N/A');
                setDescription(description || 'No description available.');
                setReviews(reviews || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching freelancer data:', error);
                setLoading(false);
            }
        };

        fetchFreelancerData();
    }, [order_id, buyer_id]);

    const addReview = (newReview) => {
        setReviews((prevReviews) => [...prevReviews, newReview]);
    };

    return (
        <div className="container mx-auto px-4 mt-3">
            {loading && <Loader />}
            {!loading && (
                <div className="bg-white rounded-lg p-6 shadow-md">
                    <div className="flex items-center mb-6">
                        {/* Freelancer Display Picture */}
                        <img
                            src="https://via.placeholder.com/80"
                            alt={`${serviceProviderName} profile`}
                            className="w-20 h-20 rounded-full object-cover mr-4"
                        />
                        <div>
                            <h2 className="text-2xl font-bold">{serviceProviderName}</h2>
                            <p>{description}</p>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mt-6 mb-2">Reviews</h3>
                    <div className="space-y-4">
                        {reviews.length ? (
                            reviews.map((review, index) => (
                                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-sm font-bold">{review.buyer_name}</div>
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
                            ))
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                    </div>

                    {/* Review Form */}
                    <Review
                        order_id={order_id}
                        buyer_id={buyer_id}
                        addReview={addReview}
                        loading={loading}
                        setLoading={setLoading}
                    />
                </div>
            )}
        </div>
    );
};

export default FreelancerProfile;
