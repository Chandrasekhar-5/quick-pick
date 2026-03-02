import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  Wallet, 
  User, 
  LogOut, 
  Menu as MenuIcon, 
  X,
  Bell,
  ShoppingCart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Layout.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout, cart } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/menu', label: 'Menu', icon: <UtensilsCrossed size={20} /> },
    { path: '/orders', label: 'My Orders', icon: <ShoppingBag size={20} /> },
    { path: '/wallet', label: 'Wallet', icon: <Wallet size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const notifications = [
    { id: 1, text: "Your order #ORD-8102 is ready for pickup!", time: "2 mins ago" },
    { id: 2, text: "Payment of $12.75 successful.", time: "1 hour ago" },
    { id: 3, text: "Pickup slot reminder: 12:45 PM", time: "3 hours ago" }
  ];

  return (
    <div className="app-layout">
      {/* Sidebar Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">Q</div>
            <span>QuickPick</span>
          </div>
          <button className="close-sidebar" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>
              <MenuIcon size={24} />
            </button>
            <h2 className="page-title">
              {navItems.find(i => i.path === location.pathname)?.label || 'QuickPick'}
            </h2>
          </div>

          <div className="header-right">
            <Link to="/cart" className="cart-btn">
              <ShoppingCart size={20} />
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </Link>

            <div className="notification-wrapper">
              <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell size={20} />
                <span className="notif-dot" />
              </button>
              {showNotifications && (
                <div className="notifications-dropdown card">
                  <div className="notif-header">
                    <h4>Notifications</h4>
                    <button onClick={() => setShowNotifications(false)}>Clear all</button>
                  </div>
                  <div className="notif-list">
                    {notifications.map(n => (
                      <div key={n.id} className="notif-item">
                        <p>{n.text}</p>
                        <span>{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">{user?.name || 'Student'}</span>
                <span className="user-role">Student</span>
              </div>
              <div className="user-avatar">
                {user?.name?.charAt(0) || 'S'}
              </div>
            </div>
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
