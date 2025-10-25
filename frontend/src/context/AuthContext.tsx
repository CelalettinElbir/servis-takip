import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { setAuthToken } from '../api';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  setToken: () => {},
});

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Uygulama başlatıldığında localStorage'dan token'ı kontrol et
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setTokenState(null);
    setIsAuthenticated(false);
  };

  const setToken = (accessToken: string) => {
    setAuthToken(accessToken);
    setTokenState(accessToken);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
