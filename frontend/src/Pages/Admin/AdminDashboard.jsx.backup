import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPositions, getCandidates, getVoters, getVotes } from '../../services/api';
import { checkCurrentUser, getToken } from '../../services/auth';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPositions: 0,
    totalCandidates: 0,
    totalVoters: 0,
    totalVotes: 0,
    activeVoters: 0
  });
  const [recentData, setRecentData] = useState({
    positions: [],
    candidates: [],
    voters: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

      setStats({
        totalPositions: positions.length,
        totalCandidates: candidates.length,
        totalVoters: voters.length,
        totalVotes: votes.length,
        activeVoters: voters.filter(voter => voter.hasVoted).length
      });

      setRecentData({
        positions: positions.slice(0, 3),
        candidates: candidates.slice(0, 3),
        voters: voters.slice(0, 3)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/admin-login');
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
    <div className="admin-dashboard">
      {/* Unified Professional Header */}
      <div className="dashboard-header-pro">
        <div className="dashboard-header-row">
          <div>
            <h1 className="dashboard-title-pro">Admin Panel</h1>
            <p className="dashboard-subtitle-pro">Welcome back, Admin! Manage your system from here.</p>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Stats Cards */}
      <div className="row mb-4">
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
        <div className="col-md-2 mb-3">
          <div className="stat-card">
            <div className="stat-icon active-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.activeVoters}</h3>
              <p>Voted</p>
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
                    onClick={() => navigate('/admin/positions')}
                  >
                    <i className="fas fa-briefcase me-2"></i>
                    Manage Positions
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button 
                    className="btn btn-success w-100 action-btn"
                    onClick={() => navigate('/admin/candidates')}
                  >
                    <i className="fas fa-user-tie me-2"></i>
                    Manage Candidates
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button 
                    className="btn btn-info w-100 action-btn"
                    onClick={() => navigate('/admin/voters')}
                  >
                    <i className="fas fa-user-friends me-2"></i>
                    Manage Voters
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button 
                    className="btn btn-warning w-100 action-btn"
                    onClick={() => navigate('/admin/results')}
                  >
                    <i className="fas fa-chart-bar me-2"></i>
                    View Results
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Explanations and Recent Data */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Positions Management</h5>
            </div>
            <div className="card-body">
              <p className="text-muted mb-3">
                Create and manage voting positions. Each position represents a role that candidates can run for.
              </p>
              <div className="recent-data">
                <h6>Recent Positions:</h6>
                {recentData.positions.length > 0 ? (
                  recentData.positions.map((position, index) => (
                    <div key={position.id} className="data-item">
                      <span className="data-label">{position.name}</span>
                      <span className="data-value">Vote Limit: {position.voteLimit}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted small">No positions created yet.</p>
                )}
              </div>
              <button 
                className="btn btn-outline-primary btn-sm mt-2"
                onClick={() => navigate('/admin/positions')}
              >
                View All Positions
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Candidates Management</h5>
            </div>
            <div className="card-body">
              <p className="text-muted mb-3">
                Add and manage candidates for each position. Candidates are the individuals running for election.
              </p>
              <div className="recent-data">
                <h6>Recent Candidates:</h6>
                {recentData.candidates.length > 0 ? (
                  recentData.candidates.map((candidate, index) => (
                    <div key={candidate.id} className="data-item">
                      <span className="data-label">{candidate.name}</span>
                      <span className="data-value">Position: {candidate.positionId}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted small">No candidates added yet.</p>
                )}
              </div>
              <button 
                className="btn btn-outline-primary btn-sm mt-2"
                onClick={() => navigate('/admin/candidates')}
              >
                View All Candidates
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Voters Management</h5>
            </div>
            <div className="card-body">
              <p className="text-muted mb-3">
                Register and manage voter accounts. Voters can cast their votes once per election.
              </p>
              <div className="recent-data">
                <h6>Recent Voters:</h6>
                {recentData.voters.length > 0 ? (
                  recentData.voters.map((voter, index) => (
                    <div key={voter.id} className="data-item">
                      <span className="data-label">{voter.name}</span>
                      <span className={`data-value ${voter.hasVoted ? 'text-success' : 'text-warning'}`}>
                        {voter.hasVoted ? 'Voted' : 'Not Voted'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted small">No voters registered yet.</p>
                )}
              </div>
              <button 
                className="btn btn-outline-primary btn-sm mt-2"
                onClick={() => navigate('/admin/voters')}
              >
                View All Voters
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Results & Analytics</h5>
            </div>
            <div className="card-body">
              <p className="text-muted mb-3">
                View real-time election results, voting statistics, and analytics for each position.
              </p>
              <div className="results-preview">
                <h6>Voting Progress:</h6>
                <div className="progress mb-2">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${stats.totalVoters > 0 ? (stats.activeVoters / stats.totalVoters) * 100 : 0}%` }}
                  >
                    {stats.totalVoters > 0 ? Math.round((stats.activeVoters / stats.totalVoters) * 100) : 0}%
                  </div>
                </div>
                <small className="text-muted">
                  {stats.activeVoters} of {stats.totalVoters} voters have cast their votes
                </small>
              </div>
              <div className="d-flex gap-2 mt-2">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate('/admin/results')}
                >
                  View Results
                </button>
                <button 
                  className="btn btn-outline-info btn-sm"
                  onClick={() => navigate('/admin/vote-traceability')}
                >
                  Vote Traceability
                </button>
              </div>
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
              <h5 className="mb-0">Quick Tips</h5>
            </div>
            <div className="card-body">
              <div className="tip-item">
                <i className="fas fa-lightbulb text-warning me-2"></i>
                <span>Create positions before adding candidates</span>
              </div>
              <div className="tip-item">
                <i className="fas fa-lightbulb text-warning me-2"></i>
                <span>Register voters early to ensure smooth voting</span>
              </div>
              <div className="tip-item">
                <i className="fas fa-lightbulb text-warning me-2"></i>
                <span>Monitor results regularly during the election</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 