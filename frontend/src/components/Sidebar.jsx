import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useElection } from '../contexts/ElectionContext';
import { checkCurrentUser } from '../services/auth';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const currentUser = checkCurrentUser();
  const userRole = currentUser.role;
  const userName = currentUser.user?.username || 'User';
  const { canVote, canViewCandidates, canViewResults, hasActiveElection, hasAnyElection, hasEndedElection } = useElection();
  
  // State for collapsible sections - use localStorage to persist state
  const [expandedSections, setExpandedSections] = useState(() => {
    const saved = localStorage.getItem('sidebar-expanded-sections');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.log('Failed to parse saved sections, using default');
      }
    }
    return {
      main: true,
      elections: true,
      management: true,
      ballot: true,
      voting: true,
      advanced: false
    };
  });

  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => {
      // Create a completely new object to ensure state update
      const newState = {
        main: prev.main,
        elections: prev.elections,
        management: prev.management,
        ballot: prev.ballot,
        voting: prev.voting,
        advanced: prev.advanced,
        [section]: !prev[section]
      };
      // Save to localStorage
      localStorage.setItem('sidebar-expanded-sections', JSON.stringify(newState));
      return newState;
    });
  }, []);

  // Role-specific navigation items with icons and grouping
  const getNavItems = () => {
    switch (userRole) {
      case 'superadmin':
        return {
          main: [
            { path: '/superadmin', label: 'Dashboard', icon: 'fas fa-tachometer-alt' }
          ],
          elections: [
            { path: '/admin/elections', label: 'Active Elections', icon: 'fas fa-vote-yea' },
            { path: '/admin/election-history', label: 'Election History', icon: 'fas fa-history' }
          ],
          management: [
            { path: '/admin/positions', label: 'Positions', icon: 'fas fa-user-tie' },
            { path: '/admin/candidates', label: 'Candidates', icon: 'fas fa-users' },
            { path: '/admin/voters', label: 'Voters', icon: 'fas fa-user-friends' },
            { path: '/admin/department-management', label: 'Department Management', icon: 'fas fa-university' }
          ],
          ballot: [
            { path: '/admin/ballot-positions', label: 'Ballot Positions', icon: 'fas fa-list-ol' },
            { path: '/admin/ballot-candidates', label: 'Ballot Candidates', icon: 'fas fa-list-check' }
          ],
          advanced: [
            { path: '/superadmin/manage-admins', label: 'Manage Admins', icon: 'fas fa-user-shield' },
            { path: '/admin/results', label: 'Results', icon: 'fas fa-chart-bar' },
            { path: '/admin/vote-traceability', label: 'Vote Traceability', icon: 'fas fa-search' }
          ]
        };
      case 'admin':
        return {
          main: [
            { path: '/admin', label: 'Dashboard', icon: 'fas fa-tachometer-alt' }
          ],
          elections: [
            { path: '/admin/elections', label: 'Active Elections', icon: 'fas fa-vote-yea' },
            { path: '/admin/election-history', label: 'Election History', icon: 'fas fa-history' }
          ],
          management: [
            { path: '/admin/positions', label: 'Positions', icon: 'fas fa-user-tie' },
            { path: '/admin/candidates', label: 'Candidates', icon: 'fas fa-users' },
            { path: '/admin/voters', label: 'Voters', icon: 'fas fa-user-friends' },
            { path: '/admin/department-management', label: 'Department Management', icon: 'fas fa-university' }
          ],
          ballot: [
            { path: '/admin/ballot-positions', label: 'Ballot Positions', icon: 'fas fa-list-ol' },
            { path: '/admin/ballot-candidates', label: 'Ballot Candidates', icon: 'fas fa-list-check' }
          ],
          advanced: [
            { path: '/admin/results', label: 'Results', icon: 'fas fa-chart-bar' },
            { path: '/admin/vote-traceability', label: 'Vote Traceability', icon: 'fas fa-search' }
          ]
        };
      default: // User role
        const userItems = {
          main: [
            { path: '/user/dashboard', label: 'Dashboard', icon: 'fas fa-home' }
          ],
          voting: []
        };
        
        // Only show Vote if there's an active election
        if (canVote) {
          userItems.voting.push({ path: '/user/vote', label: 'Cast Vote', icon: 'fas fa-vote-yea' });
        }
        
        // Only show Candidates if there are elections
        if (canViewCandidates) {
          userItems.voting.push({ path: '/user/candidates', label: 'View Candidates', icon: 'fas fa-users' });
        }
        
        // Only show Results if there are elections
        if (canViewResults) {
          userItems.voting.push({ path: '/user/results', label: 'View Results', icon: 'fas fa-chart-bar' });
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

  const getRoleIcon = () => {
    switch (userRole) {
      case 'superadmin':
        return 'fas fa-crown';
      case 'admin':
        return 'fas fa-user-shield';
      default:
        return 'fas fa-user';
    }
  };

  const navItems = useMemo(() => getNavItems(), [userRole, canVote, canViewCandidates, canViewResults]);
  


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

  const renderNavSection = (sectionKey, items, title, icon) => {
    // Check if items exists and is an array
    if (!items || !Array.isArray(items) || items.length === 0) return null;
    
    const isExpanded = expandedSections[sectionKey] || false;
    
    // Prevent rendering if section state is undefined
    if (expandedSections[sectionKey] === undefined) {
      return null;
    }
    
    return (
      <div className="nav-section">
        <div 
          className="section-header"
          onClick={() => toggleSection(sectionKey)}
        >
          <i className={icon}></i>
          <span>{title}</span>
          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} section-toggle`}></i>
        </div>
        <ul className={`section-items ${isExpanded ? 'expanded' : ''}`}>
          {items.map((item) => (
            <li key={item.path} className="nav-item">
                              <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent event from bubbling up to section header
                    if (window.innerWidth < 768) {
                      onToggle();
                    }
                  }}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`} key="sidebar-component">
        <div className="sidebar-header">
          <div className="admin-profile">
            <div className="admin-avatar">
              <i className={getRoleIcon()}></i>
            </div>
          </div>
          <h3 className="admin-name">{userName}</h3>
          <div className="role-badge">
            <i className="fas fa-circle"></i>
            <span>{userRole?.toUpperCase() || 'USER'}</span>
          </div>
        </div>

        <div className="sidebar-nav">
          {/* Main Section */}
          {renderNavSection('main', navItems.main || [], 'Main', 'fas fa-home')}
          
          {/* Elections Section */}
          {renderNavSection('elections', navItems.elections || [], 'Elections', 'fas fa-vote-yea')}
          
          {/* Management Section */}
          {renderNavSection('management', navItems.management || [], 'Management', 'fas fa-cogs')}
          
          {/* Ballot Section */}
          {renderNavSection('ballot', navItems.ballot || [], 'Ballot', 'fas fa-list')}
          
          {/* Voting Section (for users) */}
          {renderNavSection('voting', navItems.voting || [], 'Voting', 'fas fa-vote-yea')}
          
          {/* Advanced Section */}
          {renderNavSection('advanced', navItems.advanced || [], 'Advanced', 'fas fa-tools')}
        </div>

        <div className="sidebar-footer">
          <button className="btn btn-outline-light logout-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
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