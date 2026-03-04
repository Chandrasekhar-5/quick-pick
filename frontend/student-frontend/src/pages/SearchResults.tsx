import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Star, Clock, ChevronRight } from 'lucide-react';
import { shops } from '../data/shops';
import { menuData } from '../data/menuData';
import { useApp } from '../context/AppContext';
import './SearchResults.css';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, cart, updateQuantity } = useApp();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<{ shops: any[], items: any[] }>({ shops: [], items: [] });

  useEffect(() => {
    if (!query.trim()) {
      setResults({ shops: [], items: [] });
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    const matchedShops = shops.filter(shop => 
      shop.name.toLowerCase().includes(lowerQuery) || 
      shop.description.toLowerCase().includes(lowerQuery)
    );

    const allItems: any[] = [];
    Object.entries(menuData).forEach(([shopId, items]) => {
      const shop = shops.find(s => s.id === Number(shopId));
      items.forEach((item: any) => {
        if (item.name.toLowerCase().includes(lowerQuery) || item.description.toLowerCase().includes(lowerQuery)) {
          allItems.push({ ...item, shopId: Number(shopId), shopName: shop?.name });
        }
      });
    });

    setResults({ shops: matchedShops, items: allItems });
  }, [query]);

  const getItemQuantity = (id: number) => {
    return cart.find(i => i.id === id)?.quantity || 0;
  };

  return (
    <div className="search-results-page container">
      <div className="search-bar-large card">
        <SearchIcon size={24} />
        <input 
          type="text" 
          placeholder="Search for shops or food items..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {query.trim() ? (
        <div className="results-container">
          {results.shops.length > 0 && (
            <section className="results-section">
              <h2>Shops</h2>
              <div className="shops-grid grid-3">
                {results.shops.map(shop => (
                  <div key={shop.id} className="shop-card card" onClick={() => navigate(`/menu/${shop.id}`)}>
                    <img src={shop.image} alt={shop.name} />
                    <div className="shop-info">
                      <h3>{shop.name}</h3>
                      <p>{shop.description}</p>
                      <div className="shop-meta">
                        <div className="rating"><Star size={14} fill="currentColor" /> {shop.rating}</div>
                        <span>{shop.prepTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {results.items.length > 0 && (
            <section className="results-section">
              <h2>Food Items</h2>
              <div className="items-list">
                {results.items.map(item => (
                  <div key={`${item.shopId}-${item.id}`} className="search-item card">
                    <div className="item-main">
                      <img src={item.image} alt={item.name} />
                      <div className="item-info">
                        <div className="shop-tag">{item.shopName}</div>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <span className="price">₹{item.price}</span>
                      </div>
                    </div>
                    <div className="item-actions">
                      {getItemQuantity(item.id) > 0 ? (
                        <div className="qty-toggle">
                          <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                          <span>{getItemQuantity(item.id)}</span>
                          <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                        </div>
                      ) : (
                        <button 
                          className="add-btn" 
                          onClick={() => addToCart(item, item.shopId)}
                          disabled={!item.available}
                        >
                          {item.available ? 'ADD' : 'OUT OF STOCK'}
                        </button>
                      )}
                      <button className="view-shop-btn" onClick={() => navigate(`/menu/${item.shopId}`)}>
                        View Menu <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {results.shops.length === 0 && results.items.length === 0 && (
            <div className="no-results">
              <SearchIcon size={64} />
              <h3>No results found for "{query}"</h3>
              <p>Try searching for something else like "Burger", "Dosa", or "Juice Corner".</p>
            </div>
          )}
        </div>
      ) : (
        <div className="search-placeholder">
          <p>Type something to start searching across all campus shops...</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
