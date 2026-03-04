import { createContext, useContext, useState, ReactNode } from 'react';
import { VendorProfile } from '../types.ts';

interface AuthContextType {
  isAuthenticated: boolean;
  vendor: VendorProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (vendorData: Partial<VendorProfile>) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<VendorProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_VENDOR: VendorProfile = {
  id: 'V-001',
  canteenName: 'Main Canteen',
  ownerName: 'John Doe',
  email: 'vendor@quickpick.com',
  phone: '+91 98765 43210',
  address: 'Block A, University Campus',
  openingTime: '08:00 AM',
  closingTime: '09:00 PM',
  logo: 'https://picsum.photos/seed/canteen/200/200'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('quickpick_auth') === 'true';
  });
  const [vendor, setVendor] = useState<VendorProfile | null>(() => {
    const saved = localStorage.getItem('quickpick_vendor');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, _password: string) => {
    // Simulate API call
    console.log('Logging in with:', email);
    setIsAuthenticated(true);
    setVendor(MOCK_VENDOR);
    localStorage.setItem('quickpick_auth', 'true');
    localStorage.setItem('quickpick_vendor', JSON.stringify(MOCK_VENDOR));
  };

  const register = async (vendorData: Partial<VendorProfile>) => {
    // Simulate API call
    console.log('Registering vendor:', vendorData);
    const newVendor = { ...MOCK_VENDOR, ...vendorData };
    setIsAuthenticated(true);
    setVendor(newVendor);
    localStorage.setItem('quickpick_auth', 'true');
    localStorage.setItem('quickpick_vendor', JSON.stringify(newVendor));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setVendor(null);
    localStorage.removeItem('quickpick_auth');
    localStorage.removeItem('quickpick_vendor');
  };

  const updateProfile = (data: Partial<VendorProfile>) => {
    if (vendor) {
      const updated = { ...vendor, ...data };
      setVendor(updated);
      localStorage.setItem('quickpick_vendor', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, vendor, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
