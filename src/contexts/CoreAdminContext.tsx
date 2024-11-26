import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CoreAdminContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const CoreAdminContext = createContext<CoreAdminContextType | undefined>(undefined);

const STORAGE_KEY = 'core_admin_auth';

const CORE_ADMIN_CREDENTIALS = {
  email: 'coreadmin@example.com',
  password: 'admin123!@#'
};

export function CoreAdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!email || !password) {
        throw new Error('メールアドレスとパスワードを入力してください');
      }
      
      if (email === CORE_ADMIN_CREDENTIALS.email && password === CORE_ADMIN_CREDENTIALS.password) {
        setIsAuthenticated(true);
        localStorage.setItem(STORAGE_KEY, 'true');
        navigate('/coreadmin');
      } else {
        throw new Error('メールアドレスまたはパスワードが正しくありません');
      }
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem(STORAGE_KEY);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
    navigate('/coreadmin/login');
  };

  return (
    <CoreAdminContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </CoreAdminContext.Provider>
  );
}

export function useCoreAdmin() {
  const context = useContext(CoreAdminContext);
  if (context === undefined) {
    throw new Error('useCoreAdmin must be used within a CoreAdminProvider');
  }
  return context;
}