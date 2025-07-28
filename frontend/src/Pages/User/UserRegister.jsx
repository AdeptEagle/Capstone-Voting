import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getPublicVoterGroups } from '../../services/api';
import './UserRegister.css';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: '',
    voterGroupId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [voterGroups, setVoterGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const navigate = useNavigate();

  // Fetch voter groups on component mount
  useEffect(() => {
    const fetchVoterGroups = async () => {
      try {
        const groups = await getPublicVoterGroups();
        setVoterGroups(groups);
      } catch (error) {
        console.error('Error fetching voter groups:', error);
        setError('Failed to load voter groups. Please try again.');
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchVoterGroups();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Student ID format: YYYY-NNNNN
    const idPattern = /^\d{4}-\d{5}$/;
    if (!idPattern.test(formData.studentId)) {
      setError('Student ID must be in the format YYYY-NNNNN (e.g., 2022-00222)');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (!formData.voterGroupId) {
      setError('Please select your department or group');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/auth/user/register', {
        name: formData.name,
        email: formData.email,
        studentId: formData.studentId,
        password: formData.password,
        voterGroupId: formData.voterGroupId
      });

      setSuccess('Registration successful! Redirecting to dashboard...');
      
      // Store token and redirect
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      
      setTimeout(() => {
        navigate('/user/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-register-split-container">
      {/* Left Panel: System Introduction & Benefits */}
      <div className="user-register-left-panel">
        <div className="user-register-branding">
          <div className="user-register-logo">
            <i className="fas fa-user-plus"></i>
          </div>
          <h1 className="user-register-title">Join the System</h1>
          <p className="user-register-subtitle">Your Voice Matters • Secure • Transparent</p>
        </div>
        
        <div className="user-register-intro">
          <h3>Why Student ID?</h3>
          <p>We use your Student ID to ensure:</p>
          <ul>
            <li><strong>One Vote Per Student:</strong> Prevents duplicate registrations</li>
            <li><strong>Academic Verification:</strong> Confirms your enrollment status</li>
            <li><strong>Secure Access:</strong> Your ID serves as your unique username</li>
            <li><strong>Easy Login:</strong> No need to remember additional usernames</li>
          </ul>
        </div>

        <div className="user-register-benefits">
          <div className="user-register-benefit-item">
            <i className="fas fa-check-circle"></i>
            <div>
              <h4>Instant Access</h4>
              <p>Start voting immediately after registration</p>
            </div>
          </div>
          <div className="user-register-benefit-item">
            <i className="fas fa-shield-alt"></i>
            <div>
              <h4>Secure Voting</h4>
              <p>Your vote is encrypted and protected</p>
            </div>
          </div>
          <div className="user-register-benefit-item">
            <i className="fas fa-chart-bar"></i>
            <div>
              <h4>Real-time Results</h4>
              <p>See live updates as votes are cast</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Registration Form */}
      <div className="user-register-right-panel">
        <form className="user-register-form card-shadow" onSubmit={handleSubmit}>
          <h2>Create Your Account</h2>
          
          {error && <div className="user-register-error">{error}</div>}
          {success && <div className="user-register-success">{success}</div>}

          <div className="user-register-field">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="user-register-field">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="user-register-field">
            <label htmlFor="studentId">Student ID *</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="YYYY-NNNNN (e.g., 2022-00222)"
              required
            />
          </div>

          <div className="user-register-field">
            <label htmlFor="voterGroupId">Department/Group *</label>
            <select
              id="voterGroupId"
              name="voterGroupId"
              value={formData.voterGroupId}
              onChange={handleChange}
              disabled={loadingGroups}
              required
            >
              <option value="">Select your department or group</option>
              {voterGroups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name} ({group.type})
                </option>
              ))}
            </select>
            {loadingGroups && <small>Loading groups...</small>}
            <small className="field-help">Please select your department or group to complete registration</small>
          </div>

          <div className="user-register-field">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          <div className="user-register-field">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="user-register-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="back-to-login-link">
            <button type="button" onClick={() => navigate('/')}>
              Already have an account? Sign in here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegister; 