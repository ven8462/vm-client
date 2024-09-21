import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDesktop, FaServer, FaMicrochip } from 'react-icons/fa';
import background from './bg.jpg'; // Ensure the image is correctly placed in your directory

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  // Dummy data for virtual machines
  const virtualMachines = [
    { id: 1, name: 'VM Alpha', status: 'Running', icon: <FaDesktop /> },
    { id: 2, name: 'VM Beta', status: 'Stopped', icon: <FaServer /> },
    { id: 3, name: 'VM Gamma', status: 'Running', icon: <FaMicrochip /> },
    // { id: 4, name: 'VM Zeta', status: 'Running', icon: <FaMicrochip /> },
  ];

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-white p-5"
    >
      {/* Background Image */}
      <div
<<<<<<< HEAD
        className="absolut inset-0 bg-cover bg-center bg-no-repeat z-0"
=======
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
>>>>>>> 5e05bdb444d7deb2e207cce951eee69248568121
        style={{
          backgroundImage: `url(${background})`,
        }}
      ></div>

      {/* Overlay for opacity effect */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <header className="text-center space-y-4 mb-10">
          <h1 className="text-4xl font-bold lg:text-6xl backdrop-blur-md bg-opacity-60 p-5 rounded-lg bg-gray-900 shadow-lg">
            VM Management Platform
          </h1>
          <p className="text-lg lg:text-xl backdrop-blur-md bg-opacity-60 p-4 rounded-lg bg-gray-900 shadow-lg">
            Automate and manage your virtual machines effortlessly with a simplified interface.
          </p>
          <button
            onClick={handleGetStarted}
            className="mt-5 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-gray-900 rounded-full font-semibold transition-transform transform hover:scale-105 duration-300 ease-in-out shadow-lg"
          >
            Get Started
          </button>
        </header>

        {/* Virtual Machines Showcase */}
        <section className="mt-10 w-full lg:w-3/4">
          <h2 className="text-3xl font-semibold text-center mb-5 bg-gray-900 bg-opacity-70 p-4 rounded-lg shadow-lg">
            Featured Virtual Machines
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {virtualMachines.map((vm) => (
              <div
                key={vm.id}
                className="bg-black bg-opacity-20 p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform duration-300 ease-in-out backdrop-blur-lg"
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
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12">
          <p className="text-gray-200 text-center">
            &copy; 2024 VM Management Platform. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
