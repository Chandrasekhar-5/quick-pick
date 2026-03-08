import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext.tsx';
import { Sun, Moon, Palette, Check, Layout, Bell, Shield, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

export default function VendorSettings() {
  const { theme, setTheme, primaryColor, setPrimaryColor } = useTheme();
  const [notifications, setNotifications] = useState({
    orders: true,
    stock: true,
    revenue: false,
  });

  const toggleNotification = (id: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const colors = [
    { id: 'emerald', name: 'Emerald', class: 'bg-emerald-500' },
    { id: 'blue', name: 'Blue', class: 'bg-blue-500' },
    { id: 'orange', name: 'Orange', class: 'bg-orange-500' },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-500 dark:text-gray-400">Manage your dashboard preferences and account settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Appearance Section */}
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white dark:bg-slate-800 rounded-3xl border border-line dark:border-slate-700 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
                <Layout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Appearance</h3>
            </div>

            <div className="space-y-8">
              {/* Theme Toggle */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Theme Mode</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                      theme === 'light'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
                        : 'border-line dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <Sun className="w-5 h-5" />
                    <span className="font-bold">Light Mode</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
                        : 'border-line dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <Moon className="w-5 h-5" />
                    <span className="font-bold">Dark Mode</span>
                  </button>
                </div>
              </div>

              {/* Primary Color Selection */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Primary Color</label>
                <div className="flex flex-wrap gap-4">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setPrimaryColor(color.id)}
                      className={`relative w-12 h-12 rounded-2xl ${color.class} transition-transform hover:scale-110 flex items-center justify-center`}
                    >
                      {primaryColor === color.id && (
                        <motion.div
                          layoutId="activeColor"
                          className="absolute inset-0 border-4 border-white dark:border-slate-800 rounded-2xl"
                        >
                          <Check className="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="bg-white dark:bg-slate-800 rounded-3xl border border-line dark:border-slate-700 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h3>
            </div>

            <div className="space-y-4">
              {[
                { id: 'orders', label: 'New Orders', desc: 'Get notified when a customer places a new order' },
                { id: 'stock', label: 'Low Stock Alerts', desc: 'Get notified when items are running low' },
                { id: 'revenue', label: 'Daily Revenue Summary', desc: 'Receive a summary of your daily earnings' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-2xl transition-all">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => toggleNotification(item.id as keyof typeof notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      notifications[item.id as keyof typeof notifications] ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'
                    }`}
                  >
                    <span className="sr-only">Toggle</span>
                    <span 
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications[item.id as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                      }`} 
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-line dark:border-slate-700 p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { icon: Shield, label: 'Security', path: '/profile' },
                { icon: Smartphone, label: 'Mobile App', path: '#' },
                { icon: Palette, label: 'Customization', path: '#' },
              ].map((link) => (
                <button
                  key={link.label}
                  className="flex items-center gap-3 w-full p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl transition-all"
                >
                  <link.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{link.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-emerald-500 rounded-3xl p-6 text-white shadow-lg shadow-emerald-200 dark:shadow-none">
            <h4 className="font-bold mb-2">Need help?</h4>
            <p className="text-sm text-emerald-50 opacity-90 mb-4">Check our documentation or contact support for assistance.</p>
            <button className="w-full py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
