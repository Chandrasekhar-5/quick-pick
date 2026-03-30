import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import API from '../services/api';

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: string;
  permissions: {
    manageUsers: boolean;
    manageVendors: boolean;
    manageOrders: boolean;
    manageSettings: boolean;
    viewAnalytics: boolean;
  };
}

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const res = await API.get('/admin/me');
          setAdmin(res.data);
        } catch (error) {
          console.error('Session expired');
          localStorage.removeItem('adminToken');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await API.post('/admin/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('adminToken', res.data.token);
      setAdmin(res.data);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};