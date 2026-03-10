import { Clock, User, CheckCircle2, XCircle } from 'lucide-react';
import { Order, OrderStatus } from '../../types.ts';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface OrderCardProps {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onCancel: (id: string) => void;
}

export default function OrderCard({ order, onStatusChange, onCancel }: OrderCardProps) {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PREPARING: return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
      case OrderStatus.READY: return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
      case OrderStatus.COMPLETED: return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
      case OrderStatus.CANCELLED: return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50';
      default: return 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-line dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 dark:bg-slate-900 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{order.customerName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Pickup: {order.pickupTime}
            </p>
          </div>
        </div>
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
          getStatusColor(order.status)
        )}>
          {order.status}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between items-center bg-gray-50 dark:bg-slate-900/50 p-3 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-white dark:bg-slate-800 rounded-md flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400 border border-line dark:border-slate-700">
                {item.quantity}x
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-line dark:border-slate-700 mb-6">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</span>
        <span className="text-xl font-bold text-gray-900 dark:text-white">₹{order.total}</span>
      </div>

{/* after the order status is set to preparing in student-frontend, remove comments for this
      <div className="flex gap-3">
        {order.status === OrderStatus.PREPARING && (
          <button
            onClick={() => onStatusChange(order.id, OrderStatus.READY)}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            Mark Ready
          </button>
        )}
        {order.status === OrderStatus.READY && (
          <button
            onClick={() => onStatusChange(order.id, OrderStatus.COMPLETED)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            Complete Order
          </button>
        )}
        {(order.status === OrderStatus.PREPARING || order.status === OrderStatus.READY) && (
          <button
            onClick={() => onCancel(order.id)}
            className="p-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl transition-all"
            title="Cancel Order"
          >
            <XCircle className="w-6 h-6" />
          </button>
        )}
      </div>
*/}


{/* after the order status is set to preparing in student-frontend, remove this code */}

<div className="flex gap-3">
  {order.status === OrderStatus.PENDING && (
    <button
      onClick={() => onStatusChange(order.id, OrderStatus.PREPARING)}
      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
    >
      <CheckCircle2 className="w-5 h-5" />
      Start Preparing
    </button>
  )}
  {order.status === OrderStatus.PREPARING && (
    <button
      onClick={() => onStatusChange(order.id, OrderStatus.READY)}
      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
    >
      <CheckCircle2 className="w-5 h-5" />
      Mark Ready
    </button>
  )}
  {order.status === OrderStatus.READY && (
    <button
      onClick={() => onStatusChange(order.id, OrderStatus.COMPLETED)}
      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
    >
      <CheckCircle2 className="w-5 h-5" />
      Complete Order
    </button>
  )}
  {(order.status === OrderStatus.PENDING || 
    order.status === OrderStatus.PREPARING || 
    order.status === OrderStatus.READY) && (
    <button
      onClick={() => onCancel(order.id)}
      className="p-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl transition-all"
      title="Cancel Order"
    >
      <XCircle className="w-6 h-6" />
    </button>
  )}
</div>


    </motion.div>
  );
}
