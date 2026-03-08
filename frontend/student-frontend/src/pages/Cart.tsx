import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Clock, MapPin, CreditCard, Wallet as WalletIcon, 
  ChevronRight, Plus, Minus, AlertCircle, TrendingUp, CheckCircle, Shield, Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { slots } from '../data/slots';
import API from '../services/api'; 
import './Cart.css';

const Cart: React.FC = () => {
  const { 
    cart, updateQuantity, user, currentShopId, placeOrder, deductFunds, clearCart, addToCart 
  } = useApp();
  const navigate = useNavigate();
  
  const[selectedSlot, setSelectedSlot] = useState(slots[0].time);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'cash'>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // NEW: State to hold the REAL shop details from the backend
  const[realShop, setRealShop] = useState({
    name: "Loading Shop...",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600",
    location: "Main Campus"
  });

  // NEW: Fetch the real shop name when Cart loads
  useEffect(() => {
    const fetchRealShop = async () => {
      if (currentShopId) {
        try {
          const res = await API.get('/vendors');
          const foundShop = res.data.find((v: any) => v._id === currentShopId);
          if (foundShop) {
            setRealShop(prev => ({ ...prev, name: foundShop.name }));
          }
        } catch (err) {
          console.error("Could not load shop details");
        }
      }
    };
    fetchRealShop();
  }, [currentShopId]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const suggestions =[
    { id: 'mock-1', name: 'Extra Ketchup & Tissues', price: 5, isVeg: true },
    { id: 'mock-2', name: 'Cold Drink (250ml)', price: 40, isVeg: true },
    { id: 'mock-3', name: 'Chocolate Brownie', price: 60, isVeg: true }
  ].filter(item => !cart.find(c => c.name === item.name));

  const handlePlaceOrder = async () => {
  if (!user) return navigate('/');
  if (paymentMethod === 'wallet' && user.walletBalance < total) {
    setError('Insufficient wallet balance. Please add funds.');
    return;
  }

  setIsProcessing(true);
  setError('');

  try {
    const backendItems = cart.map(item => {
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(item.id.toString());
      
      if (!isValidObjectId) {
        console.warn(`Item ${item.id} is not a valid ObjectId. Make sure your cart items have real MongoDB IDs.`);
      }
      
      return {
        menuItem: item.id,
        quantity: item.quantity
      };
    });

    const response = await API.post('/orders', {
      vendorId: currentShopId,
      items: backendItems,
    });

    console.log("Real Order Created in DB!", response.data);

    if (paymentMethod === 'wallet') deductFunds(total);

    const orderId = placeOrder(response.data);

    setIsSuccess(true);
    clearCart();
    setIsProcessing(false);
    
    setTimeout(() => {
      navigate(`/order-tracking/${orderId}`);
    }, 2000);

  } catch (err: any) {
    console.error("Failed to place order:", err);
    setError(err.response?.data?.message || 'Failed to place order with backend.');
    setIsProcessing(false);
  }
};

  if (cart.length === 0) {
    return (
      <div className="cart-page container empty-cart">
        <div className="empty-cart-content card">
          <ShoppingBag size={80} color="#e9e9eb" />
          <h2>Your cart is empty</h2>
          <p>Good food is always cooking! Go ahead, order some yummy items from the menu.</p>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>
            SEE SHOPS NEAR YOU
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <div className="cart-layout">
        <div className="cart-main">
          <div className="card cart-items-card">
            <div className="cart-shop-header">
              <img src={realShop.image} alt={realShop.name} referrerPolicy="no-referrer" />
              <div className="shop-info">
                <h3>{realShop.name}</h3>
                <p>{realShop.location}</p>
              </div>
            </div>
            
            <div className="cart-items-list">
              {cart.map(item => (
                <div key={item.id} className="cart-item-row">
                  <div className="item-name-box">
                    <div className="veg-icon" data-veg={(item as any).isVeg}></div>
                    <span>{item.name}</span>
                  </div>
                  <div className="item-controls">
                    <div className="qty-selector">
                      <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                    </div>
                    <span className="item-price">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            {suggestions.length > 0 && (
              <div className="cart-suggestions">
                <div className="suggestion-header">
                  <TrendingUp size={16} color="var(--primary)" />
                  <h4>Students also ordered</h4>
                </div>
                <div className="suggestion-list">
                  {suggestions.map(item => (
                    <div key={item.id} className="suggestion-item">
                      <div className="suggestion-info">
                        <h5>{item.name}</h5>
                        <span>₹{item.price}</span>
                      </div>
                      <button className="add-mini-btn" onClick={() => addToCart(item as any, currentShopId!)}>
                        ADD
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card slot-section">
            <div className="section-title">
              <Clock size={20} />
              <h3>Select Pickup Slot</h3>
            </div>
            <div className="slots-grid">
              {slots.map(slot => (
                <button 
                  key={slot.time}
                  className={`slot-btn ${selectedSlot === slot.time ? 'active' : ''} ${slot.current >= slot.capacity ? 'full' : ''}`}
                  onClick={() => slot.current < slot.capacity && setSelectedSlot(slot.time)}
                  disabled={slot.current >= slot.capacity}
                >
                  <span className="time">{slot.time}</span>
                  <span className="capacity">{slot.capacity - slot.current} slots left</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card payment-section">
            <div className="section-title">
              <CreditCard size={20} />
              <h3>Payment Method</h3>
            </div>
            <div className="payment-options">
              <button 
                className={`payment-btn ${paymentMethod === 'wallet' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('wallet')}
              >
                <div className="payment-info">
                  <WalletIcon size={20} />
                  <div className="text">
                    <strong>QuickPick Wallet</strong>
                    <span>Balance: ₹{user?.walletBalance.toFixed(2)}</span>
                  </div>
                </div>
                {paymentMethod === 'wallet' && <CheckCircle size={20} color="#60b246" />}
              </button>
              <button 
                className={`payment-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <div className="payment-info">
                  <MapPin size={20} />
                  <div className="text">
                    <strong>Pay at Counter</strong>
                    <span>Cash or UPI at shop</span>
                  </div>
                </div>
                {paymentMethod === 'cash' && <CheckCircle size={20} color="#60b246" />}
              </button>
            </div>
          </div>
        </div>

        <aside className="cart-sidebar">
          <div className="card bill-card">
            <h3>Bill Details</h3>
            <div className="bill-row">
              <span>Item Total</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="bill-row">
              <span>GST & Restaurant Charges</span>
              <span>₹{tax}</span>
            </div>
            <div className="bill-divider"></div>
            <div className="bill-row total">
              <span>TO PAY</span>
              <span>₹{total}</span>
            </div>

            {error && (
              <div className="cart-error" style={{ color: 'red', marginTop: '10px' }}>
                <AlertCircle size={16} />
                <span style={{ marginLeft: '5px' }}>{error}</span>
              </div>
            )}

            <button 
              className="btn-primary place-order-btn" 
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
              {isProcessing ? 'PROCESSING...' : 'PLACE ORDER'}
            </button>
            
            <div className="reward-info">
              <Star size={14} fill="currentColor" />
              <span>You'll earn {Math.floor(total * 0.02)} Reward Points!</span>
            </div>
          </div>

          <div className="card safety-card">
            <div className="safety-header">
              <Shield size={20} />
              <h4>QuickPick Safety Guarantee</h4>
            </div>
            <p>We ensure your food is prepared with the highest hygiene standards.</p>
          </div>
        </aside>
      </div>
      {isSuccess && (
        <div className="success-overlay">
          <div className="success-card card">
            <div className="success-icon">
              <CheckCircle size={60} color="#60b246" />
            </div>
            <h2>Order Placed Successfully!</h2>
            <p>Your order has been confirmed. Redirecting to tracking...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;