import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Orders.css';

const Orders: React.FC = () => {
  // NEW: Pull the REAL orders from your AppContext
  const { orders } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // NEW: Make the search bar actually work!
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.shopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="orders-page" style={{ padding: '20px' }}>
      <div className="orders-header">
        <div className="header-titles">
          <h1>Order History</h1>
          <p>Track and manage your campus meals.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>New Order</button>
        </div>
      </div>

      <div className="card orders-card">
        <div className="table-controls">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Shop..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="orders-table" style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Shop</th>
                <th>Date & Time</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td className="order-id"><strong>{order.id}</strong></td>
                    <td>{order.shopName}</td>
                    <td className="order-date">
                      {/* Format the ugly ISO timestamp into a beautiful readable date */}
                      {new Date(order.timestamp).toLocaleString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="order-total">₹{order.total}</td>
                    <td>
                      <span className={`status-badge status-${order.status}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {/* Navigate back to the tracking page so they can cancel it or see the QR */}
                      <button 
                        className="btn-icon-outline" 
                        onClick={() => navigate(`/order-tracking/${order.id}`)}
                        title="View Order Details"
                        style={{ padding: '5px 10px', cursor: 'pointer' }}
                      >
                        <Eye size={18} /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    You haven't placed any orders yet. Go grab some food!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;