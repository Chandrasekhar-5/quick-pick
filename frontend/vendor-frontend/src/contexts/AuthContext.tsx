import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { VendorProfile } from '../types.ts';
import API from "../services/api";

interface AuthContextType {
  isAuthenticated: boolean;
  vendor: VendorProfile | null;
  isLoading: boolean;
  login: (userData: any) => Promise<void>;
  register: (vendorData: Partial<VendorProfile>) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<VendorProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const[vendor, setVendor] = useState<VendorProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper function to fetch the user's shop and combine the data
  const fetchVendorProfile = async (userData: any) => {
    try {
      const res = await API.get('/vendors');
      const myShop = res.data.find((v: any) => v.ownerId === userData._id);

      const profile: VendorProfile = {
        id: myShop ? myShop._id : userData._id,
        canteenName: myShop ? myShop.name : 'Setup Your Shop',
        ownerName: userData.name,
        email: userData.email,
        phone: '+91 (Update in Profile)',
        address: myShop ? (myShop.description || 'Campus') : 'Main Campus',
        openingTime: '08:00 AM',
        closingTime: '09:00 PM',
        logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200'
      };

      setVendor(profile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to fetch shop details:", error);
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('vendorToken');
      if (token) {
        try {
          const userRes = await API.get('/auth/me');
          await fetchVendorProfile(userRes.data);
        } catch (error) {
          console.error('Session expired or invalid token');
          localStorage.removeItem('vendorToken');
          setIsAuthenticated(false);
          setVendor(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

   const login = async (userData: any) => {
    await fetchVendorProfile(userData);
  };

  const register = async (vendorData: Partial<VendorProfile>): Promise<void> => {
  try {
    const res = await API.post('/vendors', vendorData);

    if (res.data.token) {
      localStorage.setItem('vendorToken', res.data.token);
    }

    if (res.data.vendor) {
    await fetchVendorProfile(res.data.vendor);
    } else if (res.data.user) {
      await fetchVendorProfile(res.data.user);
    }
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};


  const logout = () => {
    setIsAuthenticated(false);
    setVendor(null);
    localStorage.removeItem('vendorToken');
  };

  const updateProfile = (data: Partial<VendorProfile>) => {
    if (vendor) {
      const updated = { ...vendor, ...data };
      setVendor(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, vendor, isLoading, login, register, logout, updateProfile }}>
      {!isLoading && children}
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