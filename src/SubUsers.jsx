import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SUB_USERS_URL = "https://vm-server.onrender.com/api/sub-users/";
const CREATE_SUB_USER_URL = "https://vm-server.onrender.com/api/sub-users/create/";
const MAX_SUB_USERS = 10;

const SubUsers = () => {
    const [subUsers, setSubUsers] = useState([]);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [token, setToken] = useState("");
    const [showSubUsers, setShowSubUsers] = useState(false);  

    useEffect(() => {
        // Retrieve token from local storage
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            setToken(JSON.parse(accessToken));
            fetchSubUsers();  
        }
    }, []);

    const fetchSubUsers = async () => {
        if(!token) return;
        setLoading(true);

        try {
            const response = await axios.get(SUB_USERS_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if(response.data.success){
                setSubUsers(response.data.data); 
            }else{
                setError(response.data.message);
                setTimeout(()=> setError(""), 5000); 
            }
             
            
        } catch (error) {
            setError("Failed to fetch sub-users. Please try again.", error);
            setTimeout(()=> setError(""), 5000); 
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubUser = async () => {
        if(!token) return;
        setError(null);
        setSuccess(null);
        setLoading(true);

        if (subUsers.length >= MAX_SUB_USERS) {
            setError('You can only have up to 10 sub-users');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(CREATE_SUB_USER_URL, 
                { sub_username: username, assigned_model: 1.0 }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if(response.data.success){
                setSubUsers([...subUsers, response.data.data]); 
                setSuccess(response.data.message);
                setUsername("");
                setTimeout(() => setSuccess(""), 5000);
            } else{
                setError(response.data.message);
                setTimeout(() => setError(""), 5000);
            }

        } catch (error) {
            setError('Failed to add sub-user. Try again.');
            setTimeout(() => setError(""), 5000);
        } finally {
            setLoading(false);
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
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">{success}</p>}
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

                    {loading ? (
                        <p className="text-center">Loading sub-users...</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {subUsers.map((subUser) => (
                                <div
                                    key={subUser.id}
                                    className="border rounded-lg p-6"
                                >
                                    <h4 className="text-lg font-semibold">{subUser.sub_username}</h4>
                                    <p>Assigned VMs: {subUser.assigned_model}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Error and success messages */}
            
        </div>
    );
};

export default SubUsers;
