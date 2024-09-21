import React from 'react';
import { FaDesktop, FaServer, FaMicrochip, FaCloud, FaDatabase, FaLaptop, FaRobot, FaHdd, FaNetworkWired } from 'react-icons/fa';

const GuestDashboard = () => {
  // Dummy data for virtual machines
  const virtualMachines = [
    { id: 1, name: 'VM Alpha', status: 'Running', icon: <FaDesktop /> },
    { id: 2, name: 'VM Beta', status: 'Stopped', icon: <FaServer /> },
    { id: 3, name: 'VM Gamma', status: 'Running', icon: <FaMicrochip /> },
    { id: 4, name: 'VM Delta', status: 'Stopped', icon: <FaCloud /> },
    { id: 5, name: 'VM Epsilon', status: 'Running', icon: <FaDatabase /> },
    { id: 6, name: 'VM Zeta', status: 'Stopped', icon: <FaLaptop /> },
    { id: 7, name: 'VM Eta', status: 'Running', icon: <FaRobot /> },
    { id: 8, name: 'VM Theta', status: 'Stopped', icon: <FaHdd /> },
    { id: 9, name: 'VM Iota', status: 'Running', icon: <FaNetworkWired /> },
    { id: 10, name: 'VM Kappa', status: 'Stopped', icon: <FaServer /> },
  ];

  return (
    <div className="h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Guest Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {virtualMachines.map((vm) => (
          <div
            key={vm.id}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <div className="text-5xl text-blue-500 mb-4">
              {vm.icon}
            </div>
            <h2 className="text-xl font-bold mb-2">{vm.name}</h2>
            <p className={`text-lg font-semibold ${vm.status === 'Running' ? 'text-green-500' : 'text-red-500'}`}>
              {vm.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestDashboard;
