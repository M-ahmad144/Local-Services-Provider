import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { set } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';

const Review = ({ order_id, buyer_id ,addReview , loading, setLoading}) => {
    //naviate
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const reviewData = {
            order_id,
            buyer_id,
            rating,
            comment,
        };

        try {
            // setLoading(true);
           const response= await axios.post('https://backend-qyb4mybn.b4a.run/review/addreview', reviewData); // Replace with your API endpoint
           console.log(response.data);  
           
            setRating(0);
            setComment('');
            // setLoading(false);
           const newReview={
            buyer_name:currentUser.name,
            rating,
            review_text:comment,
            created_at: new Date().toISOString()

           }
              addReview(newReview);

           useNavigate('/client-dashboard');
            // toast.success('Review submitted successfully!'); //add review
            //add review
         // Reload the page to reflect the new review
        // setTimeout(() => {
        //     window.location.reload();
        // }, 0); // Wait for the toast to appear before reloading

        } catch (error) {
            toast.error('Failed to submit review. Please try again.');
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4">Review {  'Freelancer'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`w-8 h-8 text-lg ${
                                    star <= rating ? 'text-yellow-500' : 'text-gray-300'
                                }`}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Comment</label>
                    <textarea
                        className="w-full p-2 border rounded-lg"
                        rows="4"
                        placeholder="Write your review here..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg"
                    onClick={handleSubmit}
                >
                    Submit Review
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Review;
