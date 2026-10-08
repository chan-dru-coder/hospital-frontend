import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredTokens, setStoredTokens, clearStoredTokens, getStoredUser, setStoredUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  // Initialize and verify user on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const { access } = getStoredTokens();
      if (access) {
        try {
          const profile = await api.get('/auth/me/');
          setUser(profile);
          setStoredUser(profile);
        } catch (err) {
          console.warn('Session expired or invalid, logging out:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api.post('/auth/login/', { email, password });
    setStoredTokens(data.access, data.refresh);
    
    // User profile is returned by our custom token serializer
    const userData = data.user;
    setUser(userData);
    setStoredUser(userData);
    return userData;
  };

  const register = async (formData) => {
    const data = await api.post('/auth/register/', formData);
    setStoredTokens(data.access, data.refresh);
    const userData = data.user;
    setUser(userData);
    setStoredUser(userData);
    return userData;
  };

  const logout = () => {
    clearStoredTokens();
    setUser(null);
  };

  const demoLogin = async (roleType) => {
    if (roleType === 'DOCTOR') {
      return await login('doctor@mediconnect.com', 'Password123');
    } else {
      return await login('patient@mediconnect.com', 'Password123');
    }
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    isDoctor: user?.role === 'DOCTOR',
    isPatient: user?.role === 'PATIENT',
    loading,
    login,
    register,
    logout,
    demoLogin,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
