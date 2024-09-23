import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VMS_URL = "https://vm-server.onrender.com/api/my-vms/";
const EDIT_VMS_URL = "https://vm-server.onrender.com/api/edit-vm/";

const ManageVirtualMachines = () => {
    const [vms, setVms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [vmsPerPage] = useState(4);
    const [selectedVm, setSelectedVm] = useState(null);
    const [originalVm, setOriginalVm] = useState(null);  
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [token, setToken] = useState("");

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) setToken(JSON.parse(accessToken));

        const fetchVms = async () => {
            if(!token) return;
            setFetching(true);
            try {
                const response = await axios.get(VMS_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.success) {
                    setVms(response.data.virtual_machines);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                setError('Error fetching virtual machines.');
            } finally {
                setFetching(false);
            }
        };

        if (token) {
            fetchVms();
        }
    }, [token]);

    const indexOfLastVm = currentPage * vmsPerPage;
    const indexOfFirstVm = indexOfLastVm - vmsPerPage;
    const currentVms = vms.slice(indexOfFirstVm, indexOfLastVm);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleEdit = (vm) => {
        setSelectedVm(vm);
        
        setOriginalVm(vm);  
        setOverlayVisible(true);
    };

    const handleUpdateVm = async (e) => {
        e.preventDefault();
        if (!token || !selectedVm) return;
        setLoading(true);
        console.log(selectedVm);
        Object.entries(selectedVm).forEach(([key, value]) => console.log(`${key} : ${value}`));

        try {
            const response = await axios.put(`${EDIT_VMS_URL}${selectedVm.id}/`, selectedVm, {
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
            setSelectedVm(null);
        }
    };

    const closeOverlay = () => {
        setOverlayVisible(false);
        setSelectedVm(null);
    };

    // Function to check if the VM has been modified
    const isVmModified = () => {
        if (!selectedVm || !originalVm) return false;
        return JSON.stringify(selectedVm) !== JSON.stringify(originalVm);
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg relative">
            <h2 className="text-3xl font-bold text-center mb-6">Manage Virtual Machines</h2>

            {fetching ? (
                <p className="text-center text-gray-600">Loading virtual machines...</p>
            ) : (
                <>
                    {/* List VMs in card view */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {currentVms.map((vm) => (
                            <div key={vm.id} className="border rounded-lg p-4 shadow-lg">
                                <h3 className="text-2xl font-semibold">{vm.name}</h3>
                                <p className="text-gray-700 mt-2">{vm.cpu}</p>
                                <p className="text-gray-700 mt-2">{vm.ram}</p>
                                <p className="text-gray-700 mt-2">${vm.cost}/month</p>
                                <p className="text-gray-700 mt-2">Status: {vm.status}</p>
                                <p className="text-gray-700">Created At: {new Date(vm.created_at).toLocaleString()}</p>
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
                </>
            )}

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
                                <label className="block text-lg">Cost:</label>
                                <input
                                    type="text"
                                    value={selectedVm?.cost || ''}
                                    onChange={(e) => setSelectedVm({ ...selectedVm, cost: e.target.value })}
                                    className="w-full px-4 py-2 border rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-lg">Status:</label>
                                <input
                                    type="text"
                                    value={selectedVm?.status || ''}
                                    onChange={(e) => setSelectedVm({ ...selectedVm, status: e.target.value })}
                                    className="w-full px-4 py-2 border rounded"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={`mt-4 py-2 px-4 rounded text-white ${isVmModified() ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
                                disabled={!isVmModified() || loading}
                            >
                                {loading ? 'Updating...' : 'Update VM'}
                            </button>

                            {success && <p className="text-green-500 mt-2">{success}</p>}
                            {error && <p className="text-red-500 mt-2">{error}</p>}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageVirtualMachines;
