import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SUBSCRIPTION_URL = "http://127.0.0.1:8000/api/subscribe/";

const SubscriptionManagement = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [token, setToken] = useState("");
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [loadingPlanId, setLoadingPlanId] = useState(null); // Track which plan is being loaded
    const [showModal, setShowModal] = useState(false); // Modal visibility
    const [selectedPlan, setSelectedPlan] = useState(null); // Selected plan for confirmation

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) setToken(JSON.parse(accessToken));

        // Simulate fetching current subscription
        setCurrentSubscription('Silver'); // Hardcoded current subscription for demonstration
    }, []);

    const subscriptionPlans = [
        { id: 1, name: 'Gold', icon: '💰', vms: 10, backupSize: '500GB' },
        { id: 2, name: 'Platinum', icon: '🏆', vms: 20, backupSize: '1TB' },
        { id: 3, name: 'Silver', icon: '🥈', vms: 5, backupSize: '200GB' },
        { id: 4, name: 'Bronze', icon: '🥉', vms: 2, backupSize: '100GB' },
    ];

    const handleSubscribe = (plan) => {
        // Set selected plan and show confirmation modal
        setSelectedPlan(plan);
        setShowModal(true);
    };

    const confirmSubscriptionChange = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        setLoadingPlanId(selectedPlan.id); // Set the loading plan ID

        try {
            const response = await axios.post(SUBSCRIPTION_URL, { plan: selectedPlan.name.toLowerCase() }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess(response.data.message);
            setCurrentSubscription(selectedPlan.name); // Update current subscription
        } catch (error) {
            setError(error.response ? error.response.data.message : 'Something went wrong!');
        } finally {
            setLoading(false);
            setLoadingPlanId(null); // Reset loading plan ID
            setShowModal(false); // Close the modal
        }
    };

    const getSubscriptionChangeType = () => {
        const currentPlanIndex = subscriptionPlans.findIndex(plan => plan.name === currentSubscription);
        const selectedPlanIndex = subscriptionPlans.findIndex(plan => plan.name === selectedPlan.name);
        return selectedPlanIndex > currentPlanIndex ? 'downgrading' : 'upgrading';
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-center w-full">Manage Subscription</h2>
            <p className="mt-4 text-lg text-center w-full">Current Subscription: <strong>{currentSubscription}</strong></p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                {subscriptionPlans.map((plan) => (
                    <div key={plan.id} className="border rounded-lg shadow-lg p-6 transform transition-transform hover:scale-105">
                        <div className="text-5xl text-center">{plan.icon}</div>
                        <h3 className="text-xl font-semibold text-center mt-4">{plan.name}</h3>
                        <p className="mt-2 text-center">Virtual Machines: {plan.vms}</p>
                        <p className="mt-1 text-center">Backup Size: {plan.backupSize}</p>
                        <button
                            onClick={() => handleSubscribe(plan)}
                            className={`w-full mt-4 py-2 rounded transition duration-300 ${
                                currentSubscription === plan.name 
                                ? 'bg-gray-400 cursor-not-allowed' // Disabled style for current subscription
                                : 'bg-blue-500 text-white hover:bg-blue-600' // Enabled style for other plans
                            }`}
                            disabled={loadingPlanId === plan.id || currentSubscription === plan.name} // Disable if already subscribed to this plan or the plan is loading
                        >
                            {loadingPlanId === plan.id ? 'Submitting...' : currentSubscription === plan.name ? 'Current Plan' : 'Subscribe'}
                        </button>
                    </div>
                ))}
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">{success}</p>}

            {/* Modal for confirmation */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-80">
                        <h3 className="text-lg font-semibold mb-4">Confirm Subscription Change</h3>
                        <p>
                            You are about to {getSubscriptionChangeType()} your subscription to <strong>{selectedPlan.name}</strong>.
                        </p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="mr-2 bg-gray-300 py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSubscriptionChange}
                                className="bg-blue-500 text-white py-2 px-4 rounded"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionManagement;
