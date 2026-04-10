import React, { useState } from 'react';
import { 
  Wallet as WalletIcon, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter, 
  TrendingUp, 
  Gift, 
  ChevronRight,
  CreditCard,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Wallet.css';

const Wallet: React.FC = () => {
  const { user, transactions, addFunds } = useApp();
  const [filter, setFilter] = useState('All');
  const [amount, setAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'All') return true;
    return t.type === filter;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (val > 0) {
      setIsAdding(true);
      try {
        await addFunds(val);
        setAmount('');
      } catch (error) {
        console.error("Failed to add funds:", error);
      } finally {
        setIsAdding(false);
      }
    }
  };

  const quickAmounts = [100, 200, 500, 1000];

  return (
    <div className="wallet-page container">
      <div className="wallet-layout">
        <div className="wallet-main">
          <div className="card wallet-balance-card">
            <div className="balance-info">
              <div className="text">
                <p>Total Balance</p>
                <h1>₹{user?.walletBalance.toFixed(2)}</h1>
              </div>
              <div className="wallet-icon-bg">
                <WalletIcon size={40} color="white" />
              </div>
            </div>
            <div className="balance-footer">
              <div className="reward-points">
                <Gift size={16} />
                <span>{user?.rewardPoints || 0} Reward Points</span>
              </div>
              <div className="savings">
                <TrendingUp size={16} />
                <span>Earn 2% cashback on every order</span>
              </div>
            </div>
          </div>

          <div className="card add-funds-card">
            <h3>Add Money to Wallet</h3>
            <form onSubmit={handleAddFunds} className="add-funds-form">
              <div className="input-group">
                <span className="currency">₹</span>
                <input 
                  type="number" 
                  placeholder="Enter amount" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="1"
                  required
                />
              </div>
              <div className="quick-amounts">
                {quickAmounts.map(amt => (
                  <button 
                    key={amt} 
                    type="button" 
                    className="amt-btn"
                    onClick={() => setAmount(amt.toString())}
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>
              <button 
                type="submit" 
                className="btn-primary add-btn"
                disabled={isAdding || !amount || parseFloat(amount) <= 0}
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    PROCESSING...
                  </>
                ) : (
                  'PROCEED TO ADD'
                )}
              </button>
            </form>
          </div>

          <div className="card transactions-card">
            <div className="transactions-header">
              <h3>Recent Transactions</h3>
              <div className="filter-tabs">
                {['All', 'Credit', 'Debit'].map(f => (
                  <button 
                    key={f} 
                    className={`filter-tab ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="transactions-list">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(t => (
                  <div key={t.id} className="transaction-item">
                    <div className={`icon-box ${t.type.toLowerCase()}`}>
                      {t.type === 'Credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div className="info">
                      <h4>{t.description}</h4>
                      <p>{t.date}</p>
                    </div>
                    <div className={`amount ${t.type.toLowerCase()}`}>
                      {t.type === 'Credit' ? '+' : '-'}₹{t.amount}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-transactions">
                  <p>No transactions yet. Add funds to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="wallet-sidebar">
          <div className="card offers-card">
            <div className="card-header">
              <h3>Cashback Offers</h3>
              <ChevronRight size={20} />
            </div>
            <div className="offer-list">
              <div className="offer-item">
                <div className="offer-icon">
                  <Gift size={20} color="#FC8019" />
                </div>
                <div className="offer-text">
                  <strong>Get 2% Cashback</strong>
                  <p>On all orders using QuickPick wallet</p>
                </div>
              </div>
              <div className="offer-item">
                <div className="offer-icon">
                  <Gift size={20} color="#FC8019" />
                </div>
                <div className="offer-text">
                  <strong>Welcome Bonus ₹50</strong>
                  <p>On first wallet recharge of ₹500+</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card security-card">
            <div className="security-header">
              <ShieldCheck size={24} color="#60b246" />
              <h3>Secure Payments</h3>
            </div>
            <p>Your transactions are protected with 256-bit encryption.</p>
            <div className="payment-partners">
              <CreditCard size={20} />
              <span>UPI, Cards, Net Banking</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Wallet;