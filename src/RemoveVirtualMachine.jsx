import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DELETE_VM_URL = "http://127.0.0.1:8000/api/vms/delete/";
// const VM_LIST_URL = "http://127.0.0.1:8000/api/vms/"; // Commented out for dummy data

const VirtualMachineList = () => {
    const [vms, setVms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [token, setToken] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [vmsPerPage] = useState(10);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) setToken(JSON.parse(accessToken));
        fetchVMs();
    }, [token]);

    const fetchVMs = async () => {
        setLoading(true);
        setError(null);

        // Dummy data for testing
        const dummyData = [
            { id: 1, name: 'VM1', cpu: '2 CPU', ram: '4 GB', cost: '$10/month', status: 'running' },
            { id: 2, name: 'VM2', cpu: '4 CPU', ram: '8 GB', cost: '$20/month', status: 'stopped' },
            { id: 3, name: 'VM3', cpu: '1 CPU', ram: '2 GB', cost: '$5/month', status: 'running' },
            { id: 4, name: 'VM4', cpu: '8 CPU', ram: '16 GB', cost: '$40/month', status: 'running' },
            { id: 5, name: 'VM5', cpu: '16 CPU', ram: '32 GB', cost: '$80/month', status: 'stopped' },
            { id: 6, name: 'VM6', cpu: '2 CPU', ram: '4 GB', cost: '$10/month', status: 'running' },
            { id: 7, name: 'VM7', cpu: '4 CPU', ram: '8 GB', cost: '$20/month', status: 'stopped' },
            { id: 8, name: 'VM8', cpu: '1 CPU', ram: '2 GB', cost: '$5/month', status: 'running' },
            { id: 9, name: 'VM9', cpu: '8 CPU', ram: '16 GB', cost: '$40/month', status: 'running' },
            { id: 10, name: 'VM10', cpu: '16 CPU', ram: '32 GB', cost: '$80/month', status: 'stopped' },
            { id: 11, name: 'VM11', cpu: '2 CPU', ram: '4 GB', cost: '$10/month', status: 'running' },
        ];

        // Simulating an API response
        setTimeout(() => {
            setVms(dummyData);
            setLoading(false);
        }, 500);
    };

    const handleDelete = async (id) => {
        if (!token) return;
        setLoading(true);
        setError(null);

        // Simulating deletion
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Remove the deleted VM from the local state
            setVms(vms.filter((vm) => vm.id !== id));
        } catch (error) {
            setError('Error deleting virtual machine.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Pagination logic
    const indexOfLastVM = currentPage * vmsPerPage;
    const indexOfFirstVM = indexOfLastVM - vmsPerPage;
    const currentVMs = vms.slice(indexOfFirstVM, indexOfLastVM);
    const totalPages = Math.ceil(vms.length / vmsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-6">Virtual Machines</h2>
            {loading && <p className="text-blue-500">Processing...</p>}
            {error && <p className="text-red-500 mt-4">{error}</p>}
            
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">CPU</th>
                        <th className="border p-2">RAM</th>
                        <th className="border p-2">Cost</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentVMs.length > 0 ? (
                        currentVMs.map((vm) => (
                            <tr key={vm.id} className="border-b">
                                <td className="border p-2">{vm.name}</td>
                                <td className="border p-2">{vm.cpu}</td>
                                <td className="border p-2">{vm.ram}</td>
                                <td className="border p-2">{vm.cost}</td>
                                <td className="border p-2">
                                    <span className={vm.status === 'running' ? 'text-green-500' : 'text-red-500'}>
                                        {vm.status}
                                    </span>
                                </td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => handleDelete(vm.id)}
                                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition duration-300"
                                        disabled={loading}
                                    >
                                        {loading ? 'Deleting...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center p-4 text-gray-500">No virtual machines available.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination controls */}
            <div className="mt-4 flex justify-center space-x-2">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default VirtualMachineList;
