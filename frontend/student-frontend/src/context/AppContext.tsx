import React, { createContext, useContext, useState, useEffect } from 'react';
import { campusLocations } from '../data/shops';
import API from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  walletBalance: number;
  studentId: string;
  rewardPoints: number;
}

interface CartItem {
  id: string; 
  name: string;
  price: number;
  quantity: number;
  image: string;
  shopId: string; 
}

interface Order {
  id: string;
  shopId: string;
  shopName: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled' | 'confirmed';
  pickupSlot: string;
  timestamp: string;
  qrCode: string;
  studentId: string;
  paymentMethod?: 'wallet' | 'cash';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'wallet' | 'system';
}

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
}

interface AppContextType {
  user: User | null;
  isLoading: boolean;
  location: string;
  setLocation: (loc: string) => void;
  detectLocation: () => void;
  cart: CartItem[];
  currentShopId: string | null;
  setCurrentShopId: (id: string | null) => void;
  addToCart: (item: any, shopId: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  login: (userData: any) => void;
  logout: () => void;
  addFunds: (amount: number) => void;
  deductFunds: (amount: number) => boolean;
  orders: Order[];
  placeOrder: (order: any) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  cancelOrder: (orderId: string) => void;
  notifications: Notification[];
  addNotification: (title: string, message: string, type: Notification['type']) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  transactions: Transaction[];
  refreshOrders: () => void; 
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [location, setLocation] = useState('Campus Building A');
  const[cart, setCart] = useState<CartItem[]>([]);
  const [currentShopId, setCurrentShopId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const[transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchMyOrders = async () => {
    try {
      const res = await API.get('/orders/myorders');
      
      const mappedOrders = res.data.map((dbOrder: any) => ({
        id: dbOrder._id,
        shopId: dbOrder.vendorId?._id || 'Unknown',
        shopName: dbOrder.vendorId?.name || 'Unknown Shop',
        items: dbOrder.items.map((i: any) => ({
          id: i.menuItem?._id || 'Unknown',
          name: i.menuItem?.name || 'Unknown Item',
          price: i.priceAtOrder, 
          quantity: i.quantity,
          isVeg: i.menuItem?.isVeg
        })),
        total: dbOrder.totalAmount,
        status: dbOrder.status.toLowerCase(),
        pickupSlot: "Standard", 
        timestamp: dbOrder.createdAt,
        qrCode: dbOrder._id,
        studentId: dbOrder.userId
      }));
      
      setOrders(mappedOrders);
    } catch (err) {
      console.error("Failed to fetch orders from backend", err);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      const token = localStorage.getItem('studentToken');
      
      if (token) {
        try {
          const userRes = await API.get('/auth/me');
          
          setUser({
            _id: userRes.data._id,
            name: userRes.data.name,
            email: userRes.data.email,
            role: userRes.data.role,
            walletBalance: 500.00,
            studentId: userRes.data._id.substring(0, 8).toUpperCase(),
            rewardPoints: 150
          });

          await fetchMyOrders();

        } catch (error) {
          console.error("Session expired or invalid token.");
          localStorage.removeItem('studentToken');
        }
      }
      
      const savedNotifications = localStorage.getItem('qp_notifications');
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));

      const savedTransactions = localStorage.getItem('qp_transactions');
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

      setIsLoading(false);
    };

    initializeApp();
  },[]);

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const login = (userData: any) => {
    if (userData.role !== "student") {
      alert("Only students are allowed to login");
      return;
    }
    const newUser: User = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      walletBalance: 500.00,
      studentId: userData._id.substring(0, 8).toUpperCase(),
      rewardPoints: 150
    };
    setUser(newUser);
    fetchMyOrders(); 
    addNotification("Welcome to QuickPick!", "Start pre-ordering from your favorite campus shops.", "system");
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setOrders([]);
    setCurrentShopId(null);
    localStorage.removeItem('studentToken');
  };

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const nearest = campusLocations[Math.floor(Math.random() * campusLocations.length)];
        setLocation(nearest.name);
        addNotification("Location Detected", `Automatically set your location to ${nearest.name}`, "system");
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const addToCart = (item: any, shopId: string) => {
    if (currentShopId && currentShopId !== shopId) {
      if (!window.confirm("Adding items from a different shop will clear your current cart. Continue?")) {
        return;
      }
      setCart([{ ...item, quantity: 1, shopId }]);
      setCurrentShopId(shopId);
      return;
    }
    setCurrentShopId(shopId);
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return[...prev, { ...item, quantity: 1, shopId }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const updated = prev.filter(i => i.id !== id);
      if (updated.length === 0) setCurrentShopId(null);
      return updated;
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const updated = prev.map(i => {
        if (i.id === id) {
          const newQty = Math.max(0, i.quantity + delta);
          return { ...i, quantity: newQty };
        }
        return i;
      }).filter(i => i.quantity > 0);
      
      if (updated.length === 0) setCurrentShopId(null);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    setCurrentShopId(null);
  };

  const addFunds = (amount: number) => {
    if (!user) return;
    const updated = { ...user, walletBalance: user.walletBalance + amount };
    setUser(updated);
    
    const newTxn: Transaction = {
      id: `TXN${Date.now()}`,
      type: 'credit',
      amount,
      description: 'Added funds to wallet',
      date: new Date().toISOString()
    };
    const updatedTxns = [newTxn, ...transactions];
    setTransactions(updatedTxns);
    saveToStorage('qp_transactions', updatedTxns);
    
    addNotification("Funds Added", `₹${amount} has been added to your wallet.`, "wallet");
  };

  const deductFunds = (amount: number) => {
    if (!user || user.walletBalance < amount) return false;
    
    const pointsEarned = Math.floor(amount * 0.02);
    const updated = { 
      ...user, 
      walletBalance: user.walletBalance - amount,
      rewardPoints: user.rewardPoints + pointsEarned
    };
    setUser(updated);

    const newTxn: Transaction = {
      id: `TXN${Date.now()}`,
      type: 'debit',
      amount,
      description: 'Payment for order',
      date: new Date().toISOString()
    };
    const updatedTxns =[newTxn, ...transactions];
    setTransactions(updatedTxns);
    saveToStorage('qp_transactions', updatedTxns);

    return true;
  };

  const placeOrder = (orderData: any) => {
    console.log("Data passed to placeOrder:", orderData);

    const extractedId = orderData?._id || orderData?.id;
  
  if (!extractedId) {
    console.error("❌ COULD NOT FIND ORDER ID! Look at the 'Data passed to placeOrder' log above to see where the _id is hiding.");
    return "processing...";
  }

    setTimeout(() => {
       fetchMyOrders(); 
    }, 500);

    return extractedId; 
  };

  const cancelOrder = async (orderId: string) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: 'Cancelled' });
      
      const order = orders.find(o => o.id === orderId);
      if (order && order.paymentMethod === 'wallet') {
        addFunds(order.total);
      }
      
      addNotification("Order Cancelled", `Order ${orderId} was cancelled successfully.`, "order");
      fetchMyOrders(); 
    } catch (error) {
      console.error("Failed to cancel order", error);
      alert("Could not cancel order.");
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    fetchMyOrders(); 
  };

  const addNotification = (title: string, message: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: `NOTIF${Date.now()}`, title, message, timestamp: new Date().toISOString(), read: false, type
    };
    const updated =[newNotif, ...notifications];
    setNotifications(updated);
    saveToStorage('qp_notifications', updated);
  };

  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    saveToStorage('qp_notifications', updated);
  };

  const markAllNotificationsAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    saveToStorage('qp_notifications', updated);
  };

  return (
    <AppContext.Provider value={{ 
      user, isLoading, location, setLocation, detectLocation, cart, currentShopId, setCurrentShopId, 
      addToCart, removeFromCart, updateQuantity, clearCart, login, logout, 
      addFunds, deductFunds, orders, placeOrder, updateOrderStatus, cancelOrder,
      notifications, addNotification, markNotificationAsRead, markAllNotificationsAsRead,
      transactions, refreshOrders: fetchMyOrders
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};