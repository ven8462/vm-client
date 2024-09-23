import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DELETE_VM_URL = "https://vm-server.onrender.com/api/vms/delete/";
const VMS_URL = "https://vm-server.onrender.com/api/my-vms/";

const VirtualMachineList = () => {
    const [vms, setVms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [token, setToken] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [vmsPerPage] = useState(10);
    const [deletingVMId, setDeletingVMId] = useState(null); // Track which VM is being deleted

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) setToken(JSON.parse(accessToken));
        fetchVMs();
    }, [token]);

    const fetchVMs = async () => {
        if (!token) return; // Ensure token is available before fetching

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(VMS_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data;
            if (data.success) {
                setVms(data.virtual_machines);
            } else {
                setError("Failed to fetch virtual machines.");
            }
        } catch (err) {
            setError("Error fetching virtual machines.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!token) return;
        setDeletingVMId(id); // Mark the VM as being deleted
        setError(null);
        console.log("ID: ", id)

        try {
            const response = await axios.delete(`${DELETE_VM_URL}${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 204) {
                // VM successfully deleted, update the local state
                setVms(vms.filter((vm) => vm.id !== id));
            } else {
                setError("Failed to delete virtual machine.");
            }
        } catch (error) {
            setError("Error deleting virtual machine.");
            console.error(error);
        } finally {
            setDeletingVMId(null); // Reset deleting state
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
                                        disabled={deletingVMId === vm.id} // Disable button only for the VM being deleted
                                    >
                                        {deletingVMId === vm.id ? 'Deleting...' : 'Delete'}
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
