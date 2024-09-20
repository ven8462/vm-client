import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ASSIGN_VM_URL = "http://127.0.0.1:8000/api/virtual-machines/";

const AssignVirtualMachine = () => {
    const [vms, setVms] = useState([
        { id: 1, name: 'VM1', status: 'running' },
        { id: 2, name: 'VM2', status: 'stopped' },
        { id: 3, name: 'VM3', status: 'running' },
    ]); // Dummy data for virtual machines
    const [users] = useState([
        { username: 'ouma', realName: 'John Ouma' },
        { username: 'arera', realName: 'Arera Arera' },
        { username: 'ouma1', realName: 'Ouma Onyango' },
        { username: 'ouma12', realName: 'Ouma John' }
    ]); // Dummy user data

    const [selectedVm, setSelectedVm] = useState(null);
    const [selectedUser, setSelectedUser] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [token, setToken] = useState("");

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) setToken(JSON.parse(accessToken));
    }, []);

    const handleAssign = async () => {
        if (!selectedVm || !selectedUser) {
            setError('Please select both a virtual machine and a user.');
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.put(
                `${ASSIGN_VM_URL}${selectedVm.id}/move/`,
                { new_owner: selectedUser }, // Sending selected new owner
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccess(`Successfully assigned VM ${selectedVm.name} to ${selectedUser}.`);
            setTimeout(() => setSuccess(null), 5000);
        } catch (error) {
            setError('Error assigning virtual machine.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-6">Assign Virtual Machine</h2>

            {loading && <p className="text-blue-500">Processing...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <div className="space-y-4">
                {/* Virtual Machines Dropdown */}
                <div>
                    <label htmlFor="vm" className="block mb-2 font-semibold">Select Virtual Machine</label>
                    <select
                        id="vm"
                        className="w-full border-gray-300 p-2 rounded-md"
                        onChange={(e) => {
                            const vmId = e.target.value;
                            setSelectedVm(vms.find((vm) => vm.id === parseInt(vmId)));
                        }}
                    >
                        <option value="">--Select Virtual Machine--</option>
                        {vms.map((vm) => (
                            <option key={vm.id} value={vm.id}>
                                {vm.name} ({vm.status})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Users Dropdown */}
                <div>
                    <label htmlFor="user" className="block mb-2 font-semibold">Select New Owner</label>
                    <select
                        id="user"
                        className="w-full border-gray-300 p-2 rounded-md"
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="">--Select New Owner--</option>
                        {users.map((user) => (
                            <option key={user.username} value={user.username}>
                                {user.realName}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleAssign}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                    disabled={loading}
                >
                    {loading ? 'Assigning...' : 'Assign Virtual Machine'}
                </button>
            </div>
        </div>
    );
};

export default AssignVirtualMachine;
