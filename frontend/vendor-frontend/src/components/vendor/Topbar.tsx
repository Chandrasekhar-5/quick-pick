import { useState, useRef, useEffect } from 'react';
import { Bell, User, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext.tsx';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from "react-router-dom";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TopbarProps {
  title: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'order' | 'stock' | 'system';
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'New Order', message: 'Order #ORD-005 received for Veg Burger', time: '2 mins ago', isRead: false, type: 'order' },
  { id: '2', title: 'Low Stock', message: 'Cold Coffee is running low (5 left)', time: '15 mins ago', isRead: false, type: 'stock' },
  { id: '3', title: 'System Update', message: 'Dashboard version 2.1 is now live', time: '1 hour ago', isRead: true, type: 'system' },
];

export default function Topbar({ title }: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const { primaryColor } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getPrimaryText = () => {
    switch (primaryColor) {
      case 'blue': return "text-blue-600 dark:text-blue-400";
      case 'orange': return "text-orange-600 dark:text-orange-400";
      default: return "text-emerald-600 dark:text-emerald-400";
    }
  };

  return (
    
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-line dark:border-slate-800 sticky top-0 z-40 px-8 flex items-center justify-between transition-colors">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h2>

      <div className="flex items-center gap-6">

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-line dark:border-slate-700 overflow-hidden"
              >
                <div className="p-4 border-b border-line dark:border-slate-700 flex items-center justify-between bg-gray-50 dark:bg-slate-800/50">
                  <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                  <button 
                    onClick={markAllAsRead}
                    className={cn("text-xs font-bold hover:underline", getPrimaryText())}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div 
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={cn(
                          "p-4 border-b border-line dark:border-slate-700 last:border-0 cursor-pointer transition-colors",
                          n.isRead ? "bg-white dark:bg-slate-800" : "bg-emerald-50/30 dark:bg-emerald-900/10"
                        )}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={cn("text-sm font-bold", n.isRead ? "text-gray-900 dark:text-white" : getPrimaryText())}>
                            {n.title}
                          </h4>
                          {!n.isRead && <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5"></div>}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{n.message}</p>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                          <Clock className="w-3 h-3" />
                          {n.time}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <Check className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">All caught up!</p>
                    </div>
                  )}
                </div>
                <div className="p-3 text-center bg-gray-50 dark:bg-slate-800/50 border-t border-line dark:border-slate-700">
                  <button className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                    View All Notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
  onClick={() => navigate("/profile")}
  className="flex items-center gap-3 pl-6 border-l border-line dark:border-slate-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 px-3 py-1 rounded-lg transition"
>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Main Canteen</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Vendor Portal</p>
          </div>
          <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden border border-line dark:border-slate-700">
            <User className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
