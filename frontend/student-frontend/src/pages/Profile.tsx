import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Wallet as WalletIcon, 
  ChevronRight, 
  LogOut, 
  Shield, 
  Bell, 
  Star, 
  QrCode,
  Edit2,
  CheckCircle,
  AlertCircle,
  Camera
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
    department: 'Computer Science',
    hostel: 'Hostel Block A'
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Mock save
  };

  return (
    <div className="profile-page container">
      <div className="profile-layout">
        <div className="profile-main">
          <div className="card profile-header-card">
            <div className="profile-avatar-section">
              <div className="avatar-large">
                {user?.name.charAt(0)}
              </div>
              <div className="profile-title">
                <h1>{user?.name}</h1>
                <p>Student ID: {user?.studentId}</p>
              </div>
              <button className="edit-profile-btn" onClick={() => setIsEditing(!isEditing)}>
                <Edit2 size={16} />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>
            
            {isEditing ? (
              <form className="edit-form" onSubmit={handleSave}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input 
                      type="text" 
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary save-btn">SAVE CHANGES</button>
              </form>
            ) : (
              <div className="profile-details-grid">
                <div className="detail-item">
                  <Mail size={18} />
                  <div className="text">
                    <label>Email</label>
                    <p>{formData.email}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <Phone size={18} />
                  <div className="text">
                    <label>Phone</label>
                    <p>{formData.phone}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <Building size={18} />
                  <div className="text">
                    <label>Department</label>
                    <p>{formData.department}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <MapPin size={18} />
                  <div className="text">
                    <label>Hostel</label>
                    <p>{formData.hostel}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card settings-card">
            <h3>Account Settings</h3>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <Bell size={20} />
                  <div className="text">
                    <strong>Notifications</strong>
                    <p>Manage your order updates and offers</p>
                  </div>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <Shield size={20} />
                  <div className="text">
                    <strong>Two-Factor Authentication</strong>
                    <p>Secure your wallet transactions</p>
                  </div>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout from QuickPick</span>
          </button>
        </div>

        <aside className="profile-sidebar">
          <div className="card wallet-summary-card">
            <div className="summary-header">
              <WalletIcon size={24} color="var(--primary)" />
              <div className="text">
                <p>Wallet Balance</p>
                <h3>₹{user?.walletBalance.toFixed(2)}</h3>
              </div>
            </div>
            <button className="manage-wallet-btn" onClick={() => navigate('/wallet')}>
              <span>Manage Wallet</span>
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="card reward-points-card">
            <div className="reward-header">
              <Star size={24} fill="#f59e0b" color="#f59e0b" />
              <div className="text">
                <p>Reward Points</p>
                <h3>{user?.rewardPoints}</h3>
              </div>
            </div>
            <div className="reward-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '65%' }}></div>
              </div>
              <p>350 points to next silver tier</p>
            </div>
          </div>

          <div className="card qr-id-card">
            <div className="id-header">
              <img src="https://picsum.photos/seed/logo/40/40" alt="Logo" referrerPolicy="no-referrer" />
              <span>STUDENT ID CARD</span>
            </div>
            <div className="id-body">
              <div className="qr-box">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=STUDENT_${user?.studentId}`} 
                  alt="Student QR" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="id-info">
                <h4>{user?.name}</h4>
                <p>{user?.studentId}</p>
              </div>
            </div>
            <div className="id-footer">
              <QrCode size={16} />
              <span>Scan for Quick Pickup</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Profile;
