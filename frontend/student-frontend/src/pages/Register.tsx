import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import API from '../services/api';
import './Auth.css';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await API.post("/auth/register", {
        name,
        email,
        password,
        role: "student",
        college: "699fe38a815da2e980032674",
      });
      
      const { token, _id, name: userName, email: userEmail, role } = response.data;
      localStorage.setItem("studentToken", token);
      localStorage.setItem("qp_user", JSON.stringify({ _id, name: userName, email: userEmail, role }));
      login(response.data);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="visual-content">
            <ChefHat size={64} color="white" />
            <h1>QuickPick Campus</h1>
            <p>Join thousands of students saving time every day with smart pre-ordering.</p>
          </div>
        </div>
        
        <div className="auth-form-side">
          <div className="auth-card card">
            <div className="auth-header">
              <h2>Create Account</h2>
              <p>Join the QuickPick community</p>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center', 
              backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '5px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-box">
                  <User size={18} />
                  <input 
                    type="text" 
                    placeholder="Alex Johnson" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

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

              <button type="submit" className="btn-primary auth-btn">
                GET STARTED <ArrowRight size={18} />
              </button>
            </form>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/">Sign in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;