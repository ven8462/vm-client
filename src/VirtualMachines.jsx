import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VMS_URL='http://127.0.0.1:8000/api/my-vms/';

const VirtualMachines = () => {
  const [vms, setVms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if(accessToken) setToken(JSON.parse(accessToken))
  }, [])

  useEffect(() => {
    const fetchVMs = async () => {
        if(!token) return;
        setLoading(true);
        try {
            const response = await axios.get(VMS_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            setVms(response.data.data); 
        } catch (error) {
            setError('Error fetching virtual machines.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    fetchVMs();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-100 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">My Virtual Machines</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vms.map((vm, index) => (
          <div key={index} className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{vm.name}</h2>
            <p className="text-gray-700">Owner: {vm.owner}</p>
            <p className="text-gray-700">Status: {vm.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualMachines;
