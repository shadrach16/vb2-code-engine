// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import tokenService from '../auth/services/tokenService';

// Create Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  const [error, setError] = useState(null); // Add error state

  // Load user data and token from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')||null;
    const storedToken = localStorage.getItem('token');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if(storedToken){
      setToken(storedToken)
    }
    setIsLoading(false);
  }, []);

  // Login handler function
  const login = () => {
      const userData = tokenService.getToken();
      localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(token);
  };

  // Logout handler function
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  // Context value that will be supplied to any descendants of this provider
  const contextValue = {
    user,
    token,
    isLoading,
    error,
    login,
    logout,
    setUser,
    setToken,
    setIsLoading,
    setError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;