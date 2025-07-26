import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useElection } from '../../contexts/ElectionContext';
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
    api.get(`/api/voters`).then(res => {
      const voter = res.data.find(v => v.id === userId);
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
      <div className="user-dashboard-header">
        <h2>Welcome, {user?.name || 'Voter'}!</h2>
        <p>Your Student ID: <strong>{user?.studentId}</strong></p>
      </div>

      {/* Election Status Notification */}
      <div className="election-status-notification">
        {hasActiveElection ? (
          <div className="election-info-card">
            <div className="election-info-header">
              <i className="fas fa-vote-yea"></i>
              <h3>Current Election: {activeElection.title}</h3>
            </div>
            <div className="election-info-content">
              <p className="election-description">{activeElection.description}</p>
              <div className="election-details">
                <div className="detail-item">
                  <i className="fas fa-calendar-alt"></i>
                  <span><strong>Start:</strong> {new Date(activeElection.startTime).toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-calendar-check"></i>
                  <span><strong>End:</strong> {new Date(activeElection.endTime).toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-clock"></i>
                  <span><strong>Status:</strong> 
                    <span className={`status-badge ${activeElection.status}`}>
                      {activeElection.status.charAt(0).toUpperCase() + activeElection.status.slice(1)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-election-notification">
            <div className="notification-icon">
              <i className="fas fa-info-circle"></i>
            </div>
            <div className="notification-content">
              <h3>No Active Election</h3>
              <p>There is currently no active election. The ballot is not open for voting at this time.</p>
              <div className="notification-actions">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate('/candidates')}
                >
                  <i className="fas fa-users me-2"></i>
                  View Candidates (if available)
                </button>
                {canViewResults && (
                  <button
                    className="btn btn-outline-info"
                    onClick={() => navigate('/results')}
                  >
                    <i className="fas fa-chart-bar me-2"></i>
                    View Previous Results
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Voting Status */}
      {hasActiveElection && (
        <div className="user-dashboard-status">
          {hasVoted ? (
            <div className="alert alert-success">
              <i className="fas fa-check-circle me-2"></i>
              <strong>Vote Submitted!</strong> You have already cast your vote. Thank you for participating!
            </div>
          ) : canVote ? (
            <div className="alert alert-success">
              <i className="fas fa-unlock me-2"></i>
              <strong>Voting is Open!</strong> You can now cast your vote. Please proceed to the voting page.
            </div>
          ) : (
            <div className="alert alert-warning">
              <i className="fas fa-clock me-2"></i>
              <strong>Voting Not Yet Open</strong> The election exists but voting has not started yet. Please wait for the ballot to open.
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="user-dashboard-actions">
        {hasActiveElection && canVote && !hasVoted && (
          <button
            className="btn btn-primary btn-lg mb-3"
            onClick={() => navigate('/vote')}
          >
            <i className="fas fa-vote-yea me-2"></i>
            Cast Your Vote Now
          </button>
        )}
        
        {hasActiveElection && (
          <button
            className="btn btn-outline-secondary mb-3 me-2"
            onClick={() => navigate('/candidates')}
          >
            <i className="fas fa-users me-2"></i>
            View Candidates
          </button>
        )}
        
        {canViewResults && (
          <button
            className="btn btn-outline-info mb-3"
            onClick={() => navigate('/results')}
          >
            <i className="fas fa-chart-bar me-2"></i>
            View Results
          </button>
        )}
      </div>
    </div>
  );
};

export default UserDashboard; 