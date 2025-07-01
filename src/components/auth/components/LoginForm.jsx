// src/auth/components/LoginForm.jsx

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { loginUser } from '../../../auth/services/authService';
import { useAuth } from '../../../context/AuthContext';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const history = useHistory();
  const { login } = useAuth();

  const validateForm = () => {
    let newErrors = {};
    if (!username) newErrors.username = 'Username/Email is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (validateForm()) {
      setLoading(true);
      try {
        const loginRes = await loginUser({ username, password });
        login(loginRes.user, loginRes.token);
        history.push('/');
      } catch (err) {
        console.error("Login error:", err);
        setApiError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Form has errors");
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Login to Your Account</h2>
      <p className="text-gray-600 text-center mb-6">Login using social networks</p>

      {/* Social Login Buttons (Placeholders) */}
      <div className="flex justify-center space-x-4 mb-6">
        <button className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            {/* Replace with Facebook icon */}
            <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.299c-1.213 0-1.587.753-1.587 1.517V12h3.328l-.532 3.318h-2.796v7.01c4.771-.762 8.428-4.897 8.428-9.865Z"></path></svg>
        </button>
         <button className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
            {/* Replace with Google icon */}
            <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true"><path d="M12.001 4.8c-3.245 0-5.991 2.357-5.991 5.587s2.746 5.587 5.991 5.587c2.655 0 4.84-1.247 5.991-3.225h-2.54L15.452 10.8H12.001V8.52h5.453c.091.535.14 1.091.14 1.657 0 3.9-2.963 7.016-6.093 7.016-3.56 0-6.49-2.845-6.49-6.36S8.44 4.8 12.001 4.8z"></path></svg>
        </button>
         <button className="w-12 h-12 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50">
            {/* Replace with LinkedIn icon */}
            <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true"><path d="M22.238 0H1.762C.786 0 0 .786 0 1.762v20.476C0 23.214.786 24 1.762 24h20.476C23.214 24 24 23.214 24 22.238V1.762C24 .786 23.214 0 22.238 0zM7.19 20.454H3.71V8.86H7.19v11.594zM5.45 7.458c-1.182 0-2.148-.967-2.148-2.149 0-1.182.966-2.148 2.148-2.148 1.181 0 2.147.966 2.147 2.148 0 1.182-.966 2.149-2.147 2.149zm13.994 12.996h-3.48V14.96c0-1.3-.467-2.187-1.636-2.187-1.11 0-1.767.75-1.767 2.114v5.567H9.827V8.86h3.48v1.566c.515-.786 1.44-1.896 3.155-1.896 2.297 0 4.08 1.507 4.08 4.816v6.084z"></path></svg>
        </button>
      </div>

      {/* OR Separator */}
      <div className="flex items-center w-full my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form onSubmit={handleSubmit} className="w-full bg-white rounded pt-4 pb-4 mb-4">
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-semibold mb-2">
            Username/Email:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.username && <p className="text-red-500 text-xs italic mt-1">{errors.username}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`appearance-none border rounded-md w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password}</p>}
        </div>

        {apiError && <p className="text-red-500 text-xs italic mb-4 text-center">{apiError}</p>}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Sign In'}
          </button>
          <a className="inline-block align-baseline font-semibold text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200" href="#">
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;