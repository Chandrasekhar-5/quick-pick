import { useState, useEffect } from 'react';
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
  Search,
  Loader2
} from 'lucide-react';
import RevenueChart from '../components/vendor/RevenueChart.tsx';
import { Order, OrderStatus, RevenueData, DashboardStats } from '../types.ts';
import OrderCard from '../components/vendor/OrderCard.tsx';
import API from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function VendorDashboard() {
  const { vendor } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    todayRevenue: 0,
    activeOrders: 0,
    totalCustomers: 0,
    avgPrepTime: 0,
    revenueTrend: '+0%',
    ordersTrend: '0',
    customersTrend: '0',
    prepTimeTrend: '0'
  });
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    if (!vendor?.id) return;
    
    setIsLoading(true);
    try {
      const [ordersRes, statsRes, bestSellersRes, revenueRes] = await Promise.all([
        API.get('/orders/vendor-orders?limit=3&sort=-createdAt'),
        API.get('/analytics/dashboard-stats'),
        API.get('/analytics/best-sellers'),
        API.get('/analytics/revenue/weekly')
      ]);

      const mappedOrders = ordersRes.data.map((dbOrder: any) => ({
        id: dbOrder._id,
        customerName: dbOrder.userId?.name || 'Unknown Customer',
        items: dbOrder.items.map((i: any) => ({
          id: i.menuItem?._id || Math.random().toString(),
          name: i.menuItem?.name || 'Unknown Item',
          quantity: i.quantity,
          price: i.priceAtOrder
        })),
        total: dbOrder.totalAmount,
        status: dbOrder.status.toUpperCase() as OrderStatus,
        timestamp: dbOrder.createdAt,
        pickupTime: "Standard",
      }));
      setOrders(mappedOrders);

      setStats(statsRes.data);
      
      setBestSellers(bestSellersRes.data);
      
      setRevenueData(revenueRes.data);

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [vendor]); 

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      fetchDashboardData();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleCancel = async (id: string) => {
    await handleStatusChange(id, OrderStatus.CANCELLED);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/orders?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
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
        {[
          { 
            label: "Today's Revenue", 
            value: `₹${stats.todayRevenue.toLocaleString()}`, 
            icon: TrendingUp, 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50',
            trend: stats.revenueTrend,
            isUp: !stats.revenueTrend.startsWith('-')
          },
          { 
            label: 'Active Orders', 
            value: stats.activeOrders.toString(), 
            icon: ShoppingBag, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50',
            trend: stats.ordersTrend,
            isUp: !stats.ordersTrend.startsWith('-')
          },
          { 
            label: 'Total Customers', 
            value: stats.totalCustomers.toString(), 
            icon: Users, 
            color: 'text-purple-600', 
            bg: 'bg-purple-50',
            trend: stats.customersTrend,
            isUp: !stats.customersTrend.startsWith('-')
          },
          { 
            label: 'Avg. Prep Time', 
            value: `${stats.avgPrepTime} min`, 
            icon: Clock, 
            color: 'text-amber-600', 
            bg: 'bg-amber-50',
            trend: stats.prepTimeTrend,
            isUp: stats.prepTimeTrend.startsWith('-') 
          },
        ].map((stat, idx) => (
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
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                stat.isUp ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 
                'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
              }`}>
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
          <RevenueChart data={revenueData} timeRange="weekly" />
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
            {bestSellers.map((item) => (
              <div key={item._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                <img 
                  src={item.image || 'https://via.placeholder.com/48'} 
                  alt={item.name} 
                  className="w-12 h-12 rounded-lg object-cover" 
                  referrerPolicy="no-referrer" 
                />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{item.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.salesCount} sales this week</p>
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
          {orders.map((order) => (
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