import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaServer } from 'react-icons/fa'; // Import icon for visual enhancement

const VM_URL = "http://127.0.0.1:8000/api/create-vms/";

const CreateVirtualMachine = () => {
    const [name, setName] = useState('');
    const [cpu, setCpu] = useState('2 vCPUs'); // New state for CPU
    const [ram, setRam] = useState('4 GB'); // New state for RAM
    const [cost, setCost] = useState('$20/month'); // New state for cost
    const [status, setStatus] = useState('running');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [token, setToken] = useState("");

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) setToken(JSON.parse(accessToken));
    }, []);

    const createVM = async () => {
        if (!token) return;
        setLoading(true);
        const data = {
            name: name,
            cpu: cpu,
            ram: ram,
            cost: cost,
            status: status
        };

        try {
            const response = await axios.post(VM_URL, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setSuccess(response.data.message);
                setTimeout(() => setSuccess(""), 5000);
            } else {
                setError(response.data.message);
                setTimeout(() => setError(""), 5000);
            }
        } catch (error) {
            setError('Error creating virtual machine.');
            setTimeout(() => setError(""), 5000);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createVM();
    };

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
            <div className="text-center mb-6">
                <FaServer className="inline-block text-blue-500 text-4xl mb-2" />
                <h2 className="text-4xl font-bold text-gray-800">Create Virtual Machine</h2>
                <p className="mt-2 text-gray-500">Enter the details to create a new virtual machine</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-lg font-semibold text-gray-700">VM Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                        placeholder="Enter VM name"
                        required
                    />
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-700">CPU:</label>
                    <input
                        type="text"
                        value={cpu}
                        onChange={(e) => setCpu(e.target.value)}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                        placeholder="Enter CPU capacity"
                        required
                    />
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-700">RAM:</label>
                    <input
                        type="text"
                        value={ram}
                        onChange={(e) => setRam(e.target.value)}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                        placeholder="Enter RAM size"
                        required
                    />
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-700">Cost per month:</label>
                    <input
                        type="text"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                        placeholder="Enter cost per month"
                        required
                    />
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-700">Status:</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                        required
                    >
                        <option value="running">Running</option>
                        <option value="stopped">Stopped</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className={`w-full mt-6 py-2 rounded-lg bg-blue-500 text-white font-semibold transition duration-300 hover:bg-blue-600 shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Creating VM...' : 'Create VM'}
                </button>
            </form>

            {/* Display error or success messages */}
            {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
            {success && <p className="mt-4 text-green-600 text-center">{success}</p>}
        </div>
    );
};

export default CreateVirtualMachine;
