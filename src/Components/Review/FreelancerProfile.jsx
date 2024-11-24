import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Review = ({ order_id, buyer_id, addReview }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const reviewData = {
            order_id,
            buyer_id,
            rating,
            review_text: comment, // Ensure consistent field naming
        };

        try {
            const response = await axios.post('http://localhost:8080/review/addreview', reviewData);

            console.log('Review added:', response.data);

            // Call the parent addReview function to update the state
            addReview({
                ...reviewData,
                created_at: new Date().toISOString(), // Add created_at manually for UI
                buyer_name: 'You', // Placeholder, replace with actual buyer name
            });

            toast.success('Review submitted successfully!');
            setRating(0);
            setComment('');
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review. Please try again.');
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4">Review Freelancer</h3>
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
                >
                    Submit Review
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Review;
