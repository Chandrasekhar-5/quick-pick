import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  ShoppingBag, 
  Clock, 
  ArrowRight, 
  Utensils, 
  History, 
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  const quickActions = [
    { label: 'Pre-Order Food', icon: <Clock size={24} />, path: '/menu', color: 'blue' },
    { label: 'Instant Order', icon: <Utensils size={24} />, path: '/menu', color: 'green' },
    { label: 'View Orders', icon: <History size={24} />, path: '/orders', color: 'orange' },
    { label: 'View Wallet', icon: <CreditCard size={24} />, path: '/wallet', color: 'purple' },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="welcome-text">
          <h1>Welcome back, {user?.name || 'Student'}! 👋</h1>
          <p>Ready to grab some delicious food today?</p>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Wallet Card */}
        <div className="card wallet-card">
          <div className="card-header">
            <div className="icon-box blue">
              <Wallet size={20} />
            </div>
            <span>Wallet Balance</span>
          </div>
          <div className="balance-amount">${user?.walletBalance.toFixed(2)}</div>
          <button className="btn-text" onClick={() => navigate('/wallet')}>
            Top up wallet <ArrowRight size={16} />
          </button>
        </div>

        {/* Today's Orders Summary */}
        <div className="card summary-card">
          <div className="card-header">
            <div className="icon-box green">
              <ShoppingBag size={20} />
            </div>
            <span>Today's Orders</span>
          </div>
          <div className="summary-count">2 Orders</div>
          <p className="summary-detail">1 Ready for pickup</p>
        </div>

        {/* Next Pickup Slot */}
        <div className="card slot-card">
          <div className="card-header">
            <div className="icon-box orange">
              <Clock size={20} />
            </div>
            <span>Next Pickup Slot</span>
          </div>
          <div className="slot-time">12:45 PM</div>
          <p className="slot-detail">In 25 minutes</p>
        </div>
      </div>

      <section className="quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <motion.button 
              key={index}
              whileHover={{ y: -5 }}
              className={`action-card card ${action.color}`}
              onClick={() => navigate(action.path)}
            >
              <div className="action-icon">{action.icon}</div>
              <span>{action.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      <div className="dashboard-bottom">
        <div className="card live-status-card">
          <div className="live-header">
            <h3>Live Order Status</h3>
            <span className="status-badge status-ready">Ready</span>
          </div>
          <div className="live-content">
            <div className="live-info">
              <h4>Order #ORD-8102</h4>
              <p>1x Belgian Waffles</p>
              <div className="pickup-code">
                <span>Pickup Code:</span>
                <strong>QP-X82</strong>
              </div>
            </div>
            <div className="live-qr">
              <div className="qr-placeholder">
                <CheckCircle2 size={48} color="var(--secondary)" />
                <span>Scan at counter</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
