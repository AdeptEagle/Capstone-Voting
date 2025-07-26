import React from 'react';
import './Header.css';

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="app-header">
      <button 
        className="sidebar-toggle-btn" 
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>
      <h1 className="app-header-title">Voting System Admin Panel</h1>
    </header>
  );
};

export default Header; 