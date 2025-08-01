import React from 'react';
import { checkCurrentUser } from '../services/auth';
import './Header.css';

const Header = ({ onToggleSidebar }) => {
  const currentUser = checkCurrentUser();
  const userName = currentUser.user?.username || 'User';
  const userRole = currentUser.role || 'user';

  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          className="sidebar-toggle-btn" 
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className="header-title">
          <h2>Voting System</h2>
          <span className="header-subtitle">Student Election Platform</span>
        </div>
      </div>
      
      <div className="header-right">
        <div className="user-info">
          <div className="user-avatar">
            <i className={`fas ${userRole === 'admin' || userRole === 'superadmin' ? 'fa-user-shield' : 'fa-user'}`}></i>
          </div>
          <div className="user-details">
            <span className="user-name">{userName}</span>
            <span className="user-role">{userRole.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 