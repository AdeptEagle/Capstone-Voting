import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVoters } from '../../services/api';
import { useElection } from '../../contexts/ElectionContext';
import CountdownTimer from '../../components/Elections/CountdownTimer';
import './UserDashboard.css';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const navigate = useNavigate();
  const { activeElection, canVote, hasActiveElection, canViewResults, hasAnyElection, loading: electionLoading, triggerImmediateRefresh } = useElection();

  useEffect(() => {
    // Trigger immediate election status refresh
    triggerImmediateRefresh();
    
    // Fetch user info from token/localStorage
    const userId = localStorage.getItem('userId') || JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id;
    getVoters().then(voters => {
      const voter = voters.find(v => v.id === userId);
      setUser(voter);
      setHasVoted(voter?.hasVoted);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading || electionLoading) {
    return (
      <div className="user-dashboard-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard-container">
      {/* Modern Header Card */}
      <div className="header-card">
        <div className="header-content">
          <div>
            <h2 className="dashboard-title">Welcome, {user?.name || 'Voter'}!</h2>
            <p className="dashboard-subtitle">Student ID: <strong>{user?.studentId}</strong></p>
          </div>
          <div className="user-info-stats">
            <div className="analytics-card card-sm">
              <div className="card-icon icon-bg-blue">
                <i className="fas fa-user"></i>
              </div>
              <div className="card-content">
                <h3>Voter Status</h3>
                <div className="card-value">{hasVoted ? 'Voted' : 'Ready'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Election Status Cards */}
      <div className="election-status-section">
        {hasActiveElection ? (
          <div className="modern-card card-primary">
            <div className="election-status-header">
              <div className="card-icon icon-bg-navy">
                <i className="fas fa-vote-yea"></i>
              </div>
              <div>
                <h3>Current Election</h3>
                <h4 className="election-title">{activeElection.title}</h4>
                <p className="election-description">{activeElection.description}</p>
              </div>
              <div className="election-status-badge">
                <span className={`status-badge ${activeElection.status}`}>
                  {activeElection.status.charAt(0).toUpperCase() + activeElection.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="election-details-grid">
              <div className="detail-card">
                <div className="detail-icon">
                  <i className="fas fa-calendar-alt text-success"></i>
                </div>
                <div>
                  <small className="text-muted">Start Time</small>
                  <div className="detail-value">{new Date(activeElection.startTime).toLocaleString()}</div>
                </div>
              </div>
              
              <div className="detail-card">
                <div className="detail-icon">
                  <i className="fas fa-calendar-check text-info"></i>
                </div>
                <div>
                  <small className="text-muted">End Time</small>
                  <div className="detail-value">{new Date(activeElection.endTime).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Election Countdown Timer */}
            {activeElection.endTime && (activeElection.status === 'active' || activeElection.status === 'pending') && (
              <div className="mt-4">
                <CountdownTimer
                  endTime={activeElection.endTime}
                  electionId={activeElection.id}
                  electionTitle={activeElection.title}
                  onExpired={(electionId) => {
                    console.log(`Election ${electionId} expired, refreshing dashboard...`);
                    triggerImmediateRefresh();
                  }}
                  size="normal"
                  showTitle={false}
                  variant="info"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="modern-card card-warning">
            <div className="no-election-content">
              <div className="card-icon icon-bg-orange">
                <i className="fas fa-info-circle"></i>
              </div>
              <div className="notification-text">
                <h3>No Active Election</h3>
                <p>There is currently no active election. The ballot is not open for voting at this time.</p>
              </div>
            </div>
            <div className="notification-actions">
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate('/user/candidates')}
              >
                <i className="fas fa-users me-2"></i>
                View Candidates (if available)
              </button>
              {canViewResults && (
                <button
                  className="btn btn-outline-info"
                  onClick={() => navigate('/user/results')}
                >
                  <i className="fas fa-chart-bar me-2"></i>
                  View Previous Results
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Voting Status Cards */}
      {hasActiveElection && (
        <div className="voting-status-section">
          {hasVoted ? (
            <div className="modern-card card-success">
              <div className="status-content">
                <div className="card-icon icon-bg-green">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div>
                  <h4>Vote Submitted!</h4>
                  <p>You have already cast your vote. Thank you for participating in the election!</p>
                </div>
              </div>
            </div>
          ) : canVote ? (
            <div className="modern-card card-success">
              <div className="status-content">
                <div className="card-icon icon-bg-green">
                  <i className="fas fa-unlock"></i>
                </div>
                <div>
                  <h4>Voting is Open!</h4>
                  <p>You can now cast your vote. Please proceed to the voting page to make your selection.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="modern-card card-warning">
              <div className="status-content">
                <div className="card-icon icon-bg-orange">
                  <i className="fas fa-clock"></i>
                </div>
                <div>
                  <h4>Voting Not Yet Open</h4>
                  <p>The election exists but voting has not started yet. Please wait for the ballot to open.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Cards Grid */}
      <div className="actions-grid">
        {hasActiveElection && canVote && !hasVoted && (
          <div className="analytics-card card-clickable card-primary" onClick={() => navigate('/user/vote')}>
            <div className="card-icon icon-bg-navy">
              <i className="fas fa-vote-yea"></i>
            </div>
            <div className="card-content">
              <h3>Cast Your Vote</h3>
              <div className="card-subtitle">Click here to vote now</div>
            </div>
          </div>
        )}
        
        {hasActiveElection && (
          <div className="analytics-card card-clickable" onClick={() => navigate('/user/candidates')}>
            <div className="card-icon icon-bg-blue">
              <i className="fas fa-users"></i>
            </div>
            <div className="card-content">
              <h3>View Candidates</h3>
              <div className="card-subtitle">See all election candidates</div>
            </div>
          </div>
        )}
        
        {canViewResults && (
          <div className="analytics-card card-clickable" onClick={() => navigate('/user/results')}>
            <div className="card-icon icon-bg-teal">
              <i className="fas fa-chart-bar"></i>
            </div>
            <div className="card-content">
              <h3>View Results</h3>
              <div className="card-subtitle">Check election results</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard; 