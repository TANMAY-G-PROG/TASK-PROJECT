// src/context/AuthContext.jsx

// import React, { createContext, useState, useContext, useEffect } from 'react';
// import apiClient from '../services/api';
// import { useNavigate } from 'react-router-dom';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser && token) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, [token]);

//   const login = async (credentials) => {
//     try {
//       const response = await apiClient.post('/auth/login', credentials);
//       const { token, user } = response.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
//       setToken(token);
//       setUser(user);
//       navigate('/dashboard');
//     } catch (error) {
//       console.error('Login failed', error);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setToken(null);
//     setUser(null);
//     navigate('/login');
//   };

//   const value = { user, token, login, logout };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Read initial token from sessionStorage
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const refreshUser = async () => {
    if (token) {
        try {
            const response = await apiClient.get('/auth/me');
            const freshUser = response.data;
            setUser(freshUser);
            sessionStorage.setItem('user', JSON.stringify(freshUser));
        } catch (error) {
            console.error("Failed to refresh user data", error);
        }
    }
  };

  useEffect(() => {
    // Read user data from sessionStorage
    const storedUser = sessionStorage.getItem('user');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Save to sessionStorage instead of localStorage
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      // Re-throw the error so the component can catch it
      throw error;
    }
  };

  const logout = () => {
    // Remove from sessionStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const value = { user, token, login, logout, refreshUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};