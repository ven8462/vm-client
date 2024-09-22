import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DUMMY_VMS = [
    { id: 1, name: 'VM 1', cpu: '2 vCPUs', ram: '4 GB', rate: '$20/month' },
    { id: 2, name: 'VM 2', cpu: '4 vCPUs', ram: '8 GB', rate: '$40/month' },
    { id: 3, name: 'VM 3', cpu: '8 vCPUs', ram: '16 GB', rate: '$80/month' },
    { id: 4, name: 'VM 4', cpu: '16 vCPUs', ram: '32 GB', rate: '$160/month' },
    { id: 5, name: 'VM 5', cpu: '32 vCPUs', ram: '64 GB', rate: '$320/month' },
    { id: 6, name: 'VM 6', cpu: '64 vCPUs', ram: '128 GB', rate: '$640/month' },
];

const ManageVirtualMachines = () => {
    const [vms, setVms] = useState(DUMMY_VMS);
    const [currentPage, setCurrentPage] = useState(1);
    const [vmsPerPage] = useState(4);
    const [selectedVm, setSelectedVm] = useState(null);
    const [overlayVisible, setOverlayVisible] = useState(false);

    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) setToken(JSON.parse(accessToken));
    }, []);

    const indexOfLastVm = currentPage * vmsPerPage;
    const indexOfFirstVm = indexOfLastVm - vmsPerPage;
    const currentVms = vms.slice(indexOfFirstVm, indexOfLastVm);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleEdit = (vm) => {
        setSelectedVm(vm);
        setOverlayVisible(true);
    };

    const handleUpdateVm = async (e) => {
        e.preventDefault();
        if (!token || !selectedVm) return;
        setLoading(true);

        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/vms/update/${selectedVm.id}/`, selectedVm, {
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
        } finally {
            setLoading(false);
            setOverlayVisible(false);
            setSelectedVm(null); // Reset selected VM after update
        }
    };

    const closeOverlay = () => {
        setOverlayVisible(false);
        setSelectedVm(null);
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg relative">
            <h2 className="text-3xl font-bold text-center mb-6">Manage Virtual Machines</h2>

            {/* List VMs in card view */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentVms.map((vm) => (
                    <div key={vm.id} className="border rounded-lg p-4 shadow-lg">
                        <h3 className="text-2xl font-semibold">{vm.name}</h3>
                        <p className="text-gray-700 mt-2">CPU: {vm.cpu}</p>
                        <p className="text-gray-700">RAM: {vm.ram}</p>
                        <p className="text-gray-700">Rate: {vm.rate}</p>
                        <button
                            onClick={() => handleEdit(vm)}
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6 space-x-2">
                {[...Array(Math.ceil(vms.length / vmsPerPage)).keys()].map((number) => (
                    <button
                        key={number + 1}
                        onClick={() => paginate(number + 1)}
                        className={`py-2 px-4 border rounded ${currentPage === number + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {number + 1}
                    </button>
                ))}
            </div>

            {/* Overlay for Edit VM Form */}
            {overlayVisible && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50" onClick={closeOverlay}>
                    <div className="bg-white p-6 rounded-lg shadow-lg relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={closeOverlay}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                        >
                            X
                        </button>
                        <h3 className="text-2xl font-semibold mb-4">Edit Virtual Machine</h3>
                        <form onSubmit={handleUpdateVm} className="space-y-4">
                            <div>
                                <label className="block text-lg">VM Name:</label>
                                <input
                                    type="text"
                                    value={selectedVm?.name || ''}
                                    onChange={(e) => setSelectedVm({ ...selectedVm, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-lg">CPU:</label>
                                <input
                                    type="text"
                                    value={selectedVm?.cpu || ''}
                                    onChange={(e) => setSelectedVm({ ...selectedVm, cpu: e.target.value })}
                                    className="w-full px-4 py-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-lg">RAM:</label>
                                <input
                                    type="text"
                                    value={selectedVm?.ram || ''}
                                    onChange={(e) => setSelectedVm({ ...selectedVm, ram: e.target.value })}
                                    className="w-full px-4 py-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-lg">Rate per month:</label>
                                <input
                                    type="text"
                                    value={selectedVm?.rate || ''}
                                    onChange={(e) => setSelectedVm({ ...selectedVm, rate: e.target.value })}
                                    className="w-full px-4 py-2 border rounded"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={`w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Updating VM...' : 'Update VM'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Error or Success Messages */}
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">{success}</p>}
        </div>
    );
};

export default ManageVirtualMachines;
