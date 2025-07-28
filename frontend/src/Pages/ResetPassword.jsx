import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api.js';
import './ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [userType, setUserType] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const typeParam = searchParams.get('type');
    
    if (!tokenParam || !typeParam) {
      setError('Invalid reset link. Missing token or user type.');
      setVerifying(false);
      return;
    }
    
    setToken(tokenParam);
    setUserType(typeParam);
    verifyToken(tokenParam);
  }, [searchParams]);

  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await api.get(`/password-reset/verify-token/${tokenToVerify}`);
      setTokenValid(true);
      setMessage('Token verified successfully. Please enter your new password.');
    } catch (error) {
      setError(error.response?.data?.error || 'Invalid or expired token');
      setTokenValid(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/password-reset/reset-password', {
        token,
        newPassword
      });

      setMessage('Password reset successfully! Redirecting to login...');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        if (userType === 'admin') {
          navigate('/admin-login');
        } else {
          navigate('/user-login');
        }
      }, 2000);
      
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    if (userType === 'admin') {
      navigate('/admin-login');
    } else {
      navigate('/user-login');
    }
  };

  if (verifying) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <h2>Verifying Reset Link...</h2>
            <p>Please wait while we verify your password reset link.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h1>
            <i className="fas fa-lock me-3"></i>
            Reset Password
          </h1>
          <p>Enter your new password to complete the reset process</p>
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

        {tokenValid ? (
          <form onSubmit={handleSubmit} className="reset-password-form">
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                minLength="6"
              />
              <small className="form-text">
                Password must be at least 6 characters long
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                minLength="6"
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
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    Reset Password
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleBackToLogin}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Login
              </button>
            </div>
          </form>
        ) : (
          <div className="invalid-token">
            <div className="invalid-token-content">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Invalid Reset Link</h3>
              <p>The password reset link is invalid or has expired. Please request a new one.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/forgot-password')}
              >
                <i className="fas fa-key me-2"></i>
                Request New Reset Link
              </button>
            </div>
          </div>
        )}

        <div className="reset-password-info">
          <div className="info-card">
            <i className="fas fa-shield-alt"></i>
            <div>
              <h4>Security Tips</h4>
              <p>
                Choose a strong password with a mix of letters, numbers, and symbols. 
                Avoid using easily guessable information like your name or birthdate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 