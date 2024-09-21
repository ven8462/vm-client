import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VM_URL = "http://127.0.0.1:8000/api/create-vms/";

const CreateVirtualMachine = () => {
    const [name, setName] = useState('');
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
        <div>
            <h2 className="text-3xl font-bold">Create Virtual Machine</h2>
            <p className="mt-4 text-lg">Enter the details of the virtual machine:</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                    <label className="block text-lg">VM Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-lg">Status:</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    >
                        <option value="running">Running</option>
                        <option value="stopped">Stopped</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                    disabled={loading}
                >
                    {loading ? 'Creating VM...' : 'Create VM'}
                </button>
            </form>

            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">{success}</p>}
        </div>
    );
};

export default CreateVirtualMachine;
