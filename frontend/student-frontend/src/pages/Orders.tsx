import React from 'react';
import { Search, Filter, Download, MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import './Orders.css';

const orders = [
  { id: '#QP-9281', date: 'Oct 24, 2023', total: '$18.50', status: 'picked_up' },
  { id: '#QP-9304', date: 'Oct 26, 2023', total: '$12.00', status: 'picked_up' },
  { id: '#QP-9412', date: 'Oct 28, 2023', total: '$9.25', status: 'picked_up' },
  { id: '#QP-9521', date: 'Nov 01, 2023', total: '$24.50', status: 'ready' },
  { id: '#QP-9588', date: 'Nov 02, 2023', total: '$10.50', status: 'pending' },
];

const Orders: React.FC = () => {
  return (
    <div className="orders-page">
      <div className="orders-header">
        <div className="header-titles">
          <h1>Order History</h1>
          <p>Track and manage your campus meals.</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline"><Download size={18} /> Export</button>
          <button className="btn-primary">New Order</button>
        </div>
      </div>

      <div className="card orders-card">
        <div className="table-controls">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search orders..." />
          </div>
          <button className="btn-icon-outline"><Filter size={18} /></button>
        </div>

        <div className="table-responsive">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <motion.tr 
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="order-id">{order.id}</td>
                  <td className="order-date">{order.date}</td>
                  <td className="order-total">{order.total}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="text-right">
                    <button className="btn-icon-ghost"><MoreHorizontal size={18} /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
