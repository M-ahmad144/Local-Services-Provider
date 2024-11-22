import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../loader';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";


const HireModal = ({ onClose, service }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(''); // State for validation errors
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setValidationError(''); // Clear previous validation error

        // Check for empty fields
        if (!date || !time || !price || !description) {
            setValidationError('Please fill out all fields to proceed forward');
            return;
        }

        setLoading(true);  
        setError(null);

        const order = {
            service_id: service._id,
            buyer_id: currentUser._id,
            service_provider_id: service.user_id._id,
            date,
            time,
            price,
            description,
        };

        try {
            const response = await axios.post(`https://backend-qyb4mybn.b4a.run/order/create`, order);

            if (response.status === 201) {
                console.log('Order created successfully', response.data);
                setLoading(false);
                navigate('/client-dashboard'); // Navigate to client dashboard on success
            } else {
                setError('Failed to create order. Please try again.');
            }
        } catch (err) {
            setError('An error occurred while creating the order.');
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Hire Service</h2>
                <form>
                    {/* Validation Error */}
                    {validationError && (
                        <p className="text-red-500 text-sm mb-4">{validationError}</p>
                    )}

                    <div className="mb-4">
                        <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border-gray-300 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-custom-violet w-full focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="time" className="block text-sm font-medium mb-1">Time</label>
                        <input
                            type="time"
                            id="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="border-gray-300 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-custom-violet w-full focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="price" className="block text-sm font-medium mb-1">Price (Rs)</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="border-gray-300 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-custom-violet w-full focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium mb-1">Work Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            className="border-gray-300 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-custom-violet w-full focus:outline-none"
                            required
                        ></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded-md text-sm font-medium text-gray-800 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`py-2 px-4 rounded-md text-sm font-medium text-white ${
                                loading ? 'bg-gray-400' : 'bg-custom-violet hover:bg-custom-violet-dark'
                            }`}
                        >
                            {loading ? (
                                <FontAwesomeIcon
                                    icon={faSpinner}
                                    spin
                                    className="mx-auto w-5 h-5"
                                />
                            ) : (
                                'Hire'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HireModal;

