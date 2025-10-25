import React, { createContext, useState, type ReactNode,  } from 'react';
import { setAuthToken } from '../api';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
  setToken: () => {},
});

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('accessToken'));

  const login = (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
  };

  const setToken = (accessToken: string) => {
    setAuthToken(accessToken);
    setTokenState(accessToken);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
