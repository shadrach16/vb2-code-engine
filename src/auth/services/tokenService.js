// src/auth/services/tokenService.js

const setToken = (token) => {
  localStorage.setItem('token', token);
};

const getToken = () => {
  return localStorage.getItem('token');
};

const removeToken = () => {
  localStorage.removeItem('token');
};

export default {
  setToken,
  getToken,
  removeToken
};
