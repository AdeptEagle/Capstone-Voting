import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdmins, getPositions, getCandidates, getVoters, getVotes } from '../../services/api';
import ElectionStatus from '../../components/ElectionStatus';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalPositions: 0,
    totalCandidates: 0,
    totalVoters: 0,
    totalVotes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [admins, positions, candidates, voters, votes] = await Promise.all([
        getAdmins(),
        getPositions(),
        getCandidates(),
        getVoters(),
        getVotes()
      ]);

      setStats({
        totalAdmins: admins.length,
        totalPositions: positions.length,
        totalCandidates: candidates.length,
        totalVoters: voters.length,
        totalVotes: votes.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="superadmin-dashboard">
      {/* Unified Professional Header */}
      <div className="dashboard-header-pro">
        <div className="dashboard-header-row">
          <div>
            <h1 className="dashboard-title-pro">Super Admin Panel</h1>
            <p className="dashboard-subtitle-pro">Full control over all admin accounts and settings.</p>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-2 mb-3">
          <div className="stat-card">
            <div className="stat-icon admin-icon">
              <i className="fas fa-users-cog"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.totalAdmins}</h3>
              <p>Admin Accounts</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div className="stat-card">
            <div className="stat-icon position-icon">
              <i className="fas fa-briefcase"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.totalPositions}</h3>
              <p>Positions</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div className="stat-card">
            <div className="stat-icon candidate-icon">
              <i className="fas fa-user-tie"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.totalCandidates}</h3>
              <p>Candidates</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div className="stat-card">
            <div className="stat-icon voter-icon">
              <i className="fas fa-user-friends"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.totalVoters}</h3>
              <p>Voters</p>
            </div>
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <div className="stat-card">
            <div className="stat-icon vote-icon">
              <i className="fas fa-vote-yea"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.totalVotes}</h3>
              <p>Votes Cast</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <button 
                    className="btn btn-primary w-100 action-btn"
                    onClick={() => navigate('/superadmin/manage-admins')}
                  >
                    <i className="fas fa-users-cog me-2"></i>
                    Manage Admins
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button 
                    className="btn btn-success w-100 action-btn"
                    onClick={() => navigate('/admin/results')}
                  >
                    <i className="fas fa-chart-bar me-2"></i>
                    View Results
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button 
                    className="btn btn-info w-100 action-btn"
                    onClick={() => navigate('/admin/positions')}
                  >
                    <i className="fas fa-briefcase me-2"></i>
                    Manage Positions
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button 
                    className="btn btn-warning w-100 action-btn"
                    onClick={() => navigate('/admin/candidates')}
                  >
                    <i className="fas fa-user-tie me-2"></i>
                    Manage Candidates
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Election Status */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-vote-yea me-2"></i>
                Current Ballot/Election Status
              </h5>
            </div>
            <div className="card-body">
              <ElectionStatus />
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">System Status</h5>
            </div>
            <div className="card-body">
              <div className="status-item">
                <span className="status-label">Database:</span>
                <span className="status-value text-success">Online</span>
              </div>
              <div className="status-item">
                <span className="status-label">API Server:</span>
                <span className="status-value text-success">Running</span>
              </div>
              <div className="status-item">
                <span className="status-label">Voting Status:</span>
                <span className="status-value text-warning">Active</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Recent Activity</h5>
            </div>
            <div className="card-body">
              <div className="activity-item">
                <i className="fas fa-circle text-primary me-2"></i>
                <span>System initialized successfully</span>
                <small className="text-muted ms-auto">Just now</small>
              </div>
              <div className="activity-item">
                <i className="fas fa-circle text-success me-2"></i>
                <span>Admin accounts loaded</span>
                <small className="text-muted ms-auto">2 min ago</small>
              </div>
              <div className="activity-item">
                <i className="fas fa-circle text-info me-2"></i>
                <span>Dashboard statistics updated</span>
                <small className="text-muted ms-auto">5 min ago</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard; 