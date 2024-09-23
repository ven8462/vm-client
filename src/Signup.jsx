import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const SIGNUP_URL = "https://vm-server.onrender.com/api/signup/";
const GOOGLE_SIGNUP_URL = "http://127.0.0.1:8000/api/google-signup/";

const Signup = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  // Handle form submit for manual signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    setLoading(true);

    const data = { username, email, password };
    try {
      const response = await axios.post(SIGNUP_URL, data);
      if (response.data.success) {
        setSuccess(response.data.message);
        setTimeout(() => setSuccess(""), 3000);
        setTimeout(() => navigate("/login"), 5000);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage(`Signup failed. Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google sign-up/login response
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await axios.post(SIGNUP_URL, {
        token: credentialResponse.credential,
      });
      if (response.data.success) {
        setSuccess(response.data.message);
        setTimeout(() => setSuccess(""), 3000);
        setTimeout(() => navigate("/login"), 5000);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage(`Google signup failed. Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrorMessage("Google sign-in failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <div className="relative bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-100 text-2xl font-bold focus:outline-none"
            aria-label="Close Signup Form"
          >
            &times;
          </button>

          <h2 className="text-3xl font-bold mb-6 text-center text-white">Sign Up</h2>

          {/* Google Sign-Up Button */}
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
            />
          </div>

          <h3 className="text-center text-gray-300 text-lg">OR</h3>

          {/* Manual Signup Form */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-gray-300">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-gray-300">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="block text-gray-300">Password</label>
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-gray-300">Confirm Password</label>
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                {confirmPasswordVisible ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Error and Success Messages */}
            {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
            {success && <p className="text-green-500 text-center mb-4">{success}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              {loading ? "Sending..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Signup;
