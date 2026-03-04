import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Search, TrendingUp, Users, ChevronRight } from 'lucide-react';
import { shops } from '../data/shops';
import { menuData } from '../data/menuData';
import { useApp } from '../context/AppContext';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { location, cart } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShops = shops.filter(shop => shop.location === location);

  // Get trending items across all shops
  const allItems: any[] = [];
  Object.entries(menuData).forEach(([shopId, items]) => {
    items.forEach((item: any) => {
      allItems.push({ ...item, shopId: Number(shopId) });
    });
  });
  const trendingItems = allItems.slice(0, 8); // Mock trending

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

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
            {[...trendingItems, ...trendingItems].map((item, index) => (
              <div key={`${item.id}-${index}`} className="trending-card card" onClick={() => navigate(`/menu/${item.shopId}`)}>
                <img src={item.image} alt={item.name} />
                <div className="trending-info">
                  <h4>{item.name}</h4>
                  <span className="price">₹{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shops-section container">
        <div className="section-header">
          <h2>Campus Shops in {location}</h2>
          <div className="filters">
            <button className="filter-chip active">Ratings 4.0+</button>
            <button className="filter-chip">Fastest Delivery</button>
            <button className="filter-chip">Offers</button>
          </div>
        </div>

        <div className="shops-grid grid-3">
          {filteredShops.length > 0 ? (
            filteredShops.map(shop => (
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
                      {shop.popularItems.map(item => <span key={item} className="tag">{item}</span>)}
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
              <p>No shops found in this location. Try changing your building.</p>
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
          {shops.map(shop => (
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
