import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate(); 

  const handleGetStarted = () => {
    navigate('/login'); 
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-5">
      {/* Hero Section */}
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold lg:text-5xl">
          VM Management Platform
        </h1>
        <p className="text-lg lg:text-xl">
          Automate and manage your virtual machines effortlessly with role-based access control.
        </p>
        <button
          onClick={handleGetStarted}
          className="mt-5 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold text-white transition duration-300 ease-in-out"
        >
          Get Started
        </button>
      </header>

      {/* Features Section */}
      <section className="mt-10 w-full lg:w-3/4">
        <h2 className="text-2xl font-semibold text-center mb-5 lg:text-3xl">Platform Features</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold">User Management</h3>
            <p className="mt-3 text-gray-300">
              Manage users with role-based access. Admins can control VMs, while standard users manage their own.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold">VM Automation</h3>
            <p className="mt-3 text-gray-300">
              Easily create, delete, and manage virtual machines with built-in automation tools.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold">Payments & Subscriptions</h3>
            <p className="mt-3 text-gray-300">
              Integrated payment system with subscription plans tailored to user needs.
            </p>
          </div>
          {/* Feature 4 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold">Security & SSO</h3>
            <p className="mt-3 text-gray-300">
              Implement secure access with SSO and role-based control for your team.
            </p>
          </div>
          {/* Feature 5 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold">Kubernetes Deployment</h3>
            <p className="mt-3 text-gray-300">
              Containerized deployment with Kubernetes for scalable and reliable infrastructure.
            </p>
          </div>
          {/* Feature 6 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold">CI/CD Automation</h3>
            <p className="mt-3 text-gray-300">
              Continuous integration and deployment pipelines ensure smooth updates.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12">
        <p className="text-gray-400 text-center">
          &copy; 2024 VM Management Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
