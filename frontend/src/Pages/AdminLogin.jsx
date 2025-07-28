import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/admin/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      setLoading(false);
      if (res.data.role === 'superadmin') {
        navigate('/superadmin');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="admin-login-split-container">
      {/* Left Panel: Corporate Branding & Features */}
      <div className="admin-login-left-panel">
        <div className="admin-login-branding">
          <div className="admin-login-logo">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h1 className="admin-login-title">Admin Control Panel</h1>
          <p className="admin-login-subtitle">Professional • Secure • Efficient</p>
        </div>
        <div className="admin-login-features">
          <div className="admin-login-feature-item">
            <i className="fas fa-cogs"></i>
            <div>
              <h4>System Management</h4>
              <p>Comprehensive control over voting operations</p>
            </div>
          </div>
          <div className="admin-login-feature-item">
            <i className="fas fa-chart-bar"></i>
            <div>
              <h4>Analytics Dashboard</h4>
              <p>Real-time insights and performance metrics</p>
            </div>
          </div>
          <div className="admin-login-feature-item">
            <i className="fas fa-user-shield"></i>
            <div>
              <h4>Role-Based Access</h4>
              <p>Granular permissions and security controls</p>
            </div>
          </div>
          <div className="admin-login-feature-item">
            <i className="fas fa-database"></i>
            <div>
              <h4>Data Management</h4>
              <p>Secure handling of voter and candidate data</p>
            </div>
          </div>
        </div>
      </div>
      {/* Right Panel: Login Form */}
      <div className="admin-login-right-panel">
        <form className="admin-login-form card-shadow" onSubmit={handleSubmit}>
          <h2>Admin Login</h2>
          {error && <div className="admin-login-error">{error}</div>}
          <div className="admin-login-field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="admin-login-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <div className="forgot-password-link">
              <button
                type="button"
                onClick={() => {
                  console.log('Admin forgot password button clicked');
                  navigate('/forgot-password');
                }}
                className="forgot-password-btn"
              >
                Forgot Password?
              </button>
            </div>
          </div>
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 