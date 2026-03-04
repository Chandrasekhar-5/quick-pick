import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  ChevronLeft, 
  Phone, 
  MessageSquare, 
  AlertCircle,
  QrCode,
  ShoppingBag,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './OrderTracking.css';

const OrderTracking: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useApp();
  
  const order = orders.find(o => o.id === orderId);
  const [timeLeft, setTimeLeft] = useState(15); // Mock 15 mins

  useEffect(() => {
    if (!order) return;

    // Mock status progression
    const timer = setInterval(() => {
      if (order.status === 'Confirmed') {
        updateOrderStatus(order.id, 'Preparing');
      } else if (order.status === 'Preparing' && timeLeft <= 10) {
        updateOrderStatus(order.id, 'Ready');
      }
    }, 5000);

    const countdown = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 60000);

    return () => {
      clearInterval(timer);
      clearInterval(countdown);
    };
  }, [order, timeLeft, updateOrderStatus]);

  if (!order) {
    return (
      <div className="container order-not-found">
        <AlertCircle size={60} color="#e53935" />
        <h2>Order Not Found</h2>
        <p>We couldn't find the order you're looking for.</p>
        <button className="btn-primary" onClick={() => navigate('/dashboard')}>
          GO TO DASHBOARD
        </button>
      </div>
    );
  }

  const steps = [
    { status: 'Confirmed', label: 'Order Confirmed', icon: <CheckCircle size={20} /> },
    { status: 'Preparing', label: 'Preparing Food', icon: <Clock size={20} /> },
    { status: 'Ready', label: 'Ready for Pickup', icon: <ShoppingBag size={20} /> },
    { status: 'Picked Up', label: 'Picked Up', icon: <CheckCircle size={20} /> },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.status);

  return (
    <div className="order-tracking-page container">
      <div className="tracking-header">
        <button className="back-btn" onClick={() => navigate('/orders')}>
          <ChevronLeft size={20} />
          <span>Back to Orders</span>
        </button>
        <div className="order-id-badge">
          Order #{order.id}
        </div>
      </div>

      <div className="tracking-layout">
        <div className="tracking-main">
          <div className="card status-card">
            <div className="status-header">
              <div className="status-text">
                <h2>{order.status === 'Ready' ? 'Your food is ready!' : order.status === 'Picked Up' ? 'Enjoy your meal!' : 'Preparing your order'}</h2>
                {order.status !== 'Picked Up' && <p>Estimated pickup in {timeLeft} mins</p>}
              </div>
              <div className="status-animation">
                <div className={`pulse-circle ${order.status === 'Ready' ? 'ready' : order.status === 'Picked Up' ? 'done' : ''}`}></div>
              </div>
            </div>

            <div className="tracking-timeline">
              {steps.map((step, index) => (
                <div 
                  key={step.status} 
                  className={`timeline-step ${index <= currentStepIndex ? 'active' : ''} ${index === currentStepIndex ? 'current' : ''}`}
                >
                  <div className="step-icon">
                    {step.icon}
                  </div>
                  <div className="step-label">{step.label}</div>
                  {index < steps.length - 1 && <div className="step-line"></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="card order-details-card">
            <h3>Order Summary</h3>
            <div className="shop-mini-info">
              <img src="https://picsum.photos/seed/shop/100/100" alt={order.shopName} referrerPolicy="no-referrer" />
              <div className="text">
                <h4>{order.shopName}</h4>
                <p>Pickup Slot: {order.pickupSlot}</p>
              </div>
            </div>
            <div className="items-list">
              {order.items.map(item => (
                <div key={item.id} className="item-row">
                  <span>{item.quantity} x {item.name}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="total-row">
              <span>Total Paid</span>
              <strong>₹{order.total}</strong>
            </div>
          </div>
        </div>

        <aside className="tracking-sidebar">
          {order.status === 'Ready' ? (
            <div className="card qr-card active">
              <div className="qr-header">
                <QrCode size={24} />
                <h3>Pickup QR Code</h3>
              </div>
              <p>Show this QR code at the counter to collect your order.</p>
              <div className="qr-container">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ORDER_${order.id}_USER_${order.studentId}`} 
                  alt="Pickup QR" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <button className="btn-primary scan-btn" onClick={() => updateOrderStatus(order.id, 'Picked Up')}>
                SIMULATE SCAN
              </button>
            </div>
          ) : order.status === 'Picked Up' ? (
            <div className="card qr-card done">
              <CheckCircle size={48} color="#60b246" />
              <h3>Order Collected</h3>
              <p>Your order has been successfully picked up. Thank you for using QuickPick!</p>
              <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
                BACK TO HOME
              </button>
            </div>
          ) : (
            <div className="card qr-card disabled">
              <QrCode size={40} opacity={0.3} />
              <h3>QR Code Pending</h3>
              <p>Your QR code will be generated once the food is ready.</p>
            </div>
          )}

          <div className="card help-card">
            <h3>Need Help?</h3>
            <div className="help-actions">
              <button className="help-btn">
                <Phone size={18} />
                <span>Call Shop</span>
              </button>
              <button className="help-btn">
                <MessageSquare size={18} />
                <span>Chat with Support</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrderTracking;
