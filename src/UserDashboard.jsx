import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Logout from './Logout';

const UserDashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col justify-between">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>

          {/* Sidebar Links */}
          <ul className="space-y-4">
            <li>
              <Link
                to="sub-users"
                className="w-full block text-gray-300 py-3 px-4 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Sub Users
              </Link>
            </li>
            <li>
              <Link
                to="create-backup"
                className="w-full block text-gray-300 py-3 px-4 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Backup
              </Link>
            </li>
            <li>
              <Link
                to="billing"
                className="w-full block text-gray-300 py-3 px-4 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                View Billing Information
              </Link>
            </li>
            <li>
              <Link
                to="subscription-management"
                className="w-full block text-gray-300 py-3 px-4 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Manage Subscription
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

export default UserDashboard;
