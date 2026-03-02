import React, { createContext, useContext, useState, useEffect } from 'react';
import { campusLocations, shops } from '../data/shops';

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
  status: 'confirmed' | 'preparing' | 'ready' | 'picked_up';
  pickupSlot: string;
  timestamp: string;
  qrCode: string;
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
  user: { name: string; walletBalance: number; studentId: string; rewardPoints: number } | null;
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
  login: (name: string) => void;
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
  const [user, setUser] = useState<{ name: string; walletBalance: number; studentId: string; rewardPoints: number } | null>(null);
  const [location, setLocation] = useState('Campus Building A');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentShopId, setCurrentShopId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('qp_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedOrders = localStorage.getItem('qp_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    const savedNotifications = localStorage.getItem('qp_notifications');
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));

    const savedTransactions = localStorage.getItem('qp_transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  }, []);

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const login = (name: string) => {
    const newUser = { name, walletBalance: 500.00, studentId: "STU2024001", rewardPoints: 150 };
    setUser(newUser);
    saveToStorage('qp_user', newUser);
    addNotification("Welcome to QuickPick!", "Start pre-ordering from your favorite campus shops.", "system");
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setCurrentShopId(null);
    localStorage.removeItem('qp_user');
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
      setCart([]);
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
      qrCode: `${orderId}-${user?.studentId}-${Date.now()}`
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
    if (order && order.status === 'confirmed') {
      // Refund logic
      addFunds(order.total);
      const updatedOrders = orders.filter(o => o.id !== orderId);
      setOrders(updatedOrders);
      saveToStorage('qp_orders', updatedOrders);
      addNotification("Order Cancelled", `Order ${orderId} was cancelled and refund processed.`, "order");
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
      user, location, setLocation, detectLocation, cart, currentShopId, setCurrentShopId, 
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
