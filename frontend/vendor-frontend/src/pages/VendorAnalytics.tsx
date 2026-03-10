import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp, DollarSign, ShoppingBag, Clock, ArrowUpRight, ArrowDownRight, Download
} from 'lucide-react';
import RevenueChart from '../components/vendor/RevenueChart.tsx';
import { RevenueData } from '../types.ts';
import API from '../services/api';

const MOCK_REVENUE_WEEKLY: RevenueData[] =[
  { date: 'Mon', amount: 4500 }, { date: 'Tue', amount: 5200 }, { date: 'Wed', amount: 4800 },
  { date: 'Thu', amount: 6100 }, { date: 'Fri', amount: 5900 }, { date: 'Sat', amount: 7200 }, { date: 'Sun', amount: 6800 },
];
const MOCK_REVENUE_MONTHLY: RevenueData[] =[
  { date: 'Week 1', amount: 28000 }, { date: 'Week 2', amount: 32000 }, { date: 'Week 3', amount: 30500 }, { date: 'Week 4', amount: 35000 },
];
const MOCK_REVENUE_ANNUAL: RevenueData[] =[
  { date: 'Jan', amount: 120000 }, { date: 'Feb', amount: 135000 }, { date: 'Mar', amount: 142000 },
  { date: 'Apr', amount: 128000 }, { date: 'May', amount: 155000 }, { date: 'Jun', amount: 160000 },
];

export default function VendorAnalytics() {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'annual'>('weekly');
  const[isExporting, setIsExporting] = useState(false);
  
  const [realStats, setRealStats] = useState({ totalRevenue: 0, totalOrders: 0 });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await API.get('/analytics/vendor');
        if (response.data) {
          setRealStats({
            totalRevenue: response.data.totalRevenue || 0,
            totalOrders: response.data.totalOrders || 0
          });
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      }
    };
    fetchAnalytics();
  },[]);

  const getChartData = () => {
    switch (timeRange) {
      case 'weekly': return MOCK_REVENUE_WEEKLY;
      case 'monthly': return MOCK_REVENUE_MONTHLY;
      case 'annual': return MOCK_REVENUE_ANNUAL;
      default: return MOCK_REVENUE_WEEKLY;
    }
  };

  const getStats = () => {
    if (timeRange === 'weekly') {
      return[
        { label: 'Total Revenue', value: `₹${realStats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', trend: 'Live', isUp: true },
        { label: 'Total Completed Orders', value: realStats.totalOrders.toString(), icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', trend: 'Live', isUp: true },
        { label: 'Avg. Order Value', value: `₹${realStats.totalOrders > 0 ? Math.round(realStats.totalRevenue / realStats.totalOrders) : 0}`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', trend: 'Live', isUp: true },
        { label: 'Peak Hour', value: '1:00 PM', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', trend: 'Mocked', isUp: true },
      ];
    }
    
    if (timeRange === 'monthly') {
      return[
        { label: 'Monthly Revenue', value: '₹1,25,500', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', trend: '+10.5%', isUp: true },
        { label: 'Monthly Orders', value: '1,380', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', trend: '+5.2%', isUp: true },
        { label: 'Avg. Order Value', value: '₹91', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', trend: '+1.2%', isUp: true },
        { label: 'Peak Day', value: 'Friday', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', trend: 'Weekend', isUp: true },
      ];
    }
    
    return[
      { label: 'Annual Revenue', value: '₹15,40,500', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', trend: '+22.1%', isUp: true },
      { label: 'Annual Orders', value: '16,450', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', trend: '+18.4%', isUp: true },
      { label: 'Avg. Order Value', value: '₹94', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', trend: '+4.1%', isUp: true },
      { label: 'Peak Month', value: 'December', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', trend: 'Festive', isUp: true },
    ];
  };

  const handleExport = () => {
    setIsExporting(true);
    const data = getChartData();
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Date,Amount\n"
      + data.map(e => `${e.date},${e.amount}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `revenue_report_${timeRange}.csv`);
    document.body.appendChild(link);

    setTimeout(() => {
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 1000);
  };

  const currentStats = getStats();

  return (
    <div className="space-y-8">
      {/* Header */}
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
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${ timeRange === range ? "bg-emerald-500 text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
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
        {currentStats.map((stat, idx) => (
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart data={getChartData()} timeRange={timeRange} />
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-line dark:border-slate-700 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Category Distribution</h3>
          <div className="space-y-6">
            {[
              { label: 'Snacks', value: 45, color: 'bg-emerald-500' },
              { label: 'Beverages', value: 30, color: 'bg-blue-500' },
              { label: 'Main Course', value: 15, color: 'bg-purple-500' },
              { label: 'Desserts', value: 10, color: 'bg-amber-500' },
            ].map((item) => (
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
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Optimization Tip</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Your snacks category is performing exceptionally well. Consider adding more seasonal variations to increase the average order value.
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
              {[
                { name: 'Veg Burger', category: 'Snacks', price: 80, sales: 1240, revenue: 99200, status: 'Trending' },
                { name: 'Cold Coffee', category: 'Beverages', price: 60, sales: 980, revenue: 58800, status: 'Stable' },
                { name: 'Paneer Sandwich', category: 'Snacks', price: 120, sales: 750, revenue: 90000, status: 'Growing' },
                { name: 'Masala Tea', category: 'Beverages', price: 20, sales: 1500, revenue: 30000, status: 'Stable' },
              ].map((item) => (
                <tr key={item.name} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.category}</td>
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
        </div>
      </div>
    </div>
  );
}