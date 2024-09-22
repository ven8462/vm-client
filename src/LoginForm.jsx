import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';  

const LOGIN_URL = "http://127.0.0.1:8000/api/login/";
const GOOGLE_LOGIN_URL = "http://127.0.0.1:8000/api/google-login/";

const LoginForm = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) return;
    setLoading(true);

    const data = { username_or_email: username, password };

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setUsername("");
        setPassword("");
        setSuccess(result.message);
        setTimeout(() => setSuccess(""), 2000);
        localStorage.setItem("refreshToken", JSON.stringify(result.refresh_token));
        localStorage.setItem("accessToken", JSON.stringify(result.access_token));

        if (result.role === "Standard User") {
          navigate("/account");
        } else if (result.role === "Admin") {
          navigate("/admin");
        } else if (result.role === "Guest") {
          navigate("/guest");
        } else {
          navigate("/account");
        }
      } else {
        setErrorMessage(result.message);
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      setErrorMessage(`Login failed. Error: ${error}`);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (googleResponse) => {
    try {
      // Assuming successful login, store tokens and redirect
      const { credential } = googleResponse;

      // Simulate backend validation and response handling
      localStorage.setItem("accessToken", credential); // Store the JWT from Google
      setErrorMessage("");

      // Redirect to /account after successful login
      navigate("/account");
    } catch (error) {
      setErrorMessage('Google login failed. Please try again.');
      console.error('Google login error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <GoogleOAuthProvider clientId="132929471498-lcfm9oobe5paa6re1bdvu34ac6m13t6a.apps.googleusercontent.com">
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center" onClick={onClose}>
        <div
          className="relative bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-100 text-2xl font-bold"
          >
            &times;
          </button>

          <h2 className="text-3xl font-bold mb-6 text-center text-white">Login</h2>

          {/* Error and Success Messages */}
          {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}

          {/* Google Login */}
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setErrorMessage('Google Sign-In failed.')}
              text="signin_with"
              shape="pill"
              theme="outline"
              width="300px"
            />
          </div>

          <h3 className="text-center text-gray-300 text-lg">OR</h3>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-gray-400">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="block text-gray-400">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-3 right-3 text-gray-400 focus:outline-none"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring transition duration-200"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginForm;
