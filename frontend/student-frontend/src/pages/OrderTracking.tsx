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
  Users,
  X,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { shops } from '../data/shops';
import './OrderTracking.css';
import API from '../services/api';

const OrderTracking: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, cancelOrder, user } = useApp();

  console.log("Order ID:", orderId);
  
  const order = orders.find(o => o.id === orderId);
  const shop = shops.find(s => s.name === order?.shopName);
  const [timeLeft, setTimeLeft] = useState(15); 
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'vendor', text: 'Hello! We are preparing your order.', time: 'Just now' }
  ]);

  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrder = async () => {
        try {
            const res = await API.get(`/orders/single/${orderId}`);
            const dbOrder = res.data;
            
            if (dbOrder.status !== order?.status) {
                updateOrderStatus(orderId, dbOrder.status.toLowerCase());
            }
        } catch (err) {
            console.error("Failed to fetch order:", err);
        }
    };
    
    fetchOrder();
    
    const interval = setInterval(fetchOrder, 5000);
    
    return () => clearInterval(interval);
}, [orderId, order?.status, updateOrderStatus]);

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

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this order? Change of plans?')) {
      cancelOrder(order.id);
      // We don't need to navigate away, the UI will update to the cancelled state
    }
  };

  const steps = [
    { status: 'pending', label: 'Order Confirmed', icon: <CheckCircle size={20} /> },
    { status: 'preparing', label: 'Preparing Food', icon: <Clock size={20} /> },
    { status: 'ready', label: 'Ready for Pickup', icon: <ShoppingBag size={20} /> },
    { status: 'completed', label: 'Picked Up', icon: <CheckCircle size={20} /> },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order?.status?.toLowerCase());

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
                <h2>
                  {order.status === 'ready' ? 'Your food is ready!' : 
                   order.status === 'picked_up' ? 'Enjoy your meal!' : 
                   order.status === 'cancelled' ? 'Order Cancelled' :
                   'Preparing your order'}
                </h2>
                {order.status !== 'picked_up' && order.status !== 'cancelled' && <p>Estimated pickup in {timeLeft} mins</p>}
                {order.status === 'cancelled' && <p className="cancelled-text">Your refund of ₹{order.total} has been processed to your wallet.</p>}
              </div>
              <div className="status-animation">
                <div className={`pulse-circle ${order.status === 'ready' ? 'ready' : order.status === 'picked_up' ? 'done' : order.status === 'cancelled' ? 'cancelled' : ''}`}></div>
              </div>
            </div>

            {order.status !== 'cancelled' ? (
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
            ) : (
              <div className="cancelled-notice">
                <AlertCircle size={24} />
                <span>This order was cancelled on {new Date().toLocaleDateString()}</span>
              </div>
            )}
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
          {(order.status === 'confirmed' || order.status === 'preparing') && (
            <div className="card cancel-order-card">
              <h3>Change of plans?</h3>
              <p>You can cancel your order before it's ready for pickup.</p>
              <button 
                className="btn-outline-danger" 
                onClick={handleCancel}
              >
                CANCEL ORDER
              </button>
            </div>
          )}

          {order.status === 'ready' ? (
            <div className="card qr-card active">
              <div className="qr-header">
                <QrCode size={24} />
                <h3>Pickup QR Code</h3>
              </div>
              <p>Show this QR code at the counter to collect your order.</p>
              <div className="qr-container">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=STUDENT_${order.studentId || user?.studentId}`} 
                  alt="Pickup QR" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <button className="btn-primary scan-btn" onClick={() => updateOrderStatus(order.id, 'picked_up')}>
                SIMULATE SCAN
              </button>
            </div>
          ) : order.status === 'picked_up' ? (
            <div className="card qr-card done">
              <CheckCircle size={48} color="#60b246" />
              <h3>Order Collected</h3>
              <p>Your order has been successfully picked up. Thank you for using QuickPick!</p>
              <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
                BACK TO HOME
              </button>
            </div>
          ) : order.status === 'cancelled' ? (
            <div className="card qr-card cancelled">
              <AlertCircle size={48} color="#e53935" />
              <h3>Order Cancelled</h3>
              <p>This order has been cancelled and a refund has been issued to your wallet.</p>
              <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
                BACK TO HOME
              </button>
            </div>
          ) : (
            <div className="card qr-card pending">
              <div className="qr-header">
                <QrCode size={24} />
                <h3>Pickup ID (Pending)</h3>
              </div>
              <p>Your Student ID QR will be used for pickup. Food is currently being prepared.</p>
              <div className="qr-container grayscale">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=STUDENT_${order.studentId || user?.studentId}`} 
                  alt="Pickup QR" 
                  referrerPolicy="no-referrer"
                />
                <div className="qr-overlay">
                  <Clock size={32} />
                  <span>PREPARING</span>
                </div>
              </div>
            </div>
          )}

          <div className="card help-card">
            <h3>Need Help?</h3>
            <div className="help-actions">
              <a href={`tel:${shop?.phone || '9876543210'}`} className="help-btn">
                <Phone size={18} />
                <span>Call Shop</span>
              </a>
              <button className="help-btn" onClick={() => setShowChat(true)}>
                <MessageSquare size={18} />
                <span>Chat with Vendor</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {showChat && (
        <div className="chat-modal-overlay" onClick={() => setShowChat(false)}>
          <div className="chat-modal card" onClick={e => e.stopPropagation()}>
            <div className="chat-header">
              <div className="vendor-info">
                <div className="vendor-avatar">
                  {order.shopName.charAt(0)}
                </div>
                <div>
                  <h4>{order.shopName}</h4>
                  <p className="status-online">Online</p>
                </div>
              </div>
              <button className="close-chat" onClick={() => setShowChat(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="chat-body">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`chat-msg ${msg.sender}`}>
                  <div className="msg-bubble">{msg.text}</div>
                  <span className="msg-time">{msg.time}</span>
                </div>
              ))}
            </div>
            <form className="chat-footer" onSubmit={(e) => {
              e.preventDefault();
              if (chatMessage.trim()) {
                setChatHistory([...chatHistory, { sender: 'user', text: chatMessage, time: 'Just now' }]);
                setChatMessage('');
                // Mock vendor reply
                setTimeout(() => {
                  setChatHistory(prev => [...prev, { sender: 'vendor', text: 'Sure, we will take care of that!', time: 'Just now' }]);
                }, 1500);
              }
            }}>
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <button type="submit" className="send-btn">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
