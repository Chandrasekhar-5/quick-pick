import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.tsx';
import Topbar from './Topbar.tsx';
import { motion, AnimatePresence } from 'motion/react';

export default function VendorLayout() {
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/': return 'Dashboard';
      case '/orders': return 'Orders';
      case '/menu': return 'Menu Management';
      case '/analytics': return 'Analytics';
      default: return 'QuickPick';
    }
  };

  return (
  <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
    <Sidebar />
    <main className="flex-1 ml-64 min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Topbar title={getPageTitle(location.pathname)} />
      <div className="p-8" style={{ backgroundColor: 'var(--bg)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  </div>
);
}
