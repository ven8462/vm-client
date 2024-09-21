import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SUBSCRIPTION_URL = "http://127.0.0.1:8000/api/subscribe/";

const SubscriptionManagement = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [token, setToken] = useState("");

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) setToken(JSON.parse(accessToken));
    }, []);

    const subscriptionPlans = [
        { name: 'Gold', icon: '💰' },
        { name: 'Platinum', icon: '🏆' },
        { name: 'Silver', icon: '🥈' },
        { name: 'Bronze', icon: '🥉' },
    ];

    const handleSubscribe = async (plan) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post(SUBSCRIPTION_URL, { plan: plan.toLowerCase() }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess(response.data.message); 
        } catch (error) {
            setError(error.response ? error.response.data.message : 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-wrap justify-center">
            <h2 className="text-3xl font-bold text-center w-full">Manage Subscription</h2>
            <p className="mt-4 text-lg text-center w-full">Manage your subscription plan here...</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                {subscriptionPlans.map((plan) => (
                    <div key={plan.name} className="border rounded-lg shadow-lg p-6 transform transition-transform hover:scale-105">
                        <div className="text-5xl text-center">{plan.icon}</div>
                        <h3 className="text-xl font-semibold text-center mt-4">{plan.name}</h3>
                        <button
                            onClick={() => handleSubscribe(plan.name)}
                            className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Subscribe'}
                        </button>
                    </div>
                ))}
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">{success}</p>}
        </div>
    );
};

export default SubscriptionManagement;
