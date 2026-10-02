import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tg_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      const { access_token, user: userData } = response.data;
      localStorage.setItem('tg_token', access_token);
      setToken(access_token);
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, fullName) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
        full_name: fullName
      });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('tg_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
