import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  ShoppingBag, 
  User, 
  Bell, 
  ChevronDown,
  LogOut,
  Wallet as WalletIcon,
  Navigation,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { campusLocations } from '../data/shops';
import './Header.css';

const Header: React.FC = () => {
  const { 
    user, location, setLocation, detectLocation, cart, logout, 
    notifications, markNotificationAsRead, markAllNotificationsAsRead 
  } = useApp();
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const unreadNotifs = notifications.filter(n => !n.read);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClick = () => {
      setShowLocDropdown(false);
      setShowUserDropdown(false);
      setShowNotifDropdown(false);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <header className="sticky-header main-header">
      <div className="container header-container">
        <div className="header-left">
          <Link to="/dashboard" className="logo">
            <span className="logo-text">QuickPick</span>
          </Link>
          
          <div className="location-selector" onClick={(e) => { e.stopPropagation(); setShowLocDropdown(!showLocDropdown); }}>
            <MapPin size={18} className="loc-icon" />
            <span className="current-loc">{location}</span>
            <ChevronDown size={14} />
            
            {showLocDropdown && (
              <div className="location-dropdown card" onClick={e => e.stopPropagation()}>
                <button className="detect-btn" onClick={() => { detectLocation(); setShowLocDropdown(false); }}>
                  <Navigation size={16} />
                  <span>Detect My Location</span>
                </button>
                <div className="divider"></div>
                {campusLocations.map(loc => (
                  <div 
                    key={loc.name} 
                    className={`loc-option ${location === loc.name ? 'active' : ''}`}
                    onClick={() => {
                      setLocation(loc.name);
                      setShowLocDropdown(false);
                    }}
                  >
                    {loc.name}
                    {location === loc.name && <Check size={14} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <nav className="header-nav">
          <Link to="/dashboard" className="nav-link">
            <Search size={20} />
            <span>Search</span>
          </Link>
          <Link to="/orders" className="nav-link">
            <ShoppingBag size={20} />
            <span>Orders</span>
          </Link>
          
          <div className="notif-nav" onClick={(e) => { e.stopPropagation(); setShowNotifDropdown(!showNotifDropdown); }}>
            <div className="nav-link">
              <div className="icon-badge-wrapper">
                <Bell size={20} />
                {unreadNotifs.length > 0 && <span className="badge">{unreadNotifs.length}</span>}
              </div>
              <span>Notifications</span>
            </div>
            
            {showNotifDropdown && (
              <div className="notif-dropdown card" onClick={e => e.stopPropagation()}>
                <div className="notif-header">
                  <h3>Notifications</h3>
                  <button onClick={markAllNotificationsAsRead}>Mark all as read</button>
                </div>
                <div className="notif-list">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`notif-item ${n.read ? 'read' : 'unread'}`}
                        onClick={() => markNotificationAsRead(n.id)}
                      >
                        <div className={`notif-type-icon ${n.type}`}></div>
                        <div className="notif-content">
                          <h4>{n.title}</h4>
                          <p>{n.message}</p>
                          <span className="notif-time">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-notif">No new notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="user-nav" onClick={(e) => { e.stopPropagation(); setShowUserDropdown(!showUserDropdown); }}>
            <div className="user-trigger">
              <User size={20} />
              <span>{user?.name.split(' ')[0] || 'Sign In'}</span>
            </div>
            
            {showUserDropdown && user && (
              <div className="user-dropdown card" onClick={e => e.stopPropagation()}>
                <div className="dropdown-user-info">
                  <strong>{user.name}</strong>
                  <p>{user.studentId}</p>
                </div>
                <Link to="/profile" className="dropdown-item" onClick={() => setShowUserDropdown(false)}>Profile</Link>
                <Link to="/wallet" className="dropdown-item" onClick={() => setShowUserDropdown(false)}>Wallet (₹{user.walletBalance.toFixed(2)})</Link>
                <button className="dropdown-item logout" onClick={() => { logout(); navigate('/'); }}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

          <Link to="/cart" className="cart-link">
            <div className="cart-icon-wrapper">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </div>
            <span>Cart</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
