import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BACKUP_URL = "https://vm-server.onrender.com/api/create-backup/";
const VM_LIST_URL = "https://vm-server.onrender.com/api/vms/assigned/";

const CreateBackup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [token, setToken] = useState("");
  const [virtualMachines, setVirtualMachines] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVM, setSelectedVM] = useState(null);
  const [totalBill, setTotalBill] = useState(0);

  useEffect(() =>{
    const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        setToken(JSON.parse(accessToken));
      }
  }, [])
  useEffect(() => {
    const fetchVMs = async () => {
      if(!token) return;

      try {
        const response = await axios.get(VM_LIST_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setVirtualMachines(response.data.data);
        } else {
          setError("Failed to fetch virtual machines.");
        }
      } catch (error) {
        console.error("Error fetching virtual machines:", error);
        setError("Error fetching virtual machines.");
      }
    };

    fetchVMs();
  }, []);

  // Calculate bill based on the size of data to back up
  const calculateBill = (size) => {
    return size * 50; // KES 50 per MB
  };

  // Handle backup click
  const handleBackupClick = (vm) => {
    const bill = calculateBill(vm.dataNotBackedUp);
    setTotalBill(bill);
    setSelectedVM(vm);
    setModalOpen(true);
  };

  // Post backup request to the backend
  const postBackup = async () => {
    if (!token || !selectedVM) return;
    setLoading(true);

    const data = {
      vm: selectedVM.id,
      size: selectedVM.dataNotBackedUp,
      bill: totalBill // Include the calculated bill in the request
    };

    try {
      const response = await axios.post(BACKUP_URL, data, {
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
      setError('Error creating backup.');
      setTimeout(() => setError(""), 5000);
      console.error(error);
    } finally {
      setLoading(false);
      setModalOpen(false); // Close the modal after the backup is done
    }
  };

  // Close the modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedVM(null);
    setTotalBill(0);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (success) return <p className="text-green-500">{success}</p>;

  return (
    <div>
      <h2 className="text-3xl text-center font-bold">Create Backup</h2>
      <table className="min-w-full mt-5 border">
        <thead>
          <tr>
            <th className="border px-4 py-2">VM ID</th>
            <th className="border px-4 py-2">VM Name</th>
            <th className="border px-4 py-2">Data Not Backed Up (MB)</th>
            <th className="border px-4 py-2">Data Backed Up (MB)</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {virtualMachines.length > 0 ? (
            virtualMachines.map((vm) => (
              <tr key={vm.id}>
                <td className="border px-4 py-2">{vm.id}</td>
                <td className="border px-4 py-2">{vm.name}</td>
                <td className="border px-4 py-2">{vm.dataNotBackedUp} MB</td>
                <td className="border px-4 py-2">{vm.dataBackedUp} MB</td>
                <td className="border px-4 py-2">
                  <button
                    className="text-blue-500"
                    onClick={() => handleBackupClick(vm)}
                  >
                    Backup
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="border px-4 py-2 text-center">No virtual machines found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <h3 className="text-lg font-bold">Confirm Backup</h3>
            <p>Total Bill: KES {totalBill}</p>
            <div className="mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={postBackup}
              >
                Confirm Backup
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBackup;
