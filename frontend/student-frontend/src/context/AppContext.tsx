import React, { createContext, useContext, useState, useEffect } from 'react';
import { campusLocations, shops } from '../data/shops';

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
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  shopId: number;
}

interface Order {
  id: string;
  shopId: number;
  shopName: string;
  items: CartItem[];
  total: number;
  status: 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'cancelled';
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
  currentShopId: number | null;
  setCurrentShopId: (id: number | null) => void;
  addToCart: (item: any, shopId: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
  login: (userData: any) => void;
  logout: () => void;
  addFunds: (amount: number) => void;
  deductFunds: (amount: number) => boolean;
  orders: Order[];
  placeOrder: (order: Omit<Order, 'id' | 'timestamp' | 'qrCode' | 'status'>) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  cancelOrder: (orderId: string) => void;
  notifications: Notification[];
  addNotification: (title: string, message: string, type: Notification['type']) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  transactions: Transaction[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('qp_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [location, setLocation] = useState('Campus Building A');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentShopId, setCurrentShopId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {

    const savedOrders = localStorage.getItem('qp_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    const savedNotifications = localStorage.getItem('qp_notifications');
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));

    const savedTransactions = localStorage.getItem('qp_transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('qp_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('qp_user');
    }
  }, [user]);

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
    addNotification("Welcome to QuickPick!", "Start pre-ordering from your favorite campus shops.", "system");
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setCurrentShopId(null);
    localStorage.removeItem('qp_user');
    localStorage.removeItem('studentToken');
  };

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Mock logic: find nearest campus building
        const nearest = campusLocations[Math.floor(Math.random() * campusLocations.length)];
        setLocation(nearest.name);
        addNotification("Location Detected", `Automatically set your location to ${nearest.name}`, "system");
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const addToCart = (item: any, shopId: number) => {
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
      return [...prev, { ...item, quantity: 1, shopId }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const updated = prev.filter(i => i.id !== id);
      if (updated.length === 0) setCurrentShopId(null);
      return updated;
    });
  };

  const updateQuantity = (id: number, delta: number) => {
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
    saveToStorage('qp_user', updated);
    
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
    
    // Calculate reward points (2%)
    const pointsEarned = Math.floor(amount * 0.02);
    
    const updated = { 
      ...user, 
      walletBalance: user.walletBalance - amount,
      rewardPoints: user.rewardPoints + pointsEarned
    };
    setUser(updated);
    saveToStorage('qp_user', updated);

    const newTxn: Transaction = {
      id: `TXN${Date.now()}`,
      type: 'debit',
      amount,
      description: 'Payment for order',
      date: new Date().toISOString()
    };
    const updatedTxns = [newTxn, ...transactions];
    setTransactions(updatedTxns);
    saveToStorage('qp_transactions', updatedTxns);

    return true;
  };

  const placeOrder = (orderData: any) => {
    const orderId = `ORD${Math.floor(Math.random() * 90000) + 10000}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      status: 'confirmed',
      timestamp: new Date().toISOString(),
      qrCode: `${orderId}-${user?.studentId}-${Date.now()}`,
      studentId: user?.studentId || ''
    };
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveToStorage('qp_orders', updatedOrders);
    
    addNotification("Order Confirmed", `Your order ${orderId} has been placed successfully.`, "order");
    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        if (status === 'ready' && o.status !== 'ready') {
          addNotification("Order Ready!", `Your order ${orderId} is ready for pickup.`, "order");
        }
        return { ...o, status };
      }
      return o;
    });
    setOrders(updatedOrders as Order[]);
    saveToStorage('qp_orders', updatedOrders);
  };

  const cancelOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order && (order.status === 'confirmed' || order.status === 'preparing')) {
      // Refund logic
      if (order.paymentMethod === 'wallet') {
        addFunds(order.total);
        addNotification("Order Cancelled", `Order ${orderId} was cancelled and ₹ ${order.total} was refunded.`, "order");
      } else {
        addNotification("Order Cancelled", `Order ${orderId} (Pay at Counter) was cancelled successfully.`, "order");
      }
      
      const updatedOrders = orders.filter(o => o.id !== orderId);
      setOrders(updatedOrders);
      saveToStorage('qp_orders', updatedOrders);
    }
  };

  const addNotification = (title: string, message: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: `NOTIF${Date.now()}`,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type
    };
    const updated = [newNotif, ...notifications];
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
      transactions
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