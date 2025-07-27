import React, { useState, useEffect } from 'react';
import { getElections, getActiveElection, getVotes, getVoters, updateElection } from '../services/api';
import './ElectionStatus.css';

const ElectionStatus = () => {
  const [elections, setElections] = useState([]);
  const [activeElection, setActiveElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updatingElection, setUpdatingElection] = useState(null);

  useEffect(() => {
    fetchElectionData();
  }, []);

  const fetchElectionData = async () => {
    try {
      setLoading(true);
      const [elections, activeElection, votes, voters] = await Promise.all([
        getElections(),
        getActiveElection(),
        getVotes(),
        getVoters()
      ]);

      console.log('All elections:', elections);
      console.log('Active election:', activeElection);

      setElections(elections || []);
      setActiveElection(activeElection);
      
      // Calculate voting statistics
      const totalVotes = votes.length;
      const totalVoters = voters.length;
      const votedVoters = voters.filter(voter => voter.hasVoted).length;
      
      // Update active election with voting stats
      if (activeElection) {
        setActiveElection({
          ...activeElection,
          totalVotes,
          totalVoters,
          votedVoters,
          turnoutPercentage: totalVoters > 0 ? Math.round((votedVoters / totalVoters) * 100) : 0
        });
      }
    } catch (error) {
      console.error('Error fetching election data:', error);
      setError('Failed to load election status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-warning';
      case 'active': return 'text-success';
      case 'paused': return 'text-info';
      case 'stopped': return 'text-danger';
      case 'ended': return 'text-secondary';
      default: return 'text-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'fas fa-clock';
      case 'active': return 'fas fa-play-circle';
      case 'paused': return 'fas fa-pause-circle';
      case 'stopped': return 'fas fa-stop-circle';
      case 'ended': return 'fas fa-check-circle';
      default: return 'fas fa-question-circle';
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Not set';
    try {
      return new Date(dateTime).toLocaleString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getTimeRemaining = (endTime) => {
    if (!endTime) return 'No end time set';
    
    try {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end - now;
      
      if (diff <= 0) return 'Ended';
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) return `${days}d ${hours}h remaining`;
      if (hours > 0) return `${hours}h ${minutes}m remaining`;
      return `${minutes}m remaining`;
    } catch (error) {
      console.error('Error calculating time remaining:', error);
      return 'Invalid date';
    }
  };

  const handleStatusChange = async (electionId, newStatus) => {
    try {
      setUpdatingElection(electionId);
      setError('');
      setSuccess('');
      
      // Find the current election data
      const election = elections.find(e => e.id === electionId);
      if (!election) {
        setError('Election not found');
        return;
      }

      // Update the election status
      await updateElection(electionId, {
        title: election.title,
        description: election.description,
        startTime: election.startTime,
        endTime: election.endTime,
        status: newStatus
      });

      // Refresh the data
      await fetchElectionData();
      
      // Show success message
      const statusText = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
      setSuccess(`Election "${election.title}" has been ${statusText.toLowerCase()}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error updating election status:', error);
      setError('Failed to update election status');
    } finally {
      setUpdatingElection(null);
    }
  };

  const getStatusActions = (election) => {
    const actions = [];
    
    if (!election.status) {
      return actions; // Return empty array if status is null/undefined
    }
    
    switch (election.status) {
      case 'draft':
        actions.push(
          <button
            key="activate"
            className="btn btn-success btn-sm me-2"
            onClick={() => handleStatusChange(election.id, 'active')}
            disabled={updatingElection === election.id}
          >
            {updatingElection === election.id ? (
              <i className="fas fa-spinner fa-spin me-1"></i>
            ) : (
              <i className="fas fa-play me-1"></i>
            )}
            Activate
          </button>
        );
        break;
        
      case 'active':
        actions.push(
          <button
            key="pause"
            className="btn btn-warning btn-sm me-2"
            onClick={() => handleStatusChange(election.id, 'draft')}
            disabled={updatingElection === election.id}
          >
            {updatingElection === election.id ? (
              <i className="fas fa-spinner fa-spin me-1"></i>
            ) : (
              <i className="fas fa-pause me-1"></i>
            )}
            Pause
          </button>,
          <button
            key="end"
            className="btn btn-danger btn-sm me-2"
            onClick={() => handleStatusChange(election.id, 'ended')}
            disabled={updatingElection === election.id}
          >
            {updatingElection === election.id ? (
              <i className="fas fa-spinner fa-spin me-1"></i>
            ) : (
              <i className="fas fa-stop me-1"></i>
            )}
            End
          </button>
        );
        break;
        
      case 'ended':
        actions.push(
          <span key="ended" className="text-muted">
            <i className="fas fa-check-circle me-1"></i>
            Election completed and saved to history
          </span>
        );
        break;
        
      case 'cancelled':
        actions.push(
          <span key="cancelled" className="text-muted">
            <i className="fas fa-times-circle me-1"></i>
            Election cancelled
          </span>
        );
        break;
    }
    
    return actions;
  };

  if (loading) {
    return (
      <div className="election-status-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading election status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {error}
      </div>
    );
  }

  return (
    <div className="election-status-container">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      {/* Header with refresh button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">
          <i className="fas fa-chart-line me-2"></i>
          Election Status Dashboard
        </h4>
        <button 
          className="btn btn-outline-primary btn-sm"
          onClick={fetchElectionData}
          disabled={loading}
        >
          {loading ? (
            <i className="fas fa-spinner fa-spin me-1"></i>
          ) : (
            <i className="fas fa-sync-alt me-1"></i>
          )}
          Refresh
        </button>
      </div>
      
      {/* Current Election Status */}
      {activeElection ? (
        <div className="card mb-4">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">
              <i className="fas fa-vote-yea me-2"></i>
              Active Election
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-8">
                <h4 className="text-success">{activeElection.title}</h4>
                <p className="text-muted">{activeElection.description}</p>
                <div className="election-details">
                  <div className="detail-item">
                    <span className="detail-label">Start Time:</span>
                    <span className="detail-value">{formatDateTime(activeElection.startTime)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">End Time:</span>
                    <span className="detail-value">{formatDateTime(activeElection.endTime)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Time Remaining:</span>
                    <span className="detail-value text-warning fw-bold">
                      {getTimeRemaining(activeElection.endTime)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Created By:</span>
                    <span className="detail-value">{activeElection.createdByUsername}</span>
                  </div>
                </div>
                <div className="active-election-actions mt-3">
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleStatusChange(activeElection.id, 'draft')}
                    disabled={updatingElection === activeElection.id}
                  >
                    {updatingElection === activeElection.id ? (
                      <i className="fas fa-spinner fa-spin me-1"></i>
                    ) : (
                      <i className="fas fa-pause me-1"></i>
                    )}
                    Pause Election
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleStatusChange(activeElection.id, 'ended')}
                    disabled={updatingElection === activeElection.id}
                  >
                    {updatingElection === activeElection.id ? (
                      <i className="fas fa-spinner fa-spin me-1"></i>
                    ) : (
                      <i className="fas fa-stop me-1"></i>
                    )}
                    End Election
                  </button>
                </div>
              </div>
              <div className="col-md-4">
                <div className="voting-stats">
                  <div className="stat-card">
                    <div className="stat-number">{activeElection.totalVotes || 0}</div>
                    <div className="stat-label">Total Votes Cast</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{activeElection.totalVoters || 0}</div>
                    <div className="stat-label">Registered Voters</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{activeElection.votedVoters || 0}</div>
                    <div className="stat-label">Voters Participated</div>
                  </div>
                  <div className="turnout-progress">
                    <div className="progress">
                      <div 
                        className="progress-bar bg-success" 
                        style={{ width: `${activeElection.turnoutPercentage || 0}%` }}
                      >
                        {activeElection.turnoutPercentage || 0}%
                      </div>
                    </div>
                    <small className="text-muted">Voter Turnout</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card mb-4">
          <div className="card-header bg-warning text-dark">
            <h5 className="mb-0">
              <i className="fas fa-exclamation-triangle me-2"></i>
              No Active Election
            </h5>
          </div>
          <div className="card-body">
            <p className="text-muted mb-0">
              There is currently no active election. Check the election list below for upcoming or past elections.
            </p>
          </div>
        </div>
      )}

      {/* All Elections List */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="fas fa-list me-2"></i>
            All Elections
          </h5>
        </div>
        <div className="card-body">
          {elections.length > 0 ? (
            <div className="elections-list">
              {elections.map((election) => (
                <div key={election.id} className="election-item">
                  <div className="election-header">
                    <div className="election-title">
                      <h6 className="mb-1">{election.title || 'Untitled Election'}</h6>
                      <span className={`status-badge ${getStatusColor(election.status)}`}>
                        <i className={`${getStatusIcon(election.status)} me-1`}></i>
                        {election.status ? election.status.charAt(0).toUpperCase() + election.status.slice(1) : 'Unknown'}
                      </span>
                    </div>
                    <div className="election-meta">
                      <small className="text-muted">
                        Created by {election.createdByUsername || 'Unknown'}
                      </small>
                    </div>
                  </div>
                  <div className="election-actions">
                    {getStatusActions(election)}
                  </div>
                                      <div className="election-info">
                      <p className="election-description">{election.description || 'No description available'}</p>
                      <div className="election-dates">
                        <span className="date-item">
                          <i className="fas fa-calendar-plus me-1"></i>
                          Start: {election.startTime ? formatDateTime(election.startTime) : 'Not set'}
                        </span>
                        <span className="date-item">
                          <i className="fas fa-calendar-minus me-1"></i>
                          End: {election.endTime ? formatDateTime(election.endTime) : 'Not set'}
                        </span>
                      </div>
                      {election.positionCount > 0 && (
                        <div className="election-positions">
                          <i className="fas fa-briefcase me-1"></i>
                          {election.positionCount} position{election.positionCount !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-center">No elections found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElectionStatus; 