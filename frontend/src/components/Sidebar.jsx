import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useElection } from '../contexts/ElectionContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const userRole = localStorage.getItem('role');
  const { canVote, canViewCandidates, canViewResults, hasActiveElection, hasAnyElection, hasEndedElection } = useElection();

  // Role-specific navigation items
  const getNavItems = () => {
    switch (userRole) {
      case 'superadmin':
        return [
          { path: '/superadmin', label: 'Dashboard' },
          { path: '/superadmin/manage-admins', label: 'Manage Admins' },
          { path: '/elections', label: 'Elections' },
          { path: '/positions', label: 'Positions' },
          { path: '/candidates', label: 'Candidates' },
          { path: '/voters', label: 'Voters' },
          { path: '/results', label: 'Results' },
          { path: '/vote-traceability', label: 'Vote Traceability' }
        ];
      case 'admin':
        return [
          { path: '/admin', label: 'Dashboard' },
          { path: '/elections', label: 'Elections' },
          { path: '/positions', label: 'Positions' },
          { path: '/candidates', label: 'Candidates' },
          { path: '/voters', label: 'Voters' },
          { path: '/results', label: 'Results' },
          { path: '/vote-traceability', label: 'Vote Traceability' }
        ];
      default: // User role
        const userItems = [
          { path: '/dashboard', label: 'Dashboard' }
        ];
        
        // Only show Vote if there's an active election
        if (canVote) {
          userItems.push({ path: '/vote', label: 'Vote' });
        }
        
        // Only show Candidates if there are elections
        if (canViewCandidates) {
          userItems.push({ path: '/candidates', label: 'View Candidates' });
        }
        
        // Only show Results if there are elections
        if (canViewResults) {
          userItems.push({ path: '/results', label: 'View Results' });
        }
        
        return userItems;
    }
  };

  const getRoleTitle = () => {
    switch (userRole) {
      case 'superadmin':
        return 'Super Admin Panel';
      case 'admin':
        return 'Admin Panel';
      default:
        return 'Voting System';
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    const role = localStorage.getItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    if (role === 'admin' || role === 'superadmin') {
      window.location.href = '/admin-login';
    } else {
      window.location.href = '/user-login';
    }
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="admin-profile">
            <div className="admin-default-icon">
              {userRole === 'superadmin' ? 'SA' : userRole === 'admin' ? 'A' : 'U'}
            </div>
            <div className="edit-overlay">
              <span>Edit</span>
            </div>
          </div>
          <h3 className="admin-name">{getRoleTitle()}</h3>
          <small className="role-badge">{userRole || 'user'}</small>
        </div>

        <ul className="sidebar-nav">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => window.innerWidth < 768 && onToggle()}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <button className="btn btn-outline-light logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div 
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`} 
        onClick={onToggle}
      />
    </>
  );
};

export default Sidebar; 