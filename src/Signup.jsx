import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // Import Google OAuth components

const SIGNUP_URL = "http://127.0.0.1:8000/api/signup/";
const GOOGLE_SIGNUP_URL = "http://127.0.0.1:8000/api/google-signup/"; // Endpoint for Google signup

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisisble, setConfirmPasswordVisible] = useState(false);
  const [suggestedUsername, setSuggestedUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Generate unique but simple usernames
  const generateUsername = (email) => {
    const emailUsername = email.split('@')[0];
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${emailUsername}${randomSuffix}`.toLowerCase();
  };

  // Function to check if the username is available
  const checkUsernameAvailability = async (username) => {
    try {
      const response = await axios.post('http://localhost:3000/api/check-username', {
        username: username,
      });
      return response.data.isAvailable;
    } catch (error) {
      console.error('Error checking username availability', error);
      return false;
    }
  };

  // Suggest a unique username when email is entered
  useEffect(() => {
    if (email) {
      const newSuggestedUsername = generateUsername(email);
      checkUsernameAvailability(newSuggestedUsername).then((isAvailable) => {
        if (isAvailable) {
          setSuggestedUsername(newSuggestedUsername);
        } else {
          setSuggestedUsername(generateUsername(email));
        }
      });
    }
  }, [email]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisisbility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisisble);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    setLoading(true);

    const data = { username, email, password };

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
        setSuggestedUsername("");
        setTimeout(() => navigate("/login"), 5000);
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

  const handleGoogleSignup = async (response) => {
    try {
      const result = await axios.post(GOOGLE_SIGNUP_URL, {
        token: response.credential,
      });

      if (result.data.success) {
        setSuccess(result.data.message);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setErrorMessage(result.data.message);
      }
    } catch (error) {
      setErrorMessage(`Google signup failed: ${error.message}`);
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="max-w-md mx-auto mt-10 bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
        {/* Google SSO Button */}
        <div className="my-4">
          <GoogleLogin
            onSuccess={handleGoogleSignup}
            onError={() => {
              setErrorMessage('Login Failed');
            }}
          />
        </div>
        <br />
        <h2 className="text-2xl font-bold mb-5 text-center">OR</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              placeholder="Enter your email"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Username Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="Enter your username"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {suggestedUsername && (
              <p className="mt-2 text-sm text-gray-600">
                Suggested username: <strong>{suggestedUsername}</strong>{' '}
                <button
                  type="button"
                  onClick={() => setUsername(suggestedUsername)}
                  className="text-blue-500 underline"
                >
                  Use suggestion
                </button>
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 text-gray-500 focus:outline-none"
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={confirmPasswordVisisble ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisisbility}
                className="absolute inset-y-0 right-3 text-gray-500 focus:outline-none"
              >
                {confirmPasswordVisisble ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}
          {success && (
            <p className="text-green-700 text-center mb-4">{success}</p>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? "Sending..." : "Sign Up"}
            </button>
          </div>
        </form>

        

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 underline">
            Log In
          </a>
        </p>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Signup;
