import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UPDATE_VM_URL = "http://127.0.0.1:8000/api/vms/update/6/";

const ManageVirtualMachine = () => {
    const [name, setName] = useState('Dummy VM'); 
    const [status, setStatus] = useState('running'); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [token, setToken] = useState("");

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) setToken(JSON.parse(accessToken));
    }, []);

    const updateVM = async () => {
        if (!token) return;
        setLoading(true);
        const data = {
            name: name,  
            status: status 
        };

        try {
            const response = await axios.put(UPDATE_VM_URL, data, {
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
            setError('Error updating virtual machine.');
            setTimeout(() => setError(""), 5000);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateVM();
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-6">Manage Virtual Machine</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-lg">VM Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-lg">Status:</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="running">Running</option>
                        <option value="stopped">Stopped</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full mt-6 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                    disabled={loading}
                >
                    {loading ? 'Updating VM...' : 'Update VM'}
                </button>
            </form>

            {/* Display Error or Success Messages */}
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">{success}</p>}
        </div>
    );
};

export default ManageVirtualMachine;
