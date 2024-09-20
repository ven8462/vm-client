import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DELETE_VM_URL = "http://127.0.0.1:8000/api/vms/delete/";

const VirtualMachineList = () => {
    const [vms, setVms] = useState([
        { id: 1, name: 'VM1', status: 'running' },
        { id: 2, name: 'VM2', status: 'stopped' },
        { id: 3, name: 'VM3', status: 'running' },
        { id: 4, name: 'VM4', status: 'stopped' }
    ]); // Dummy data for virtual machines
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [token, setToken] = useState("");

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) setToken(JSON.parse(accessToken));
    }, []);

    const handleDelete = async (id) => {
        if (!token) return;
        setLoading(true);
        setError(null);

        try {
            await axios.delete(`${DELETE_VM_URL}${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Remove the deleted VM from the local state
            setVms(vms.filter((vm) => vm.id !== id));

        } catch (error) {
            setError('Error deleting virtual machine.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-6">Virtual Machines</h2>
            {loading && <p className="text-blue-500">Processing...</p>}
            {error && <p className="text-red-500 mt-4">{error}</p>}
            
            <div className="space-y-4">
                {vms.map((vm) => (
                    <div key={vm.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                            <h3 className="text-xl font-semibold">{vm.name}</h3>
                            <p>Status: <span className={vm.status === 'running' ? 'text-green-500' : 'text-red-500'}>{vm.status}</span></p>
                        </div>
                        <button
                            onClick={() => handleDelete(vm.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                ))}
            </div>

            {/* If no virtual machines are available after deletion */}
            {vms.length === 0 && (
                <p className="text-center text-gray-500 mt-6">No virtual machines available.</p>
            )}
        </div>
    );
};

export default VirtualMachineList;
