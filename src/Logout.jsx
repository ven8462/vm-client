import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove tokens from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Optionally, you can add a message or notify the user that they've logged out

    // Redirect to home page after logout
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      Logout
    </button>
  );
};

export default Logout;
