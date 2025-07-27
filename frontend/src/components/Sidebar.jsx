import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useElection } from '../contexts/ElectionContext';
import { checkCurrentUser } from '../services/auth';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const currentUser = checkCurrentUser();
  const userRole = currentUser.role;
  const { canVote, canViewCandidates, canViewResults, hasActiveElection, hasAnyElection, hasEndedElection } = useElection();

  // Role-specific navigation items
  const getNavItems = () => {
    switch (userRole) {
      case 'superadmin':
        return [
          { path: '/superadmin', label: 'Dashboard' },
          { path: '/superadmin/manage-admins', label: 'Manage Admins' },
          { path: '/admin/elections', label: 'Elections' },
          { path: '/admin/election-history', label: 'Election History' },
          { path: '/admin/positions', label: 'Positions' },
          { path: '/admin/candidates', label: 'Candidates' },
          { path: '/admin/ballot-positions', label: 'Ballot Positions' },
          { path: '/admin/ballot-candidates', label: 'Ballot Candidates' },
          { path: '/admin/voters', label: 'Voters' },
          { path: '/admin/results', label: 'Results' },
          { path: '/admin/vote-traceability', label: 'Vote Traceability' }
        ];
      case 'admin':
        return [
          { path: '/admin', label: 'Dashboard' },
          { path: '/admin/elections', label: 'Elections' },
          { path: '/admin/election-history', label: 'Election History' },
          { path: '/admin/positions', label: 'Positions' },
          { path: '/admin/candidates', label: 'Candidates' },
          { path: '/admin/ballot-positions', label: 'Ballot Positions' },
          { path: '/admin/ballot-candidates', label: 'Ballot Candidates' },
          { path: '/admin/voters', label: 'Voters' },
          { path: '/admin/results', label: 'Results' },
          { path: '/admin/vote-traceability', label: 'Vote Traceability' }
        ];
      default: // User role
        const userItems = [
          { path: '/user/dashboard', label: 'Dashboard' }
        ];
        
        // Only show Vote if there's an active election
        if (canVote) {
          userItems.push({ path: '/user/vote', label: 'Vote' });
        }
        
        // Only show Candidates if there are elections
        if (canViewCandidates) {
          userItems.push({ path: '/user/candidates', label: 'View Candidates' });
        }
        
        // Only show Results if there are elections
        if (canViewResults) {
          userItems.push({ path: '/user/results', label: 'View Results' });
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
    const role = currentUser.role;
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