import React, { useState , useEffect } from 'react';
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
    const [serviceprovider_name, setServiceprovider_name] = useState('robasa');
    const [description, setDescription] = useState('atif');

    const freelancer = {
    
        name: serviceprovider_name,
        description: description,
        image: 'https://via.placeholder.com/80',
        reviews: []
        // reviews: [
        //     { buyer_name: "John Smith", rating: 5, review_text: "Great job!", created_at: "2024-09-01T14:00:00Z" },
        //     { buyer_name: "Alice Brown", rating: 4, review_text: "Good work but could improve communication.", created_at: "2024-09-02T10:00:00Z" }
        // ]
    };
    // use Effect to get the freelancer data
    useEffect(() => {

        const getFreelancerData = async () => {
            try {
              const response = await axios.post("https://backend-qyb4mybn.b4a.run/review/reviewdata", {
                order_id,
                buyer_id,
              });
              
              console.log('Freelancer data:', response.data);
            //   now set values in freelancer

            freelancer.reviews = response.data.reviews;
            setReviews(freelancer.reviews);

                setServiceprovider_name(response.data.service_provider.name);
                setDescription(response.data.description);
            } catch (error) {
                console.error('Error fetching freelancer data:', error);
            }
        };
        getFreelancerData();


    }, []);

    const [reviews, setReviews] = useState([]);

    const addReview = (newReview) => {
        setReviews([...reviews, newReview]);
    };

    return (
        <div className="container mx-auto px-4 mt-3">
            <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-6">
                    {/* Freelancer Display Picture */}
                    <img
                        src={'https://via.placeholder.com/80'}
                        alt={`${freelancer.name} profile`}
                        className="w-20 h-20 rounded-full object-cover mr-4"
                    />
                    <div>
                        <h2 className="text-2xl font-bold">{serviceprovider_name}</h2>
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
                                    <div className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</div>
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

                <Review order_id={order_id} buyer_id={buyer_id} />
            </div>
        </div>
    );
};

export default FreelancerProfile;
