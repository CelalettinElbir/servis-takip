import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import API, { setAuthToken } from '../api';

// Kullanıcı tipi
interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

// Context tipi
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

// Context oluşturuluyor
export const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  user: null,
  login: () => { },
  logout: () => { },
  setToken: () => { },
});

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Uygulama açıldığında localStorage'daki token'ı kontrol et
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      fetchCurrentUser();
    }
  }, []);

  // Kullanıcı bilgilerini çek
  const fetchCurrentUser = async () => {
    try {
      debugger;
      const response = await API.get('auth/me/');
      setUser(response.data);
    } catch (error) {
      console.error('Kullanıcı bilgisi alınamadı:', error);
      logout();
    }
  };

  // Login işlemi
  const login = (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    setToken(accessToken);
    fetchCurrentUser(accessToken);
  };

  // Logout işlemi
  const logout = () => {
    localStorage.removeItem('accessToken');
    setTokenState(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  // Token ayarlama
  const setToken = (accessToken: string) => {
    setAuthToken(accessToken);
    setTokenState(accessToken);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, user, login, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
