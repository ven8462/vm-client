import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SUB_USERS_URL = "http://127.0.0.1:8000/api/sub-users/";
const MAX_SUB_USERS = 10;
const MAX_VMS = 5;  // Maximum VMs assignable to a sub-user

const SubUsers = () => {
    const [subUsers, setSubUsers] = useState([
        { id: 1, username: 'john_doe', vms: 2 },
        { id: 2, username: 'jane_smith', vms: 3 },
        { id: 3, username: 'peter_parker', vms: 1 }
    ]);  // Initialized with dummy data
    const [username, setUsername] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);  // Currently selected sub-user
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [token, setToken] = useState("");
    const [showSubUsers, setShowSubUsers] = useState(false);  // Toggle for showing sub-users
    const vmManagementRef = useRef(null);  // For closing the VM management div

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) setToken(JSON.parse(accessToken));

        // Fetch current sub-users (disabled for now because of dummy data)
        // fetchSubUsers();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (vmManagementRef.current && !vmManagementRef.current.contains(event.target)) {
                setSelectedUser(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAddSubUser = async () => {
        setError(null);
        setSuccess(null);
        setLoading(true);

        if (subUsers.length >= MAX_SUB_USERS) {
            setError('You can only have up to 10 sub-users');
            setLoading(false);
            return;
        }

        try {
            const newSubUser = { id: subUsers.length + 1, username, vms: 0 };
            setSubUsers([...subUsers, newSubUser]);
            setSuccess('Sub-user added successfully');
            setUsername("");  // Clear input
        } catch (error) {
            setError('Failed to add sub-user. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSubUser = (subUser) => {
        setSelectedUser(subUser);
        setError(null);
        setSuccess(null);
    };

    const assignVmToSubUser = () => {
        if (selectedUser.vms < MAX_VMS) {
            const updatedUser = { ...selectedUser, vms: selectedUser.vms + 1 };
            setSubUsers(subUsers.map(user => user.id === selectedUser.id ? updatedUser : user));
            setSelectedUser(updatedUser);
        } else {
            setError('Maximum VMs assigned');
        }
    };

    const removeVmFromSubUser = () => {
        if (selectedUser.vms > 0) {
            const updatedUser = { ...selectedUser, vms: selectedUser.vms - 1 };
            setSubUsers(subUsers.map(user => user.id === selectedUser.id ? updatedUser : user));
            setSelectedUser(updatedUser);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-center w-full">Manage Sub-Users</h2>

            {/* Input to add a new sub-user */}
            <div className="mt-4 w-full flex flex-col items-center">
                <input
                    type="text"
                    placeholder="Enter sub-user username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 w-64 rounded"
                />
                <button
                    onClick={handleAddSubUser}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                    disabled={loading || username.trim() === ""}
                >
                    {loading ? 'Adding...' : 'Add Sub-User'}
                </button>
            </div>

            {/* Button to show/hide sub-users */}
            <div className="mt-6">
                <button
                    onClick={() => setShowSubUsers(!showSubUsers)}
                    className="bg-gray-700 text-white py-2 px-6 rounded hover:bg-gray-800 transition duration-300"
                >
                    {showSubUsers ? 'Hide Sub-Users' : 'Show Sub-Users'}
                </button>
            </div>

            {/* Display current sub-users if toggled */}
            {showSubUsers && (
                <div className="w-full mt-4">
                    <h3 className="text-xl font-semibold text-center">Current Sub-Users</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {subUsers.map((subUser) => (
                            <div
                                key={subUser.id}
                                onClick={() => handleSelectSubUser(subUser)}
                                className={`border rounded-lg p-6 cursor-pointer ${selectedUser && selectedUser.id === subUser.id ? 'border-blue-500' : 'hover:shadow-lg'}`}
                            >
                                <h4 className="text-lg font-semibold">{subUser.username}</h4>
                                <p>Assigned VMs: {subUser.vms}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sub-user VM Management */}
            {selectedUser && (
                <div ref={vmManagementRef} className="mt-8 w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative">
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="absolute top-0 right-0 m-2 text-gray-700 text-lg font-bold"
                    >
                        ×
                    </button>
                    <h3 className="text-2xl font-bold text-center">Manage VMs for {selectedUser.username}</h3>
                    <p className="text-lg text-center mt-4">Assigned VMs: <strong>{selectedUser.vms}</strong></p>
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={assignVmToSubUser}
                            className={`bg-blue-500 text-white py-2 px-4 rounded ${selectedUser.vms >= MAX_VMS ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={selectedUser.vms >= MAX_VMS}
                        >
                            Assign VM
                        </button>
                        <button
                            onClick={removeVmFromSubUser}
                            className={`bg-gray-500 text-white py-2 px-4 rounded ${selectedUser.vms === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={selectedUser.vms === 0}
                        >
                            Remove VM
                        </button>
                    </div>
                </div>
            )}

            {/* Error and success messages */}
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">{success}</p>}
        </div>
    );
};

export default SubUsers;
