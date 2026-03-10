import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Search, TrendingUp, Users, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import API from '../services/api';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { location, addToCart } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemId, setAddedItemId] = useState<string | null>(null);
  
  // Real database states
  const[realShops, setRealShops] = useState<any[]>([]);
  const [trendingItems, setTrendingItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Shops and Trending Items simultaneously
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [vendorsRes, trendingRes] = await Promise.all([
          API.get('/vendors'),
          API.get('/menu/campus/trending') // NEW API CALL!
        ]);
        
        // ADAPTER: Map the shops
        const mappedShops = vendorsRes.data.map((vendor: any) => ({
          id: vendor._id,
          name: vendor.name,
          description: vendor.description || 'Delicious food served hot.',
          isOpen: vendor.isOpen,
          location: 'Main Campus',
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600",
          crowdLevel: "Low",
          rating: 4.5,
          popularItems: ["Snacks", "Beverages"],
          prepTime: "10-15 min"
        }));

        // ADAPTER: Map the trending items
        const mappedTrending = trendingRes.data.map((item: any) => ({
          id: item._id,
          name: item.name,
          price: item.price,
          shopId: item.vendorId?._id || '', // Safely get populated shop ID
          shopName: item.vendorId?.name || 'Campus Shop', // Get shop name
          image: item.image,
          rating: 4.8,
          isVeg: item.isVeg
        }));

        setRealShops(mappedShops);
        setTrendingItems(mappedTrending);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  },[]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}><h2>Loading Campus Shops...</h2></div>;
  }

  return (
    <div className="home-page">
      <section className="hero-banner">
        <div className="container">
          <div className="hero-content">
            <h1>QuickPick Campus</h1>
            <p>Pre-order from your favorite campus shops and skip the queue!</p>
            <form className="search-container" onSubmit={handleSearch}>
              <Search size={20} />
              <input 
                type="text" 
                placeholder="Search for food or shops..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">Search</button>
            </form>
          </div>
        </div>
      </section>

      {/* Only show trending section if we actually have items */}
      {trendingItems.length > 0 && (
        <section className="trending-section container">
          <div className="section-header">
            <div className="title-with-icon">
              <TrendingUp size={24} color="#FC8019" />
              <h2>Trending in Your Campus</h2>
            </div>
            <p>Top sold items this week</p>
          </div>
          <div className="trending-carousel">
            <div className="carousel-track">
              {/* Duplicated for smooth infinite scroll effect (if your CSS does that) */}
              {[...trendingItems, ...trendingItems].map((item, index) => (
                <div key={`${item.id}-${index}`} className="trending-card card">
                  <div className="trending-img-container" onClick={() => navigate(`/menu/${item.shopId}`)}>
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="trending-info">
                    <div className="text" onClick={() => navigate(`/menu/${item.shopId}`)}>
                      <h4>{item.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#666', margin: '2px 0' }}>{item.shopName}</p>
                      <div className="trending-meta">
                        <span className="price">₹{item.price}</span>
                        <span className="rating"><Star size={12} fill="#48c479" color="#48c479" /> {item.rating}</span>
                      </div>
                    </div>
                    <button 
                      className={`add-mini-btn ${addedItemId === item.id ? 'added' : ''}`} 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item, item.shopId);
                        setAddedItemId(item.id);
                        setTimeout(() => setAddedItemId(null), 2000);
                      }}
                    >
                      {addedItemId === item.id ? 'ADDED' : 'ADD'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="shops-section container">
        <div className="section-header">
          <h2>Campus Shops</h2>
          <div className="filters">
            <button className="filter-chip active">Ratings 4.0+</button>
            <button className="filter-chip">Fastest Delivery</button>
            <button className="filter-chip">Offers</button>
          </div>
        </div>

        <div className="shops-grid grid-3">
          {realShops.length > 0 ? (
            realShops.map(shop => (
              <div 
                key={shop.id} 
                className="shop-card card"
                onClick={() => navigate(`/menu/${shop.id}`)}
              >
                <div className="shop-image">
                  <img src={shop.image} alt={shop.name} referrerPolicy="no-referrer" />
                  {!shop.isOpen && <div className="closed-overlay">Closed</div>}
                  <div className="crowd-badge" data-level={shop.crowdLevel}>
                    <Users size={12} />
                    <span>{shop.crowdLevel} Crowd</span>
                  </div>
                </div>
                <div className="shop-details">
                  <div className="shop-header-row">
                    <h3>{shop.name}</h3>
                    <div className="rating-box">
                      <Star size={14} fill="currentColor" />
                      <span>{shop.rating}</span>
                    </div>
                  </div>
                  <p className="shop-desc">{shop.description}</p>
                  
                  <div className="popular-items">
                    <span className="label">Popular:</span>
                    <div className="tags">
                      {shop.popularItems.map((item: string) => <span key={item} className="tag">{item}</span>)}
                    </div>
                  </div>

                  <div className="shop-footer">
                    <div className="time-box">
                      <Clock size={14} />
                      <span>{shop.prepTime}</span>
                    </div>
                    <button className="view-menu-btn">
                      View Menu <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-shops">
              <p>No shops found on your campus yet.</p>
            </div>
          )}
        </div>
      </section>

      <section className="other-shops container">
        <div className="section-header">
          <h2>All Campus Shops</h2>
          <p>Explore shops across all campus buildings</p>
        </div>
        <div className="shops-scroll">
          {realShops.map(shop => (
            <div 
              key={shop.id} 
              className="shop-card-mini card"
              onClick={() => navigate(`/menu/${shop.id}`)}
            >
              <img src={shop.image} alt={shop.name} referrerPolicy="no-referrer" />
              <div className="mini-info">
                <h4>{shop.name}</h4>
                <div className="mini-meta">
                  <span className="loc">{shop.location}</span>
                  <span className="dot">•</span>
                  <span className="rating"><Star size={12} fill="currentColor" /> {shop.rating}</span>
                </div>
                <div className="mini-footer">
                  <span className="crowd">{shop.crowdLevel} Crowd</span>
                  <ChevronRight size={16} color="var(--primary)" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;