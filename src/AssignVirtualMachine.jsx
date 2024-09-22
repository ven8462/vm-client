import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ASSIGN_VM_URL = "http://127.0.0.1:8000/api/virtual-machines/";
const USERS_URL = "http://127.0.0.1:8000/api/users/";
const VMS_URL = "http://127.0.0.1:8000/api/virtual-machines/";

const AssignVirtualMachine = () => {
    const [vms, setVms] = useState([]);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedVm, setSelectedVm] = useState(null);
    const [selectedUser, setSelectedUser] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) setToken(JSON.parse(accessToken));
        fetchUsers();
        fetchVMs();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        // Simulating API response
        const dummyUserData = [
            { id: 1, username: 'ouma', realName: 'John Ouma', email: 'ouma@example.com' },
            { id: 2, username: 'arera', realName: 'Arera Arera', email: 'arera@example.com' },
            { id: 3, username: 'ouma1', realName: 'Ouma Onyango', email: 'ouma1@example.com' },
            { id: 4, username: 'ouma12', realName: 'Ouma John', email: 'ouma12@example.com' }
        ];

        setTimeout(() => {
            setUsers(dummyUserData);
            setFilteredUsers(dummyUserData);
            setLoading(false);
        }, 500);
    };

    const fetchVMs = async () => {
        setLoading(true);
        setError(null);

        // Simulating API response
        const dummyVMData = [
            { id: 1, name: 'VM1', status: 'running' },
            { id: 2, name: 'VM2', status: 'stopped' },
            { id: 3, name: 'VM3', status: 'running' },
        ];

        setTimeout(() => {
            setVms(dummyVMData);
            setLoading(false);
        }, 500);
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = users.filter(user =>
            user.realName.toLowerCase().includes(term) ||
            user.username.toLowerCase().includes(term)
        );

        setFilteredUsers(filtered);
    };

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
                { new_owner: selectedUser },
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

                {/* User Search */}
                <div>
                    <label htmlFor="userSearch" className="block mb-2 font-semibold">Search User</label>
                    <input
                        type="text"
                        id="userSearch"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search by name or username"
                        className="w-full border-gray-300 p-2 rounded-md"
                    />
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
                        {filteredUsers.map((user) => (
                            <option key={user.id} value={user.username}>
                                {user.realName} ({user.username}) - {user.email}
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
