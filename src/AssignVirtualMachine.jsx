import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ASSIGN_VM_URL = "https://vm-server.onrender.com/api/assign-vm/";
const USERS_URL = "https://vm-server.onrender.com/api/standard-users/";
const VMS_URL = "https://vm-server.onrender.com/api/my-vms/";

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

    // Fetch token and initialize users and VMs data
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) setToken(JSON.parse(accessToken));
        if (token) {
            fetchUsers();
            fetchVMs();
        }
    }, [token]);

    // Fetch users from server
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(USERS_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const userData = response.data; // Assuming the response contains the list of users directly
            setUsers(userData);
            setFilteredUsers(userData);
        } catch (error) {
            setError("Error fetching users.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch virtual machines from server
    const fetchVMs = async () => {
        setError(null);
        setLoading(true);

        try {
            const response = await axios.get(VMS_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.data.success) {
                setVms(response.data.virtual_machines);
            } else {
                setError(response.data.message);
                setTimeout(() => setError(""), 5000);
            }
        } catch (error) {
            setError("Error fetching virtual machines.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Handle search input for users
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = users.filter(user =>
            user.username.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term)
        );

        setFilteredUsers(filtered);
    };

    // Handle assigning VM to selected user
    const handleAssign = async () => {
        if (!selectedVm || !selectedUser) {
            setError('Please select both a virtual machine and a user.');
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);

        const data = {
            vm_id: selectedVm.id,
            user_id: selectedUser
        }

        try {
            const response = await axios.put(ASSIGN_VM_URL, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (response.data.success) {
                setSuccess(response.data.message);
                setTimeout(() => setSuccess(null), 5000);
            } else {
                setError('Error assigning virtual machine.');
            }
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

            {loading && <p className="text-blue-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            {/* Ensure data is loaded before rendering dropdowns */}
            {vms.length > 0 && users.length > 0 ? (
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
                                <option key={user.id} value={user.id}>
                                    {user.username} ({user.email})
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
            ) : (
                <p className="text-gray-500 text-center">Loading data...</p>
            )}
        </div>
    );
};

export default AssignVirtualMachine;
