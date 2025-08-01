import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPositions, getCandidates, getVoters, getVotes } from '../../services/api';
import { useElection } from '../../contexts/ElectionContext';
import { checkCurrentUser } from '../../services/auth';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPositions: 0,
    totalCandidates: 0,
    totalVoters: 0,
    totalVotes: 0,
    activeVoters: 0,
    voterParticipation: 0
  });
  const [recentData, setRecentData] = useState({
    positions: [],
    candidates: [],
    voters: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUser = checkCurrentUser();
  const { activeElection, allElections, hasActiveElection, hasAnyElection } = useElection();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [positions, candidates, voters, votes] = await Promise.all([
        getPositions(),
        getCandidates(),
        getVoters(),
        getVotes()
      ]);

      const activeVoters = voters.filter(voter => voter.hasVoted).length;
      const voterParticipation = voters.length > 0 ? (activeVoters / voters.length) * 100 : 0;

      setStats({
        totalPositions: positions.length,
        totalCandidates: candidates.length,
        totalVoters: voters.length,
        totalVotes: votes.length,
        activeVoters,
        voterParticipation: Math.round(voterParticipation)
      });

      setRecentData({
        positions: positions.slice(-5),
        candidates: candidates.slice(-5),
        voters: voters.slice(-5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getElectionStatusInfo = () => {
    if (hasActiveElection) {
      return {
        status: activeElection.status,
        title: activeElection.title,
        description: activeElection.description,
        statusColor: activeElection.status === 'active' ? 'success' : 'warning'
      };
    }
    return {
      status: 'No Active Election',
      title: 'Ready to Create',
      description: 'System is ready for new election setup',
      statusColor: 'info'
    };
  };

  const quickActions = [
    {
      title: 'Elections',
      description: 'Create & manage elections',
      icon: 'fas fa-vote-yea',
      color: 'blue',
      path: '/admin/elections',
      highlight: !hasActiveElection
    },
    {
      title: 'Positions',
      description: 'Setup election positions',
      icon: 'fas fa-user-tie',
      color: 'indigo',
      path: '/admin/positions'
    },
    {
      title: 'Candidates',
      description: 'Manage candidates',
      icon: 'fas fa-users',
      color: 'green',
      path: '/admin/candidates'
    },
    {
      title: 'Voters',
      description: 'Voter management',
      icon: 'fas fa-user-friends',
      color: 'teal',
      path: '/admin/voters'
    },
    {
      title: 'Results',
      description: 'View election results',
      icon: 'fas fa-chart-bar',
      color: 'orange',
      path: '/admin/results',
      highlight: hasAnyElection
    },
    {
      title: 'History',
      description: 'Election history',
      icon: 'fas fa-history',
      color: 'purple',
      path: '/admin/election-history'
    }
  ];

  const managementSections = [
    {
      title: 'Recent Positions',
      items: recentData.positions,
      emptyText: 'No positions created yet',
      viewAllPath: '/admin/positions',
      renderItem: (item) => (
        <div key={item.id} className="recent-item">
          <div className="recent-item-icon">
            <i className="fas fa-briefcase"></i>
          </div>
          <div className="recent-item-content">
            <h6>{item.name}</h6>
            <p>{item.description || 'No description'}</p>
          </div>
        </div>
      )
    },
    {
      title: 'Recent Candidates',
      items: recentData.candidates,
      emptyText: 'No candidates added yet',
      viewAllPath: '/admin/candidates',
      renderItem: (item) => (
        <div key={item.id} className="recent-item">
          <div className="recent-item-icon">
            <i className="fas fa-user"></i>
          </div>
          <div className="recent-item-content">
            <h6>{item.name}</h6>
            <p>{item.positionName || 'No position assigned'}</p>
          </div>
        </div>
      )
    },
    {
      title: 'Recent Voters',
      items: recentData.voters,
      emptyText: 'No voters registered yet',
      viewAllPath: '/admin/voters',
      renderItem: (item) => (
        <div key={item.id} className="recent-item">
          <div className="recent-item-icon">
            <i className={`fas ${item.hasVoted ? 'fa-check-circle text-success' : 'fa-user-clock'}`}></i>
          </div>
          <div className="recent-item-content">
            <h6>{item.name}</h6>
            <p>ID: {item.studentId} • {item.hasVoted ? 'Voted' : 'Not voted'}</p>
          </div>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const electionInfo = getElectionStatusInfo();

  return (
    <div className="admin-dashboard">
      {/* Professional Header */}
      <div className="header-card">
        <div className="header-content">
          <div className="header-text">
            <h1 className="dashboard-title">
              <i className="fas fa-tachometer-alt me-3"></i>
              Admin Dashboard
            </h1>
            <p className="dashboard-subtitle">
              Welcome back, {currentUser.user?.username || 'Administrator'}! 
              Manage your voting system from this central hub.
            </p>
          </div>
          <div className="header-stats">
            <div className="header-stat">
              <div className="stat-value">{allElections.length}</div>
              <div className="stat-label">Total Elections</div>
            </div>
            <div className="header-stat">
              <div className="stat-value">{stats.totalVotes}</div>
              <div className="stat-label">Votes Cast</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="modern-card card-danger mb-4">
          <div className="alert-content">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        </div>
      )}

      {/* Election Status Card */}
      <div className={`modern-card card-${electionInfo.statusColor} mb-4`}>
        <div className="election-status-header">
          <div className="status-icon">
            <i className="fas fa-info-circle"></i>
          </div>
          <div className="status-content">
            <h3>Current Election Status</h3>
            <h4>{electionInfo.title}</h4>
            <p>{electionInfo.description}</p>
          </div>
          <div className="status-badge">
            <span className={`badge badge-${electionInfo.statusColor}`}>
              {electionInfo.status}
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="analytics-grid mb-4">
        <div className="analytics-card">
          <div className="card-icon icon-bg-indigo">
            <i className="fas fa-briefcase"></i>
          </div>
          <div className="card-content">
            <h3>Positions</h3>
            <div className="card-value">{stats.totalPositions}</div>
            <div className="card-subtitle">Available positions</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon icon-bg-green">
            <i className="fas fa-users"></i>
          </div>
          <div className="card-content">
            <h3>Candidates</h3>
            <div className="card-value">{stats.totalCandidates}</div>
            <div className="card-subtitle">Registered candidates</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon icon-bg-teal">
            <i className="fas fa-user-friends"></i>
          </div>
          <div className="card-content">
            <h3>Voters</h3>
            <div className="card-value">{stats.totalVoters}</div>
            <div className="card-subtitle">Registered voters</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon icon-bg-blue">
            <i className="fas fa-vote-yea"></i>
          </div>
          <div className="card-content">
            <h3>Votes Cast</h3>
            <div className="card-value">{stats.totalVotes}</div>
            <div className="card-subtitle">Total votes</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon icon-bg-orange">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="card-content">
            <h3>Participation</h3>
            <div className="card-value">{stats.voterParticipation}%</div>
            <div className="card-subtitle">Voter turnout</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="modern-card mb-4">
        <div className="card-header-modern">
          <h3>
            <i className="fas fa-bolt me-2"></i>
            Quick Actions
          </h3>
          <p>Common administrative tasks</p>
        </div>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`action-card ${action.highlight ? 'action-card-highlight' : ''}`}
              onClick={() => navigate(action.path)}
            >
              <div className={`action-icon icon-bg-${action.color}`}>
                <i className={action.icon}></i>
              </div>
              <div className="action-content">
                <h4>{action.title}</h4>
                <p>{action.description}</p>
              </div>
              {action.highlight && (
                <div className="action-badge">
                  <i className="fas fa-star"></i>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="content-grid">
        {managementSections.map((section, index) => (
          <div key={index} className="modern-card">
            <div className="card-header-modern">
              <h4>{section.title}</h4>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate(section.viewAllPath)}
              >
                View All
              </button>
            </div>
            <div className="recent-items-list">
              {section.items.length > 0 ? (
                section.items.map(section.renderItem)
              ) : (
                <div className="empty-state-small">
                  <i className="fas fa-inbox text-muted"></i>
                  <p>{section.emptyText}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;