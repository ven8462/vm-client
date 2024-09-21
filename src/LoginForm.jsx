import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';  

const LOGIN_URL = "http://127.0.0.1:8000/api/login/";
const GOOGLE_LOGIN_URL = "http://127.0.0.1:8000/api/google-login/"; 

const LoginForm = () => {
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

    const data = {
      username_or_email: username,
      password,
    };

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
      const response = await fetch(GOOGLE_LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: googleResponse.credential,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
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
      setErrorMessage(`Google login failed. Error: ${error}`);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID"> {/* Add Google OAuth Provider */}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-5 text-center">Login</h2>


          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}
          {success && (
            <p className="text-green-700 text-center mb-4">{success}</p>
          )}
          
          {/* Google Sign-In Button */}
          <div className="mt-5">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setErrorMessage('Google Sign-In failed.')}
            />
          </div>
          <br />
          <h2 className="text-2xl font-bold mb-5 text-center">OR</h2>
          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-gray-600 focus:outline-none"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {loading ? "Loading..." : "Login"}
            </button>

            <div className="text-sm font-medium text-gray-900 dark:text-gray-900">
              Not registered? <a href="signup" className="text-blue-700 hover:underline dark:text-blue-500">Create account</a>
            </div>
          </form>

          
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginForm;
