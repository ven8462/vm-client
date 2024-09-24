import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const SIGNUP_URL = "https://vm-server.onrender.com/api/signup/";

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

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    setLoading(true);

    const data = { 
      username: username, 
      email: email, 
      password: password,
      first_name: "Test",
      last_name: "Test"
    };
    Object.entries(data).forEach(([key, value]) => console.log(`${key} : ${JSON.stringify(value)}`));

    try {
      const response = await fetch(SIGNUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => setSuccess(""), 3000);
        setConfirmPassword("");
        setEmail("");
        setPassword("");
        setUsername("");
        console.log(result.errors);
        setTimeout(() => navigate("/"), 5000);
      } else {
        setErrorMessage(result.message);
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (error) {
      setErrorMessage(`Signup failed. Error: ${error}`);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleLogin =()=>{
    
  }


  return (
    <GoogleOAuthProvider clientId="132929471498-lcfm9oobe5paa6re1bdvu34ac6m13t6a.apps.googleusercontent.com">
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
