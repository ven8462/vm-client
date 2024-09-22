import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BILLING_URL = "http://127.0.0.1:8000/api/billing-info/";

const dummyData = [
  {
    name: "Virtual Machine 1",
    user: "Alice Johnson",
    subscription_plan: "Basic Plan",
    amount: 2000,
    status: "Active",
    transaction_id: "TX123456789",
  },
  {
    name: "Virtual Machine 2",
    user: "Bob Smith",
    subscription_plan: "Premium Plan",
    amount: 5000,
    status: "Active",
    transaction_id: "TX987654321",
  },
  {
    name: "Virtual Machine 3",
    user: "Charlie Brown",
    subscription_plan: "Pro Plan",
    amount: 3000,
    status: "Inactive",
    transaction_id: "TX112233445",
  },
];

const Billing = () => {
  const [loading, setLoading] = useState(false);
  const [bills, setBills] = useState([]);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) setToken(JSON.parse(accessToken));
  }, []);

  useEffect(() => {
    const fetchBills = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const response = await axios.get(BILLING_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setBills(response.data.billing_info);
        }
      } catch (error) {
        setError('Error fetching billing information.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [token]);

  // If there is no token, use dummy data for testing
  useEffect(() => {
    if (!token) {
      setBills(dummyData);
    }
  }, [token]);

  const handlePaymentToggle = (bill) => {
    setSelectedBill(bill);
    setPaymentVisible(!paymentVisible);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const detectCardType = (number) => {
    const visaPattern = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const masterCardPattern = /^5[1-5][0-9]{14}$/;
    const amexPattern = /^3[47][0-9]{13}$/;

    if (visaPattern.test(number)) return 'Visa';
    if (masterCardPattern.test(number)) return 'MasterCard';
    if (amexPattern.test(number)) return 'American Express';
    return 'Unknown';
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Mock payment logic can be added here
    alert(`Payment processed for KES ${selectedBill.amount} using ${detectCardType(cardDetails.cardNumber)} card.`);
    setPaymentVisible(false);
    setCardDetails({ cardNumber: "", expirationDate: "", cvv: "" });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold">Billing Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bills.map((bill, index) => (
          <div key={index} className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{bill.name}</h2>
            <p className="text-gray-700">User: {bill.user}</p>
            <p className="text-gray-700">Subscription plan: {bill.subscription_plan}</p>
            <p className="text-gray-700">Amount: KES {bill.amount}</p>
            <p className="text-gray-700">Status: {bill.status}</p>
            <p className="text-gray-700">Transaction ID: {bill.transaction_id}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => handlePaymentToggle(bill)}
            >
              Pay with Card
            </button>
          </div>
        ))}
      </div>

      {paymentVisible && selectedBill && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <h3 className="text-lg font-bold">Payment for KES {selectedBill.amount}</h3>
            <form onSubmit={handlePaymentSubmit} className="mt-4">
              <div className="mb-4">
                <label className="block text-sm">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleInputChange}
                  required
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Expiration Date (MM/YY)</label>
                <input
                  type="text"
                  name="expirationDate"
                  value={cardDetails.expirationDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  required
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleInputChange}
                  required
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="flex justify-between">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Submit Payment
                </button>
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setPaymentVisible(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
