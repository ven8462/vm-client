import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BILLING_URL = "https://vm-server.onrender.com/api/unpaid-backups/";
const PAYMENT_URL = "https://vm-server.onrender.com/api/make-payment/";

const Billing = () => {
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });
  const [paymentMessage, setPaymentMessage] = useState("");

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

        if(response.data.success){
          setBills(response.data.data); 
        } else{
          setError(response.data.message);
          setTimeout(() => setError(""), 5000);
        }

      } catch (error) {
        setError('');
        setTimeout(() => setError(""), 3000);

        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [token]);

  const handlePaymentToggle = (backup) => {
    setSelectedBackup(backup);
    setPaymentVisible(!paymentVisible);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(PAYMENT_URL, {
        backup_id: selectedBackup.id, // Adjust based on your backend
        amount: selectedBackup.bill,
        card_number: cardDetails.cardNumber,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setPaymentMessage(`Payment successful for KES ${selectedBackup.bill}.`);
        // Optionally, refresh the bill list after payment
        setBills(bills.filter(bill => bill.id !== selectedBackup.id));
      }
    } catch (error) {
      setPaymentMessage('Payment failed. Please try again.');
      console.error(error);
    } finally {
      setPaymentVisible(false);
      setCardDetails({ cardNumber: "", expirationDate: "", cvv: "" });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold">Billing Information</h2>
      {paymentMessage && <p className="text-green-500">{paymentMessage}</p>}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border-b p-2">VM Name</th>
            <th className="border-b p-2">Size</th>
            <th className="border-b p-2">Amount</th>
            <th className="border-b p-2">Status</th>
            <th className="border-b p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((backup) => (
            <tr key={backup.id}>
              <td className="border-b p-2">{backup.vm_name}</td>
              <td className="border-b p-2">{backup.size}</td>
              <td className="border-b p-2">KES {backup.bill}</td>
              <td className="border-b p-2">{backup.status}</td>
              <td className="border-b p-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handlePaymentToggle(backup)}
                >
                  Pay
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {paymentVisible && selectedBackup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <h3 className="text-lg font-bold">Payment for KES {selectedBackup.bill}</h3>
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
