import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat, Mail, Lock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login("Alex Johnson");
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="visual-content">
            <ChefHat size={64} color="white" />
            <h1>QuickPick Campus</h1>
            <p>The smartest way to eat on campus. Pre-order, skip lines, and enjoy your meal.</p>
          </div>
        </div>
        
        <div className="auth-form-side">
          <div className="auth-card card">
            <div className="auth-header">
              <h2>Welcome Back</h2>
              <p>Login to your student account</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-box">
                  <Mail size={18} />
                  <input 
                    type="email" 
                    placeholder="student@college.edu" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-box">
                  <Lock size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-meta">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#">Forgot Password?</a>
              </div>

              <button type="submit" className="btn-primary auth-btn">
                SIGN IN <ArrowRight size={18} />
              </button>
            </form>

            <div className="auth-footer">
              <p>New to QuickPick? <Link to="/register">Create an account</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
