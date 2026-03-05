import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Clock,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Search
} from 'lucide-react';
import RevenueChart from '../components/vendor/RevenueChart.tsx';
import { Order, OrderStatus, RevenueData } from '../types.ts';
import OrderCard from '../components/vendor/OrderCard.tsx';

const MOCK_REVENUE: RevenueData[] = [
  { date: 'Mon', amount: 4500 },
  { date: 'Tue', amount: 5200 },
  { date: 'Wed', amount: 4800 },
  { date: 'Thu', amount: 6100 },
  { date: 'Fri', amount: 5900 },
  { date: 'Sat', amount: 7200 },
  { date: 'Sun', amount: 6800 },
];

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Rahul Sharma',
    items: [
      { id: '1', name: 'Veg Burger', quantity: 2, price: 80 },
      { id: '2', name: 'Cold Coffee', quantity: 1, price: 60 },
    ],
    total: 220,
    status: OrderStatus.PREPARING,
    timestamp: '2024-03-01T10:30:00Z',
    pickupTime: '11:15 AM',
  },
  {
    id: 'ORD-002',
    customerName: 'Priya Patel',
    items: [
      { id: '3', name: 'Paneer Tikka Sandwich', quantity: 1, price: 120 },
      { id: '4', name: 'Masala Tea', quantity: 2, price: 20 },
    ],
    total: 160,
    status: OrderStatus.READY,
    timestamp: '2024-03-01T10:45:00Z',
    pickupTime: '11:30 AM',
  },
];

const stats = [
  { label: 'Today\'s Revenue', value: '₹12,450', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12.5%', isUp: true },
  { label: 'Active Orders', value: '18', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+4', isUp: true },
  { label: 'Total Customers', value: '1,240', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+24', isUp: true },
  { label: 'Avg. Prep Time', value: '12 min', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-2 min', isUp: true },
];

export default function VendorDashboard() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleStatusChange = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleCancel = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: OrderStatus.CANCELLED } : o));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/orders?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Bar for Dashboard */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-line dark:border-slate-700 shadow-sm flex items-center gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Quick search orders by ID or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-line dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all dark:text-white"
          />
        </form>
        <button 
          onClick={() => navigate('/orders')}
          className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
        >
          Manage Orders
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-line dark:border-slate-700 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} dark:bg-slate-900/50 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.isUp ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <RevenueChart data={MOCK_REVENUE} timeRange="weekly" />
        </div>

        {/* Best Sellers */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-line dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Best Sellers</h3>
            <button 
              onClick={() => navigate('/analytics')}
              className="text-sm text-emerald-600 font-bold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {[
  {
    name: 'Masala Dosa',
    sales: 180,
    price: 45,
    image: 'https://vismaifood.com/storage/app/uploads/public/8b4/19e/427/thumb__700_0_0_0_auto.jpg'
  },
  {
    name: 'Chole Bhature',
    sales: 150,
    price: 60,
    image: 'https://static.toiimg.com/thumb/53314156.cms?imgsize=1762111&width=800&height=800'
  },
  {
    name: 'Veg Biryani',
    sales: 120,
    price: 90,
    image: 'https://i.pinimg.com/474x/b6/0c/a5/b60ca58bc5c72d11a9679898d9deb006.jpg'
  },
  {
    name: 'Cold Coffee',
    sales: 95,
    price: 40,
    image: 'https://i.pinimg.com/564x/cc/cb/00/cccb00473890ed242fff3e0c66d3ff33.jpg'
  }
].map((item) => (
              <div key={item.name} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{item.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.sales} sales this week</p>
                </div>
                <span className="text-sm font-bold text-emerald-600">₹{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Orders</h3>
          <button 
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-emerald-600 font-bold hover:underline"
          >
            View All Orders
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.slice(0, 3).map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              onCancel={handleCancel}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
