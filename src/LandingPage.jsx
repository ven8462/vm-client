import React, { useState } from 'react';
import { FaDesktop, FaServer, FaMicrochip } from 'react-icons/fa';
import LoginForm from './LoginForm';
import Signup from './Signup';

const LandingPage = () => {
  const [showForm, setShowForm] = useState('none'); // 'login', 'signup', or 'none'

  const handleGetStarted = () => {
    setShowForm('login'); // Default to login when getting started
  };

  const toggleLoginForm = () => {
    setShowForm(showForm === 'login' ? 'none' : 'login');
  };

  const toggleSignupForm = () => {
    setShowForm(showForm === 'signup' ? 'none' : 'signup');
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowForm('none');
    }
  };

  // Updated dummy data for virtual machines
  const virtualMachines = [
    { id: 1, name: 'VM Alpha', status: 'Running', cpu: '2 vCPUs', ram: '4 GB', cost: '$20/month', icon: <FaDesktop /> },
    { id: 2, name: 'VM Beta', status: 'Stopped', cpu: '4 vCPUs', ram: '8 GB', cost: '$40/month', icon: <FaServer /> },
    { id: 3, name: 'VM Gamma', status: 'Running', cpu: '8 vCPUs', ram: '16 GB', cost: '$80/month', icon: <FaMicrochip /> },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white p-5 bg-gray-900">
      {/* Login/Signup Button */}
      <div className="absolute top-5 right-5">
        <button
          onClick={toggleLoginForm}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold shadow-lg transition-transform hover:scale-105 duration-300 ease-in-out"
        >
          Login
        </button>
        <button
          onClick={toggleSignupForm}
          className="ml-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold shadow-lg transition-transform hover:scale-105 duration-300 ease-in-out"
        >
          Signup
        </button>
      </div>

      {/* Hero Section */}
      <header className="text-center space-y-4 mb-10">
        <h1 className="text-5xl font-bold lg:text-6xl backdrop-blur-md bg-opacity-60 p-5 rounded-lg bg-gray-800 shadow-lg">
          VM Management Platform
        </h1>
        <p className="text-lg lg:text-xl backdrop-blur-md bg-opacity-60 p-4 rounded-lg bg-gray-800 shadow-lg">
          Automate and manage your virtual machines effortlessly with a simplified interface.
        </p>
      </header>

      {/* Virtual Machines Showcase */}
      <section className="mt-10 w-full lg:w-3/4">
        <h2 className="text-3xl font-semibold text-center mb-5 bg-gray-800 bg-opacity-70 p-4 rounded-lg shadow-lg">
          Featured Virtual Machines
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {virtualMachines.map((vm) => (
            <div
              key={vm.id}
              className="bg-gray-800 bg-opacity-60 p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <div className="text-5xl text-blue-400 mb-4">{vm.icon}</div>
              <h2 className="text-xl font-bold mb-2">{vm.name}</h2>
              <p
                className={`text-lg font-semibold ${
                  vm.status === 'Running' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {vm.status}
              </p>
              <p className="text-md font-semibold">CPU: {vm.cpu}</p>
              <p className="text-md font-semibold">RAM: {vm.ram}</p>
              <p className="text-md font-semibold">Cost: {vm.cost}</p>
              <button
                onClick={handleGetStarted}
                className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold transition-transform hover:scale-105 duration-300 ease-in-out"
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12">
        <p className="text-gray-400 text-center">
          &copy; 2024 VM Management Platform. All rights reserved.
        </p>
      </footer>

      {/* Form Popup */}
      {showForm === 'login' && (
        <div
          onClick={handleOutsideClick}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <LoginForm onClose={toggleLoginForm} />
        </div>
      )}
      {showForm === 'signup' && (
        <div
          onClick={handleOutsideClick}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <Signup onClose={toggleSignupForm} />
        </div>
      )}
    </div>
  );
};

export default LandingPage;
