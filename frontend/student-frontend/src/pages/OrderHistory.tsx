import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Clock, 
  Search, 
  Filter, 
  RefreshCw, 
  XCircle,
  QrCode,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './OrderHistory.css';

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, addToCart } = useApp();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filter === 'All' || order.status === filter;
    const matchesSearch = order.shopName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleReorder = (order: any) => {
    order.items.forEach((item: any) => {
      addToCart(item, order.shopId);
    });
    navigate('/cart');
  };

  const handleCancel = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      updateOrderStatus(orderId, 'Cancelled');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return '#FC8019';
      case 'Preparing': return '#f59e0b';
      case 'Ready': return '#60b246';
      case 'Picked Up': return '#48c479';
      case 'Cancelled': return '#e53935';
      default: return '#9e9e9e';
    }
  };

  return (
    <div className="order-history-page container">
      <div className="history-header">
        <div className="header-text">
          <h1>My Orders</h1>
          <p>Manage and track your campus food orders</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <Filter size={18} />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready">Ready</option>
              <option value="Picked Up">Picked Up</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="orders-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order.id} className="order-card card">
              <div className="order-card-header">
                <div className="shop-info">
                  <img src="https://picsum.photos/seed/shop/100/100" alt={order.shopName} referrerPolicy="no-referrer" />
                  <div className="text">
                    <h3>{order.shopName}</h3>
                    <p>{order.date}</p>
                  </div>
                </div>
                <div className="status-badge" style={{ backgroundColor: getStatusColor(order.status) + '15', color: getStatusColor(order.status) }}>
                  {order.status}
                </div>
              </div>

              <div className="order-card-body">
                <div className="items-summary">
                  <p className="item-names">
                    {order.items.map(item => `${item.name} x ${item.quantity}`).join(', ')}
                  </p>
                  <p className="order-total">₹{order.total}</p>
                </div>
                
                <div className="order-meta">
                  <div className="meta-item">
                    <Clock size={14} />
                    <span>Slot: {order.pickupSlot}</span>
                  </div>
                  <div className="meta-item">
                    <ShoppingBag size={14} />
                    <span>ID: #{order.id}</span>
                  </div>
                </div>
              </div>

              <div className="order-card-footer">
                <div className="footer-left">
                  {order.status === 'Ready' && (
                    <button className="qr-mini-btn" onClick={() => navigate(`/order-tracking/${order.id}`)}>
                      <QrCode size={16} />
                      <span>View QR</span>
                    </button>
                  )}
                  {(order.status === 'Confirmed' || order.status === 'Preparing' || order.status === 'Ready') && (
                    <button className="track-btn" onClick={() => navigate(`/order-tracking/${order.id}`)}>
                      Track Order
                    </button>
                  )}
                </div>
                <div className="footer-right">
                  {order.status === 'Confirmed' && (
                    <button className="cancel-btn" onClick={() => handleCancel(order.id)}>
                      <XCircle size={16} />
                      <span>Cancel</span>
                    </button>
                  )}
                  {(order.status === 'Picked Up' || order.status === 'Cancelled') && (
                    <button className="reorder-btn" onClick={() => handleReorder(order)}>
                      <RefreshCw size={16} />
                      <span>Reorder</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-orders card">
            <ShoppingBag size={60} color="#e9e9eb" />
            <h3>No orders found</h3>
            <p>Looks like you haven't placed any orders yet.</p>
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>
              ORDER NOW
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
