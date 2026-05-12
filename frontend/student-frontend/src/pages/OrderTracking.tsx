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
  X,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './OrderTracking.css';
import API from '../services/api';

interface Vendor {
  _id: string;
  name: string;
  logo: string;
  phone?: string;
}

const OrderTracking: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, cancelOrder, user } = useApp();

  const order = orders.find(o => o.id === orderId);

  const [dbOrder, setDbOrder] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'vendor', text: 'Hello! We are preparing your order.', time: 'Just now' }
  ]);
  const [vendorLogo, setVendorLogo] = useState<string>('');
  const [vendorPhone, setVendorPhone] = useState<string>('');
  const [loadingVendor, setLoadingVendor] = useState(true);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      if (!order?.shopName) return;
      
      try {
        const res = await API.get('/vendors');
        const vendor = res.data.find((v: Vendor) => v.name === order.shopName);
        
        if (vendor) {
          setVendorLogo(vendor.logo || "https://picsum.photos/seed/shop/100/100");
          setVendorPhone(vendor.phone || dbOrder?.shopPhone || '9876543210');
        } else {
          setVendorLogo("https://picsum.photos/seed/shop/100/100");
          setVendorPhone(dbOrder?.shopPhone || '9876543210');
        }
      } catch (error) {
        console.error("Failed to fetch vendor details:", error);
        setVendorLogo("https://picsum.photos/seed/shop/100/100");
        setVendorPhone(dbOrder?.shopPhone || '9876543210');
      } finally {
        setLoadingVendor(false);
      }
    };

    fetchVendorDetails();
  }, [order?.shopName, dbOrder?.shopPhone]);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/single/${orderId}`);
        const data = res.data;

        setDbOrder(data);

        if (data.status !== order?.status) {
          updateOrderStatus(orderId, data.status.toLowerCase());
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
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(order.id);
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

      {/* HEADER */}
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

        {/* MAIN */}
        <div className="tracking-main">

          {/* STATUS CARD */}
          <div className="card status-card">
            <div className="status-header">
              <div className="status-text">
                <h2>
                  {order.status === 'ready' ? 'Your food is ready!' : 
                   order.status === 'completed' ? 'Enjoy your meal!' : 
                   order.status === 'cancelled' ? 'Order Cancelled' :
                   'Preparing your order'}
                </h2>

                {order.status !== 'completed' && order.status !== 'cancelled' &&
                  <p>Estimated pickup in {timeLeft} mins</p>
                }

                {order.status === 'cancelled' &&
                  <p className="cancelled-text">
                    Your refund of ₹{order.total} has been processed.
                  </p>
                }
              </div>

              <div className="status-animation">
                <div className={`pulse-circle 
                  ${order.status === 'ready' ? 'ready' : ''} 
                  ${order.status === 'completed' ? 'done' : ''} 
                  ${order.status === 'cancelled' ? 'cancelled' : ''}`}
                ></div>
              </div>
            </div>

            {order.status !== 'cancelled' ? (
              <div className="tracking-timeline">
                {steps.map((step, index) => (
                  <div 
                    key={step.status} 
                    className={`timeline-step 
                      ${index <= currentStepIndex ? 'active' : ''} 
                      ${index === currentStepIndex ? 'current' : ''}`}
                  >
                    <div className="step-icon">{step.icon}</div>
                    <div className="step-label">{step.label}</div>
                    {index < steps.length - 1 && <div className="step-line"></div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="cancelled-notice">
                <AlertCircle size={24} />
                <span>Order cancelled</span>
              </div>
            )}
          </div>

          {/* ORDER DETAILS */}
          <div className="card order-details-card">
            <h3>Order Summary</h3>

            <div className="shop-mini-info">
              <img 
                src={vendorLogo || "https://picsum.photos/seed/shop/100/100"} 
                alt={order.shopName} 
                referrerPolicy="no-referrer"
              />
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

        {/* SIDEBAR */}
        <aside className="tracking-sidebar">

          {(order.status === 'confirmed' || order.status === 'preparing') && (
            <div className="card cancel-order-card">
              <h3>Change of plans?</h3>
              <p>You can cancel before it's ready.</p>
              <button className="btn-outline-danger" onClick={handleCancel}>
                CANCEL ORDER
              </button>
            </div>
          )}

          {/* QR */}
          <div className="card qr-card">
            <div className="qr-header">
              <QrCode size={24} />
              <h3>Pickup QR</h3>
            </div>

            <div className="qr-container">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=STUDENT_${order.studentId || user?.studentId}`} 
                alt="QR" 
              />
            </div>
          </div>

          {/* HELP */}
          <div className="card help-card">
            <h3>Need Help?</h3>

            <div className="help-actions">
              <a 
                href={`tel:${vendorPhone || '9876543210'}`} 
                className="help-btn"
              >
                <Phone size={18} />
                <span>Call Shop</span>
              </a>

              <button className="help-btn" onClick={() => setShowChat(true)}>
                <MessageSquare size={18} />
                <span>Chat</span>
              </button>
            </div>
          </div>

        </aside>
      </div>

      {/* CHAT */}
      {showChat && (
        <div className="chat-modal-overlay" onClick={() => setShowChat(false)}>
          <div className="chat-modal card" onClick={e => e.stopPropagation()}>

            <div className="chat-header">
              <h4>{order.shopName}</h4>
              <button onClick={() => setShowChat(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="chat-body">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.sender}`}>
                  <div>{msg.text}</div>
                </div>
              ))}
            </div>

            <form className="chat-footer" onSubmit={(e) => {
              e.preventDefault();
              if (!chatMessage.trim()) return;

              setChatHistory([...chatHistory, {
                sender: 'user',
                text: chatMessage,
                time: 'now'
              }]);

              setChatMessage('');
            }}>
              <input 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type message..."
              />
              <button type="submit">
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