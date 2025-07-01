// src/components/pages/LoginPage.js
import React, { useState } from 'react';
import LoginForm from '../auth/components/LoginForm';
import RegistrationForm from '../auth/components/RegistrationForm';
import { useAuth } from '../../context/AuthContext';
import { useHistory } from 'react-router-dom';
import Logo from '../../assets/images/logo-white.png'



const LoginPage = () => {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const { user, logout } = useAuth();
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/');
  };

  const handleGoBack = () => {
    history.push('/');
  };

  if (user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Already Logged In</h2>
          <p className="text-gray-600 mb-6">
            You are already logged in as <span className="font-bold">{user.username || user.email}</span>.
          </p>
          <button
            onClick={handleGoBack}
            className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-md shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 transition-colors duration-300 mr-4"
          >
            Go Back
          </button>
           <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">

        
        <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
          
            <div className="flex items-center mb-8">
                
                      <img src={Logo} alt="VB2 Logo" className="h-8 w-auto mr-3"/> 

                <span className="text-xl font-bold text-gray-800">VB2</span>
            </div>
          {isLoginActive ? <LoginForm /> : <RegistrationForm />}
        </div>

        {/* Right Column: Promotional/Switch Content */}
        <div className={`w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center items-center text-center text-white
                     ${isLoginActive ? 'bg-gray-800' : 'bg-gray-800'}`}>
          {isLoginActive ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">New Here?</h2>
              <p className="text-gray-300 mb-6">
                Sign up and discover a great amount of new opportunities!
              </p>
              <button
                onClick={() => setIsLoginActive(false)}
                className="px-8 w-full py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors duration-300"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Already a Member?</h2>
              <p className="text-gray-300 mb-6">
                Welcome back! Sign in to access your account.
              </p>
               <button
                onClick={() => setIsLoginActive(true)}
                className="px-8 py-3 w-full border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors duration-300"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;