import React, {useEffect, useState } from 'react';
import axios from 'axios';

const BILLING_URL="http://127.0.0.1:8000/api/billing-info/";

const Billing = () => {
  const [loading, setLoading] = useState(false);
  const [bills, setBills] =useState([]);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if(accessToken) setToken(JSON.parse(accessToken))
  }, [])

  useEffect(() => {
    const fetchBills = async () => {
        if(!token) return;
        setLoading(true);
        try {
            const response = await axios.get(BILLING_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            if(response.data.success){
              setBills(response.data.billing_info);
            }

             
        } catch (error) {
            setError('Error fetching virtual machines.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    fetchBills();
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold">Billing Information</h2>
      <p className="mt-4 text-lg">View and manage your billing details here...</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bills.map((vm, index) => (
          <div key={index} className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{vm.name}</h2>
            <p className="text-gray-700">User: {vm.user}</p>
            <p className="text-gray-700">Subscription plan: {vm.subscription_plan}</p>
            <p className="text-gray-700">Amount: {vm.amount}</p>
            <p className="text-gray-700">Status: {vm.status}</p>
            <p className="text-gray-700">Transaction ID: {vm.transaction_id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Billing;
