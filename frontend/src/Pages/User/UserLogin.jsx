import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './UserLogin.css';

const UserLogin = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/user/login', { studentId, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="user-login-split-container">
      {/* Left Panel: Branding & Features */}
      <div className="user-login-left-panel">
        <div className="user-login-branding">
          <div className="user-login-logo">
            <i className="fas fa-vote-yea"></i>
          </div>
          <h1 className="user-login-title">Digital Voting System</h1>
          <p className="user-login-subtitle">Secure &bull; Transparent &bull; Reliable</p>
        </div>
        <div className="user-login-features">
          <div className="user-login-feature-item">
            <i className="fas fa-shield-alt"></i>
            <div>
              <h4>Secure Authentication</h4>
              <p>Advanced encryption and multi-factor security</p>
            </div>
          </div>
          <div className="user-login-feature-item">
            <i className="fas fa-chart-line"></i>
            <div>
              <h4>Real-time Results</h4>
              <p>Live voting statistics and instant updates</p>
            </div>
          </div>
          <div className="user-login-feature-item">
            <i className="fas fa-users"></i>
            <div>
              <h4>Multi-role Access</h4>
              <p>Super Admin, Admin, and User management</p>
            </div>
          </div>
          <div className="user-login-feature-item">
            <i className="fas fa-clock"></i>
            <div>
              <h4>24/7 Availability</h4>
              <p>Round-the-clock voting system access</p>
            </div>
          </div>
        </div>
      </div>
      {/* Right Panel: Login Form */}
      <div className="user-login-right-panel">
        <form className="user-login-form card-shadow" onSubmit={handleSubmit}>
          <h2>User Login</h2>
          {error && <div className="user-login-error">{error}</div>}
          <div className="user-login-field">
            <label htmlFor="studentId">Student ID</label>
            <input
              type="text"
              id="studentId"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              placeholder="YYYY-NNNNN"
              required
            />
          </div>
          <div className="user-login-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="user-login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="divider-or">or</div>
          <button
            type="button"
            className="user-register-btn"
            onClick={() => navigate('/register')}
          >
            Register as New Voter
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin; 