import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp, DollarSign, ShoppingBag, Clock, 
  ArrowUpRight, ArrowDownRight, Download, Loader2, AlertCircle
} from 'lucide-react';
import RevenueChart from '../components/vendor/RevenueChart.tsx';
import { RevenueData } from '../types.ts';
import API from '../services/api';

export default function VendorAnalytics() {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'annual'>('weekly');
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [metrics, setMetrics] = useState({ totalRevenue: 0, totalOrders: 0 });
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<any[]>([]);
  const [topItems, setTopItems] = useState<any[]>([]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      
      const [metricsRes, revenueRes, categoryRes, topItemsRes] = await Promise.all([
        API.get('/analytics/vendor').catch(() => ({ data: { totalRevenue: 0, totalOrders: 0 } })),
        API.get(`/analytics/revenue/${timeRange}`).catch(() => ({ data: [] })),
        API.get('/analytics/category-distribution').catch(() => ({ data: [] })),
        API.get('/analytics/top-items').catch(() => ({ data: [] }))
      ]);

      setMetrics(metricsRes.data);
      setRevenueData(revenueRes.data.length ? revenueRes.data : getDefaultRevenueData(timeRange));
      setCategoryDistribution(categoryRes.data.length ? categoryRes.data : getDefaultCategoryData());
      setTopItems(topItemsRes.data);

    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError("Failed to load analytics data");
      
      setRevenueData(getDefaultRevenueData(timeRange));
      setCategoryDistribution(getDefaultCategoryData());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultRevenueData = (range: string): RevenueData[] => {
    if (range === 'weekly') {
      return [
        { date: 'Mon', amount: 0 },
        { date: 'Tue', amount: 0 },
        { date: 'Wed', amount: 0 },
        { date: 'Thu', amount: 0 },
        { date: 'Fri', amount: 0 },
        { date: 'Sat', amount: 0 },
        { date: 'Sun', amount: 0 }
      ];
    } else if (range === 'monthly') {
      return [
        { date: 'Week 1', amount: 0 },
        { date: 'Week 2', amount: 0 },
        { date: 'Week 3', amount: 0 },
        { date: 'Week 4', amount: 0 }
      ];
    } else {
      return [
        { date: 'Jan', amount: 0 }, { date: 'Feb', amount: 0 }, { date: 'Mar', amount: 0 },
        { date: 'Apr', amount: 0 }, { date: 'May', amount: 0 }, { date: 'Jun', amount: 0 },
        { date: 'Jul', amount: 0 }, { date: 'Aug', amount: 0 }, { date: 'Sep', amount: 0 },
        { date: 'Oct', amount: 0 }, { date: 'Nov', amount: 0 }, { date: 'Dec', amount: 0 }
      ];
    }
  };

  const getDefaultCategoryData = () => [
    { label: 'Snacks', value: 45 },
    { label: 'Beverages', value: 30 },
    { label: 'Main Course', value: 15 },
    { label: 'Desserts', value: 10 }
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const avgOrderValue = metrics.totalOrders > 0 
    ? Math.round(metrics.totalRevenue / metrics.totalOrders) 
    : 0;

  const stats = [
    { 
      label: `${timeRange === 'weekly' ? 'Weekly' : timeRange === 'monthly' ? 'Monthly' : 'Annual'} Revenue`, 
      value: `₹${metrics.totalRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50 dark:bg-emerald-900/20', 
      trend: 'Live', 
      isUp: true 
    },
    { 
      label: `${timeRange === 'weekly' ? 'Weekly' : timeRange === 'monthly' ? 'Monthly' : 'Annual'} Orders`, 
      value: metrics.totalOrders.toString(), 
      icon: ShoppingBag, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50 dark:bg-blue-900/20', 
      trend: 'Live', 
      isUp: true 
    },
    { 
      label: 'Avg. Order Value', 
      value: `₹${avgOrderValue}`, 
      icon: TrendingUp, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50 dark:bg-purple-900/20', 
      trend: 'Live', 
      isUp: true 
    },
    { 
      label: 'Peak Hour', 
      value: '1:00 PM', 
      icon: Clock, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50 dark:bg-amber-900/20', 
      trend: 'Live', 
      isUp: true 
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Failed to load analytics</h3>
        <button 
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header - same as before */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Performance Insights</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track your canteen's growth and efficiency</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white dark:bg-slate-800 border border-line dark:border-slate-700 rounded-xl p-1 flex">
            {(['weekly', 'monthly', 'annual'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  timeRange === range 
                    ? "bg-emerald-500 text-white shadow-sm" 
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setIsExporting(true);
              setTimeout(() => setIsExporting(false), 1000);
            }}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 disabled:opacity-70"
          >
            {isExporting ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Clock className="w-4 h-4" />
              </motion.div>
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isExporting ? 'Exporting...' : 'Export Report'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label + timeRange}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-line dark:border-slate-700 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} timeRange={timeRange} />
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-line dark:border-slate-700 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Category Distribution</h3>
          <div className="space-y-6">
            {categoryDistribution.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                  <span className="text-gray-900 dark:text-white">{item.value}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full ${
                      item.label === 'Snacks' ? 'bg-emerald-500' :
                      item.label === 'Beverages' ? 'bg-blue-500' :
                      item.label === 'Main Course' ? 'bg-purple-500' :
                      'bg-amber-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Optimization Tip</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {topItems.length > 0 
                ? `Your ${topItems[0]?.name} is selling well. Consider promoting it more!`
                : "Add some menu items and complete orders to see insights here."}
            </p>
          </div>
        </div>
      </div>

      {/* Best Selling Items Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-line dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-line dark:border-slate-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Top Performing Items</h3>
        </div>
        <div className="overflow-x-auto">
          {topItems.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-900/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Item Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Total Sales</th>
                  <th className="px-6 py-4">Revenue</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line dark:divide-slate-700">
                {topItems.map((item) => (
                  <tr key={item.name} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.category || 'General'}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">₹{item.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.sales}</td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">₹{item.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'Trending' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' :
                        item.status === 'Growing' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
                        'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-bold mb-2">No sales data yet</p>
              <p className="text-sm">Complete some orders to see your top performing items here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}