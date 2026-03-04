import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Utensils, ClipboardList, BarChart3, LogOut, UserCircle, Settings } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useTheme } from '../../contexts/ThemeContext.tsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ClipboardList, label: 'Orders', path: '/orders' },
  { icon: Utensils, label: 'Menu', path: '/menu' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: UserCircle, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const { primaryColor } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getActiveClasses = () => {
    switch (primaryColor) {
      case 'blue': return "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
      case 'orange': return "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400";
      default: return "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400";
    }
  };

  const getPrimaryBg = () => {
    switch (primaryColor) {
      case 'blue': return "bg-blue-500";
      case 'orange': return "bg-orange-500";
      default: return "bg-emerald-500";
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-line dark:border-slate-800 flex flex-col z-50 transition-colors">
      <div className="p-6 border-b border-line dark:border-slate-800 flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-lg", getPrimaryBg())}>
          <Utensils className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight dark:text-white">QuickPick</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? cn("font-bold", getActiveClasses())
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-line dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
