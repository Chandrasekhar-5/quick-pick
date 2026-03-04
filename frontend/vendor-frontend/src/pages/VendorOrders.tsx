import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Calendar, Download, Clock } from 'lucide-react';
import { Order, OrderStatus } from '../types.ts';
import OrderCard from '../components/vendor/OrderCard.tsx';
import { motion, AnimatePresence } from 'motion/react';

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
  {
    id: 'ORD-003',
    customerName: 'Amit Kumar',
    items: [
      { id: '5', name: 'French Fries', quantity: 1, price: 70 },
      { id: '6', name: 'Pasta Arrabbiata', quantity: 1, price: 150 },
    ],
    total: 220,
    status: OrderStatus.COMPLETED,
    timestamp: '2024-03-01T09:15:00Z',
    pickupTime: '10:00 AM',
  },
  {
    id: 'ORD-004',
    customerName: 'Sneha Gupta',
    items: [
      { id: '1', name: 'Veg Burger', quantity: 1, price: 80 },
      { id: '4', name: 'Masala Tea', quantity: 1, price: 20 },
    ],
    total: 100,
    status: OrderStatus.CANCELLED,
    timestamp: '2024-03-01T09:30:00Z',
    pickupTime: '10:15 AM',
  },
];

const statuses = ['All', OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.COMPLETED, OrderStatus.CANCELLED];

export default function VendorOrders() {
  const location = useLocation();
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [location.search]);

  const handleStatusChange = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleCancel = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: OrderStatus.CANCELLED } : o));
  };

  const handleExport = () => {
    setIsExporting(true);
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Order ID,Customer,Total,Status,Pickup Time\n"
      + filteredOrders.map(o => `${o.id},${o.customerName},${o.total},${o.status},${o.pickupTime}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    setTimeout(() => {
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 1000);
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = activeStatus === 'All' || order.status === activeStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID or Customer Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-line dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm dark:text-white"
            />
          </div>
          <button className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 border border-line dark:border-slate-700 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm">
            <Calendar className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Today</span>
          </button>
        </div>

        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-line dark:border-slate-700 text-gray-700 dark:text-gray-300 font-bold px-6 py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm disabled:opacity-70"
        >
          {isExporting ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <Clock className="w-5 h-5" />
            </motion.div>
          ) : (
            <Download className="w-5 h-5" />
          )}
          {isExporting ? 'Exporting...' : 'Export Report'}
        </button>
      </div>

      {/* Status Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
              activeStatus === status
                ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-100"
                : "bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-line dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-500"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <OrderCard
                order={order}
                onStatusChange={handleStatusChange}
                onCancel={handleCancel}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-10 h-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">No orders found</h3>
          <p className="dark:text-gray-400">There are no orders matching your current filters.</p>
        </div>
      )}
    </div>
  );
}
