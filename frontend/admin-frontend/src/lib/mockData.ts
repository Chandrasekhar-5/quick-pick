export const dashboardStats = {
  totalOrders: 12847,
  totalRevenue: 384520,
  totalUsers: 3421,
  activeVendors: 18,
  activeOrders: 42,
  todayOrders: 156,
};

export const revenueData = [
  { month: "Jan", revenue: 28000 },
  { month: "Feb", revenue: 32000 },
  { month: "Mar", revenue: 35000 },
  { month: "Apr", revenue: 29000 },
  { month: "May", revenue: 41000 },
  { month: "Jun", revenue: 38000 },
  { month: "Jul", revenue: 45000 },
  { month: "Aug", revenue: 42000 },
  { month: "Sep", revenue: 48000 },
  { month: "Oct", revenue: 44000 },
  { month: "Nov", revenue: 50000 },
  { month: "Dec", revenue: 52520 },
];

export const ordersPerDay = [
  { day: "Mon", orders: 120 },
  { day: "Tue", orders: 145 },
  { day: "Wed", orders: 132 },
  { day: "Thu", orders: 168 },
  { day: "Fri", orders: 195 },
  { day: "Sat", orders: 88 },
  { day: "Sun", orders: 65 },
];

export const topVendors = [
  { name: "Campus Bites", orders: 3200, revenue: 96000 },
  { name: "Fresh Bowl", orders: 2800, revenue: 84000 },
  { name: "Spice Kitchen", orders: 2400, revenue: 72000 },
  { name: "Juice Corner", orders: 1900, revenue: 57000 },
  { name: "Snack Hub", orders: 1547, revenue: 46410 },
];

export type OrderStatus = "pending" | "preparing" | "ready" | "picked_up" | "cancelled";

export interface Order {
  id: string;
  student: string;
  vendor: string;
  items: string;
  total: number;
  status: OrderStatus;
  time: string;
}

export const orders: Order[] = [
  { id: "QP-1001", student: "Rahul Sharma", vendor: "Campus Bites", items: "Veg Thali, Lassi", total: 180, status: "pending", time: "12:30 PM" },
  { id: "QP-1002", student: "Priya Patel", vendor: "Fresh Bowl", items: "Caesar Salad", total: 150, status: "preparing", time: "12:25 PM" },
  { id: "QP-1003", student: "Amit Kumar", vendor: "Spice Kitchen", items: "Chicken Biryani", total: 220, status: "ready", time: "12:20 PM" },
  { id: "QP-1004", student: "Sneha Gupta", vendor: "Juice Corner", items: "Mango Shake, Sandwich", total: 130, status: "picked_up", time: "12:15 PM" },
  { id: "QP-1005", student: "Vikram Singh", vendor: "Snack Hub", items: "Samosa x3, Tea", total: 90, status: "cancelled", time: "12:10 PM" },
  { id: "QP-1006", student: "Ananya Das", vendor: "Campus Bites", items: "Paneer Wrap", total: 120, status: "pending", time: "12:05 PM" },
  { id: "QP-1007", student: "Rohan Mehta", vendor: "Fresh Bowl", items: "Pasta, Cold Coffee", total: 200, status: "preparing", time: "12:00 PM" },
  { id: "QP-1008", student: "Kavya Nair", vendor: "Spice Kitchen", items: "Dal Rice, Raita", total: 140, status: "ready", time: "11:55 AM" },
];

export interface Vendor {
  id: string;
  name: string;
  shop: string;
  revenue: number;
  orders: number;
  rating: number;
  enabled: boolean;
}

export const vendors: Vendor[] = [
  { id: "V-001", name: "Campus Bites", shop: "Main Canteen", revenue: 96000, orders: 3200, rating: 4.5, enabled: true },
  { id: "V-002", name: "Fresh Bowl", shop: "Main Canteen", revenue: 84000, orders: 2800, rating: 4.3, enabled: true },
  { id: "V-003", name: "Spice Kitchen", shop: "Main Canteen", revenue: 72000, orders: 2400, rating: 4.7, enabled: true },
  { id: "V-004", name: "Juice Corner", shop: "Juice Corner", revenue: 57000, orders: 1900, rating: 4.1, enabled: true },
  { id: "V-005", name: "Snack Hub", shop: "Snack Hub", revenue: 46410, orders: 1547, rating: 4.0, enabled: false },
];

export interface User {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  joined: string;
  blocked: boolean;
}

export const users: User[] = [
  { id: "U-001", name: "Rahul Sharma", email: "rahul@college.edu", orders: 45, spent: 6750, joined: "2024-08-15", blocked: false },
  { id: "U-002", name: "Priya Patel", email: "priya@college.edu", orders: 38, spent: 5700, joined: "2024-09-01", blocked: false },
  { id: "U-003", name: "Amit Kumar", email: "amit@college.edu", orders: 52, spent: 7800, joined: "2024-07-20", blocked: false },
  { id: "U-004", name: "Sneha Gupta", email: "sneha@college.edu", orders: 29, spent: 4350, joined: "2024-10-05", blocked: true },
  { id: "U-005", name: "Vikram Singh", email: "vikram@college.edu", orders: 61, spent: 9150, joined: "2024-06-10", blocked: false },
  { id: "U-006", name: "Ananya Das", email: "ananya@college.edu", orders: 33, spent: 4950, joined: "2024-11-01", blocked: false },
];

