import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-container">
      <div className="landing-box">
        <h1>Welcome</h1>
        <p>Please select your login type:</p>
        <div className="landing-btn-group">
          <button className="landing-btn" onClick={() => navigate('/admin-login')}>Admin / Super Admin Login</button>
          <button className="landing-btn" onClick={() => navigate('/user-login')}>User Login</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 