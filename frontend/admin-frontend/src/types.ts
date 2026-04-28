export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  activeVendors: number;
  activeOrders: number;
  todayOrders: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export interface OrderPerDay {
  day: string;
  orders: number;
}

export interface TopVendor {
  name: string;
  orders: number;
  revenue: number;
}

export interface Order {
  id: string;
  student: string;
  vendor: string;
  items: string;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'picked_up' | 'cancelled';
  time: string;
}

export interface Vendor {
  id: string;
  name: string;
  shop: string;
  revenue: number;
  orders: number;
  rating: number;
  enabled: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  joined: string;
  blocked: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  vendor: string;
  price: number;
  category: string;
  soldToday: number;
  totalSold: number;
  limitPerSlot: number;
  remaining: number;
  status: 'active' | 'out_of_stock' | 'disabled' | 'slot_full';
  popularity: 'top_seller' | 'popular' | 'low';
}