export interface Shop {
  id: string;
  name: string;
  vendor: string;
  capacity: number;
  open: boolean;
}

export const shops: Shop[] = [
  { id: "S-001", name: "Main Canteen", vendor: "Campus Bites", capacity: 50, open: true },
  { id: "S-002", name: "Juice Corner", vendor: "Juice Corner", capacity: 20, open: true },
  { id: "S-003", name: "Snack Hub", vendor: "Snack Hub", capacity: 30, open: false },
];

export type MenuItemStatus = "active" | "out_of_stock" | "disabled" | "slot_full";
export type PopularityTag = "top_seller" | "popular" | "low";

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
  status: MenuItemStatus;
  popularity: PopularityTag;
}

export const menuItems: MenuItem[] = [
  { id: "M-001", name: "Veg Thali", vendor: "Campus Bites", price: 120, category: "Meals", soldToday: 45, totalSold: 3200, limitPerSlot: 20, remaining: 5, status: "active", popularity: "top_seller" },
  { id: "M-002", name: "Chicken Biryani", vendor: "Spice Kitchen", price: 180, category: "Meals", soldToday: 38, totalSold: 2800, limitPerSlot: 15, remaining: 2, status: "active", popularity: "top_seller" },
  { id: "M-003", name: "Caesar Salad", vendor: "Fresh Bowl", price: 150, category: "Salads", soldToday: 12, totalSold: 950, limitPerSlot: 25, remaining: 13, status: "active", popularity: "popular" },
  { id: "M-004", name: "Mango Shake", vendor: "Juice Corner", price: 80, category: "Beverages", soldToday: 28, totalSold: 1800, limitPerSlot: 30, remaining: 2, status: "active", popularity: "popular" },
  { id: "M-005", name: "Samosa", vendor: "Snack Hub", price: 20, category: "Snacks", soldToday: 0, totalSold: 420, limitPerSlot: 50, remaining: 0, status: "out_of_stock", popularity: "low" },
  { id: "M-006", name: "Paneer Wrap", vendor: "Campus Bites", price: 100, category: "Wraps", soldToday: 22, totalSold: 1500, limitPerSlot: 20, remaining: 0, status: "slot_full", popularity: "popular" },
  { id: "M-007", name: "Pasta", vendor: "Fresh Bowl", price: 130, category: "Italian", soldToday: 8, totalSold: 650, limitPerSlot: 20, remaining: 12, status: "active", popularity: "low" },
  { id: "M-008", name: "Cold Coffee", vendor: "Juice Corner", price: 60, category: "Beverages", soldToday: 0, totalSold: 320, limitPerSlot: 40, remaining: 40, status: "disabled", popularity: "low" },
  { id: "M-009", name: "Masala Dosa", vendor: "Campus Bites", price: 90, category: "Meals", soldToday: 31, totalSold: 2100, limitPerSlot: 18, remaining: 3, status: "active", popularity: "top_seller" },
  { id: "M-010", name: "Fruit Bowl", vendor: "Fresh Bowl", price: 110, category: "Salads", soldToday: 5, totalSold: 280, limitPerSlot: 15, remaining: 10, status: "active", popularity: "low" },
];

export const transactions = [
  { id: "T-001", user: "Rahul Sharma", type: "payment" as const, amount: 180, date: "2025-03-08", status: "completed" as const },
  { id: "T-002", user: "Priya Patel", type: "topup" as const, amount: 500, date: "2025-03-08", status: "completed" as const },
  { id: "T-003", user: "Amit Kumar", type: "refund" as const, amount: 220, date: "2025-03-07", status: "completed" as const },
  { id: "T-004", user: "Sneha Gupta", type: "payment" as const, amount: 130, date: "2025-03-07", status: "completed" as const },
  { id: "T-005", user: "Vikram Singh", type: "topup" as const, amount: 1000, date: "2025-03-06", status: "pending" as const },
  { id: "T-006", user: "Ananya Das", type: "payment" as const, amount: 120, date: "2025-03-06", status: "completed" as const },
];

export const monthlyRevenue = [
  { month: "Jan", revenue: 28000 },
  { month: "Feb", revenue: 32000 },
  { month: "Mar", revenue: 35000 },
  { month: "Apr", revenue: 29000 },
  { month: "May", revenue: 41000 },
  { month: "Jun", revenue: 38000 },
  { month: "Jul", revenue: 45000 },
  { month: "Aug", revenue: 42000 },
  { month: "Sep", revenue: 48000 },
  { month: "Oct", revenue: 44000 },
  { month: "Nov", revenue: 50000 },
  { month: "Dec", revenue: 52520 },
];

export const ordersPerShop = [
  { shop: "Main Canteen", orders: 8400 },
  { shop: "Juice Corner", orders: 1900 },
  { shop: "Snack Hub", orders: 1547 },
];

export const topItems = [
  { name: "Chicken Biryani", orders: 1200 },
  { name: "Veg Thali", orders: 980 },
  { name: "Mango Shake", orders: 850 },
  { name: "Paneer Wrap", orders: 720 },
  { name: "Pasta", orders: 650 },
];
