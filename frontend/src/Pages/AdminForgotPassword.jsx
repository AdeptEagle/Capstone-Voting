import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import './AdminForgotPassword.css';

const AdminForgotPassword = () => {
  console.log('AdminForgotPassword component loaded');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('AdminForgotPassword form submitted', { email });
    setLoading(true);
    setMessage('');
    setError('');

    try {
      console.log('Making API request to /password-reset/forgot-password');
      const response = await api.post('/password-reset/forgot-password', {
        email,
        userType: 'admin'
      });

      console.log('API response:', response.data);
      setMessage(response.data.message);
      setEmail('');
    } catch (error) {
      console.error('API error:', error);
      setError(error.response?.data?.error || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/admin-login');
  };

  return (
    <div className="admin-forgot-password-container">
      <div className="admin-forgot-password-card">
        <div className="admin-forgot-password-header">
          <div className="admin-forgot-password-logo">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h1>Admin Password Reset</h1>
          <p>Enter your admin email to receive a secure password reset link</p>
        </div>

        {message && (
          <div className="alert alert-success">
            <i className="fas fa-check-circle me-2"></i>
            {message}
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-forgot-password-form">
          <div className="form-group">
            <label className="form-label">Admin Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@votingsystem.com"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Sending Request...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane me-2"></i>
                  Send Reset Link
                </>
              )}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleBackToLogin}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back to Admin Login
            </button>
          </div>
        </form>

        <div className="admin-forgot-password-info">
          <div className="info-card">
            <i className="fas fa-info-circle"></i>
            <div>
              <h4>Admin Security</h4>
              <p>
                This reset link is specifically for admin accounts. The link will expire in 15 minutes 
                and can only be used once for security purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword; 