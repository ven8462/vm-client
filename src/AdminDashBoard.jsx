import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Logout from './Logout';

const AdminDashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col justify-between">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

          {/* Sidebar Links */}
          <ul className="space-y-4">
            <li>
              <Link
                to="create-vm"
                className="w-full block text-gray-300 py-3 px-4 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Virtual Machine
              </Link>
            </li>
            <li>
              <Link
                to="manage-vm"
                className="w-full block text-gray-300 py-3 px-4 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Manage Virtual Machines
              </Link>
            </li>
            <li>
              <Link
                to="delete-vm"
                className="w-full block text-gray-300 py-3 px-4 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Delete Virtual Machine
              </Link>
            </li>
            <li>
              <Link
                to="assign-vm"
                className="w-full block text-gray-300 py-3 px-4 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Assign Virtual Machine
              </Link>
            </li>
          </ul>
        </div>

        {/* Logout button positioned at the bottom of the sidebar */}
        <div className="p-6">
          <Logout />
        </div>
      </div>

      {/* Main content area where content will change */}
      <div className="flex-1 bg-gray-100 p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
