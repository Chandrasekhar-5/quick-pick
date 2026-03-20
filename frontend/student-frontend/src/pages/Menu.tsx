import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Search, ChevronRight, ShoppingBag, Plus, Minus, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import API from '../services/api';
import './Menu.css';

const Menu: React.FC = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, updateQuantity } = useApp();
  
  const [shop, setShop] = useState<any>(null);
  const[menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMenu, setFilteredMenu] = useState<any[]>([]);
  
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const fetchShopAndMenu = async () => {
      try {
        const[vendorsRes, menuRes] = await Promise.all([
          API.get('/vendors'),
          API.get(`/menu/${shopId}`)
        ]);

        const currentShop = vendorsRes.data.find((v: any) => v._id === shopId);
        
        if (currentShop) {
          setShop({
            id: currentShop._id,
            name: currentShop.name,
            description: currentShop.description || 'Delicious food served hot.',
            rating: 4.5,
            prepTime: "10-15 min",
            location: "Main Campus",
            crowdLevel: "Low",
            categories:["All"]
          });
        }

        const mappedMenu = menuRes.data.map((item: any) => ({
          id: item._id,
          name: item.name,
          price: item.price,
          description: item.description || '',
          isVeg: item.isVeg,
          available: item.isAvailable,
          category: item.category ||"Snacks",
          image: item.image,
        }));

        setMenuItems(mappedMenu);
        setFilteredMenu(mappedMenu);

        const uniqueCategories = ['All', ...new Set(mappedMenu.map(item => item.category))];
        setShop(prev => ({ ...prev, categories: uniqueCategories }));

      } catch (error) {
        console.error("Failed to fetch menu:", error);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchShopAndMenu();
    }
  }, [shopId]);

  useEffect(() => {
    let filtered = menuItems;
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeCategory !== 'All') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    setFilteredMenu(filtered);
  }, [searchQuery, activeCategory, menuItems]);

  if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}><h2>Loading Menu...</h2></div>;
  if (!shop) return <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}><h2>Shop not found</h2></div>;

  const getItemQuantity = (id: string) => {
    return cart.find(i => i.id === (id as any))?.quantity || 0;
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="menu-page">
      <div className="shop-banner-section">
        <div className="container">
          <div className="shop-banner-card card">
            <div className="shop-banner-info">
              <div className="shop-main-details">
                <h1>{shop.name}</h1>
                <p>{shop.description}</p>
                <div className="shop-meta-row">
                  <div className="rating-badge">
                    <Star size={14} fill="currentColor" />
                    <span>{shop.rating}</span>
                  </div>
                  <span className="dot">•</span>
                  <div className="time-badge">
                    <Clock size={14} />
                    <span>{shop.prepTime}</span>
                  </div>
                  <span className="dot">•</span>
                  <div className="location-badge">{shop.location}</div>
                </div>
              </div>
              <div className="shop-badges">
                <div className="crowd-indicator" data-level={shop.crowdLevel}>
                  <Users size={14} />
                  <span>{shop.crowdLevel} Crowd</span>
                </div>
              </div>
            </div>
            
            <div className="shop-search-bar">
              <Search size={18} />
              <input 
                type="text" 
                placeholder={`Search in ${shop.name}...`} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="menu-content container">
        <aside className="category-sidebar">
          {['All', ...shop.categories].map(cat => (
            <button 
              key={cat}
              className={`cat-link ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </aside>

        <main className="menu-main">
          {filteredMenu.length === 0 ? (
            <div className="no-menu-results">
              <Search size={48} />
              <h3>No items found</h3>
              <p>Try searching for something else or browse the categories.</p>
            </div>
          ) : (
            <div className="items-grid">
              {filteredMenu.map(item => (
                <div key={item.id} className={`menu-item-card card ${!item.available ? 'unavailable' : ''}`}>
                  <div className="item-details">
                    <div className="veg-icon" data-veg={item.isVeg}></div>
                    <h3>{item.name}</h3>
                    <p className="item-price">₹{item.price}</p>
                    <p className="item-desc">{item.description}</p>
                  </div>
                  <div className="item-action-box">
                    <div className="item-image-wrapper">
                      <img src={item.image} alt={item.name} referrerPolicy="no-referrer" />
                      {!item.available && <div className="out-of-stock">Out of Stock</div>}
                    </div>
                    <div className="add-btn-container">
                      {getItemQuantity(item.id) > 0 ? (
                        <div className="qty-selector">
                          <button onClick={() => updateQuantity(item.id as any, -1)}><Minus size={14} /></button>
                          <span>{getItemQuantity(item.id)}</span>
                          <button onClick={() => updateQuantity(item.id as any, 1)}><Plus size={14} /></button>
                        </div>
                      ) : (
                        <button 
                          className="add-btn" 
                          onClick={() => addToCart(item as any, shop.id as any)}
                          disabled={!item.available}
                        >
                          {item.available ? 'ADD' : 'OUT OF STOCK'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {cartCount > 0 && (
          <aside className="cart-sidebar-desktop">
            <div className="card cart-summary-card">
              <h3>Cart</h3>
              <p className="text-muted">{cartCount} Items</p>
              <div className="cart-items-preview">
                {cart.map(item => (
                  <div key={item.id} className="preview-row">
                    <div className="preview-name">
                      <div className="veg-icon mini" data-veg={item.isVeg}></div>
                      <span>{item.name}</span>
                    </div>
                    <div className="preview-qty-price">
                      <div className="mini-qty">
                        <button onClick={() => updateQuantity(item.id as any, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id as any, 1)}>+</button>
                      </div>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-total-row">
                <span>Subtotal</span>
                <strong>₹{cartTotal}</strong>
              </div>
              <button className="btn-primary checkout-btn" onClick={() => navigate('/cart')}>
                CHECKOUT <ChevronRight size={18} />
              </button>
            </div>
          </aside>
        )}
      </div>

      {cartCount > 0 && (
        <div className="mobile-cart-bar" onClick={() => navigate('/cart')}>
          <div className="cart-bar-info">
            <ShoppingBag size={20} />
            <span>{cartCount} Items | ₹{cartTotal}</span>
          </div>
          <div className="view-cart-btn">
            <span>VIEW CART</span>
            <ChevronRight size={18} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
