import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ShoppingBag, Clock, ArrowRight, Utensils, History, CreditCard, CheckCircle2, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import API from '../services/api';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const { user } = useApp();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        todayOrders: 0,
        readyOrders: 0,
        nextPickup: null as string | null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get('/orders/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const quickActions = [
        { label: 'Pre-Order Food', icon: <Clock size={24} />, path: '/dashboard', color: 'blue' },
        { label: 'Instant Order', icon: <Utensils size={24} />, path: '/dashboard', color: 'green' },
        { label: 'View Orders', icon: <History size={24} />, path: '/orders', color: 'orange' },
        { label: 'View Wallet', icon: <CreditCard size={24} />, path: '/wallet', color: 'purple' },
    ];

    if (loading) {
        return (
            <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="welcome-text">
                    <h1>Welcome back, {user?.name || 'Student'}! 👋</h1>
                    <p>Ready to grab some delicious food today?</p>
                </div>
            </header>

            <div className="dashboard-grid">
                <div className="card wallet-card">
                    <div className="card-header">
                        <div className="icon-box blue">
                            <Wallet size={20} />
                        </div>
                        <span>Wallet Balance</span>
                    </div>
                    <div className="balance-amount">₹{user?.walletBalance.toFixed(2)}</div>
                    <button className="btn-text" onClick={() => navigate('/wallet')}>
                        Top up wallet <ArrowRight size={16} />
                    </button>
                </div>

                <div className="card summary-card">
                    <div className="card-header">
                        <div className="icon-box green">
                            <ShoppingBag size={20} />
                        </div>
                        <span>Today's Orders</span>
                    </div>
                    <div className="summary-count">{stats.todayOrders} Orders</div>
                    {stats.readyOrders > 0 && (
                        <p className="summary-detail">{stats.readyOrders} Ready for pickup</p>
                    )}
                </div>

                <div className="card slot-card">
                    <div className="card-header">
                        <div className="icon-box orange">
                            <Clock size={20} />
                        </div>
                        <span>Next Pickup Slot</span>
                    </div>
                    <div className="slot-time">{stats.nextPickup || 'No orders'}</div>
                    {stats.nextPickup && <p className="slot-detail">Ready soon!</p>}
                </div>
            </div>

            <section className="quick-actions-section">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                    {quickActions.map((action, index) => (
                        <motion.button 
                            key={index}
                            whileHover={{ y: -5 }}
                            className={`action-card card ${action.color}`}
                            onClick={() => navigate(action.path)}
                        >
                            <div className="action-icon">{action.icon}</div>
                            <span>{action.label}</span>
                        </motion.button>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;