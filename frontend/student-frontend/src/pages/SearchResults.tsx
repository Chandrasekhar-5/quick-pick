import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Star, Clock, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import API from '../services/api';
import './SearchResults.css';

const SearchResults: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addToCart, cart, updateQuantity } = useApp();
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get('q') || '';
    
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<{ shops: any[], items: any[] }>({ shops: [], items: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query.trim()) {
                setResults({ shops: [], items: [] });
                return;
            }
            
            setLoading(true);
            try {
                const res = await API.get(`/menu/search?q=${encodeURIComponent(query)}`);
                setResults(res.data);
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchSearchResults();
    }, [query]);

    const getItemQuantity = (id: string) => {
        return cart.find(i => i.id === id)?.quantity || 0;
    };

    if (loading) {
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
                <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
            </div>
        );
    }

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
                                    <div key={shop._id} className="shop-card card" onClick={() => navigate(`/menu/${shop._id}`)}>
                                        <img src={shop.logo || 'https://via.placeholder.com/400x300'} alt={shop.name} />
                                        <div className="shop-info">
                                            <h3>{shop.name}</h3>
                                            <p>{shop.description}</p>
                                            <div className="shop-meta">
                                                <div className="rating"><Star size={14} fill="currentColor" /> 4.5</div>
                                                <span>10-15 min</span>
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
                                    <div key={`${item.vendorId?._id}-${item._id}`} className="search-item card">
                                        <div className="item-main">
                                            <img src={item.image} alt={item.name} />
                                            <div className="item-info">
                                                <div className="shop-tag">{item.vendorId?.name || 'Campus Shop'}</div>
                                                <h3>{item.name}</h3>
                                                <p>{item.description}</p>
                                                <span className="price">₹{item.price}</span>
                                            </div>
                                        </div>
                                        <div className="item-actions">
                                            {getItemQuantity(item._id) > 0 ? (
                                                <div className="qty-toggle">
                                                    <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                                                    <span>{getItemQuantity(item._id)}</span>
                                                    <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                                                </div>
                                            ) : (
                                                <button 
                                                    className="add-btn" 
                                                    onClick={() => addToCart(item, item.vendorId?._id)}
                                                    disabled={!item.isAvailable}
                                                >
                                                    {item.isAvailable ? 'ADD' : 'OUT OF STOCK'}
                                                </button>
                                            )}
                                            <button className="view-shop-btn" onClick={() => navigate(`/menu/${item.vendorId?._id}`)}>
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