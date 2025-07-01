import axios from 'axios';
import tokenService from './tokenService';

const API_URL = 'http://localhost:3001';

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;

  }  catch (error) {
    console.error('Error during registration:', error);
    let errorMessage = 'An unexpected error occurred during registration.';

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Registration response error:', error.response.status, error.response.data);
        const backendMessage = error.response.data?.message || JSON.stringify(error.response.data);
        errorMessage = `Registration failed: ${error.response.status} - ${backendMessage}`;
      } else if (error.request) {
        console.error('Registration request error:', error.request);
        errorMessage = 'Registration request failed: No response received. Is the backend running and accessible?';
      } else {
        console.error('Registration error message:', error.message);
        errorMessage = `Registration failed: ${error.message}`;
      }
    } else {
       console.error('An unexpected error occurred:', error);
       errorMessage = `An unexpected error occurred: ${error.message}`;
    }

    // This line displays the alert for registration errors
    alert(errorMessage);

    throw new Error(errorMessage);
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData, {
         headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = response.data;

    if (data && data.token) {
      tokenService.setToken(data.token);
     localStorage.setItem('user', JSON.stringify(data.user));
     window.location.href = localStorage.getItem('last_route' )||"/";
    } else {
         const errorMessage = 'Login failed: No token received.';
         alert(errorMessage);
         throw new Error(errorMessage);
    }

    return data;

  } catch (error) {
    console.error('Error during login:', error);
    let errorMessage = 'An unexpected error occurred during login.';

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Login response error:', error.response.status, error.response.data);
        const backendMessage = error.response.data?.message || JSON.stringify(error.response.data);
        if (error.response.status === 401) {
             errorMessage = backendMessage;
        } else {
             errorMessage = `Login failed: ${error.response.status} - ${backendMessage}`;
        }
      } else if (error.request) {
        console.error('Login request error:', error.request);
        errorMessage = 'Login request failed: No response received. Is the backend running and accessible?';
      } else {
        console.error('Login error message:', error.message);
        errorMessage = `Login failed: ${error.message}`;
      }
    } else {
       console.error('An unexpected error occurred:', error);
       errorMessage = `An unexpected error occurred: ${error.message}`;
    }

    alert(errorMessage);

    throw new Error(errorMessage);
  }
};

export const logoutUser = () => {
    tokenService.removeToken();
    localStorage.removeItem('user');
    localStorage.removeItem('last_route' )
    window.location.href =  "/";

    console.log('User logged out');
};