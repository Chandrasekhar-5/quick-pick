export enum OrderStatus {
  PENDING = 'Pending',
  PREPARING = 'Preparing',
  READY = 'Ready',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed'
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  isAvailable: boolean;
  stock: number;
  image?: string;
}

export interface VendorProfile {
  id: string;
  canteenName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  openingTime: string;
  closingTime: string;
  logo?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  timestamp: string;
  pickupTime: string;
}

export interface RevenueData {
  date: string;
  amount: number;
}
