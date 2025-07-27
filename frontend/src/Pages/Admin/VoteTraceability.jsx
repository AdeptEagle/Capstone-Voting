import React, { useState, useEffect, useMemo } from 'react';
import { checkCurrentUser } from '../../services/auth';
import { getPositions, getCandidates, getVotes } from '../../services/api';
import './VoteTraceability.css';

// --- Loading Spinner Component ---
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="mt-3 text-muted">Loading vote data...</p>
  </div>
);

// --- Vote Traceability Component ---
const VoteTraceability = () => {
  const [data, setData] = useState({ positions: [], candidates: [], votes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('summary');
  const [filterStudentId, setFilterStudentId] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  const [showStudentIds, setShowStudentIds] = useState(true);

  // Check if user is admin or superadmin
  const currentUser = checkCurrentUser();
  const userRole = currentUser.role;
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [positions, candidates, votes] = await Promise.all([
          getPositions(),
          getCandidates(),
          getVotes()
        ]);

        setData({
          positions,
          candidates,
          votes
        });
      } catch (err) {
        setError('Failed to load vote data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process vote details with candidate and position information
  const voteDetails = useMemo(() => {
    return data.votes.map(vote => {
      const candidate = data.candidates.find(c => c.id === vote.candidateId);
      const position = data.positions.find(p => p.id === candidate?.positionId);
      return {
        ...vote,
        candidateName: candidate?.name || 'Unknown Candidate',
        positionName: position?.name || 'Unknown Position',
        positionId: position?.id || null
      };
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [data.votes, data.candidates, data.positions]);

  // Filter votes based on search criteria
  const filteredVotes = useMemo(() => {
    let filtered = voteDetails;

    if (filterStudentId) {
      filtered = filtered.filter(vote => 
        vote.studentId?.toLowerCase().includes(filterStudentId.toLowerCase())
      );
    }

    if (filterPosition && filterPosition !== 'all') {
      filtered = filtered.filter(vote => vote.positionId === filterPosition);
    }

    return filtered;
  }, [voteDetails, filterStudentId, filterPosition]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalVotes = data.votes.length;
    const uniqueVoters = new Set(data.votes.map(v => v.voterId)).size;
    const votingDays = new Set(data.votes.map(v => v.timestamp.split(' ')[0])).size;
    const positionsWithVotes = new Set(data.votes.map(v => {
      const candidate = data.candidates.find(c => c.id === v.candidateId);
      const position = data.positions.find(p => p.id === candidate?.positionId);
      return position?.id;
    })).size;

    return { totalVotes, uniqueVoters, votingDays, positionsWithVotes };
  }, [data.votes, data.candidates, data.positions]);

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <i className="fas fa-lock text-danger mb-3"></i>
          <h3>Access Denied</h3>
          <p>You don't have permission to view vote traceability data.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="vote-traceability-dashboard">
      {/* Unified Professional Header */}
      <div className="dashboard-header-pro">
        <div className="dashboard-header-row">
          <div>
            <h1 className="dashboard-title-pro">Vote Traceability & Audit Dashboard</h1>
            <p className="dashboard-subtitle-pro">Comprehensive audit trail and detailed analysis of all voting activities.</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <ul className="nav nav-tabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button 
              className={`nav-link ${activeTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveTab('summary')}
              type="button"
            >
              <i className="fas fa-chart-pie me-2"></i>
              Summary Overview
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button 
              className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
              type="button"
            >
              <i className="fas fa-list me-2"></i>
              Detailed Audit Log
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button 
              className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
              type="button"
            >
              <i className="fas fa-chart-line me-2"></i>
              Analytics
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="summary-tab">
            {/* Statistics Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-users text-primary"></i>
                </div>
                <div className="stat-content">
                  <h3>{statistics.totalVotes}</h3>
                  <p>Total Votes Cast</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-user-check text-success"></i>
                </div>
                <div className="stat-content">
                  <h3>{statistics.uniqueVoters}</h3>
                  <p>Unique Voters</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-calendar-alt text-info"></i>
                </div>
                <div className="stat-content">
                  <h3>{statistics.votingDays}</h3>
                  <p>Voting Days</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-layer-group text-warning"></i>
                </div>
                <div className="stat-content">
                  <h3>{statistics.positionsWithVotes}</h3>
                  <p>Active Positions</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity-section">
              <h4 className="section-title">
                <i className="fas fa-clock me-2"></i>
                Recent Voting Activity
              </h4>
              <div className="recent-votes-list">
                {voteDetails.slice(0, 15).map((vote, index) => (
                  <div key={vote.id} className="recent-vote-item">
                    <div className="vote-number">#{index + 1}</div>
                    <div className="vote-details">
                      <div className="vote-student">
                        {showStudentIds ? `Student ID: ${vote.studentId}` : 'Anonymous Vote'}
                      </div>
                      <div className="vote-candidate">
                        Voted for: {vote.candidateName} ({vote.positionName})
                      </div>
                    </div>
                    <div className="vote-time">
                      {new Date(vote.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="details-tab">
            {/* Filters */}
            <div className="filters-section">
              <div className="row">
                <div className="col-md-4">
                  <label className="form-label">Search by Student ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter student ID..."
                    value={filterStudentId}
                    onChange={(e) => setFilterStudentId(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Filter by Position</label>
                  <select
                    className="form-select"
                    value={filterPosition}
                    onChange={(e) => setFilterPosition(e.target.value)}
                  >
                    <option value="all">All Positions</option>
                    {data.positions.map(pos => (
                      <option key={pos.id} value={pos.id}>{pos.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Display Options</label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="showStudentIds"
                      checked={showStudentIds}
                      onChange={(e) => setShowStudentIds(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="showStudentIds">
                      Show Student IDs
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Vote Log */}
            <div className="vote-log-section">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="section-title">
                  <i className="fas fa-list me-2"></i>
                  Complete Vote Log
                </h4>
                <span className="badge bg-primary">
                  {filteredVotes.length} votes found
                </span>
              </div>

              <div className="vote-traceability-list">
                {filteredVotes.length === 0 ? (
                  <div className="no-results">
                    <i className="fas fa-search text-muted mb-3"></i>
                    <h5>No votes found</h5>
                    <p>Try adjusting your search criteria</p>
                  </div>
                ) : (
                  filteredVotes.map((vote, index) => (
                    <div key={vote.id} className="vote-trace-item">
                      <div className="vote-trace-header">
                        <span className="vote-number">#{index + 1}</span>
                        <span className="vote-time">
                          {new Date(vote.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="vote-trace-details">
                        <div className="vote-trace-student">
                          <i className="fas fa-id-card me-2"></i>
                          {showStudentIds ? `Student ID: ${vote.studentId}` : 'Anonymous Vote'}
                        </div>
                        <div className="vote-trace-voter">
                          <i className="fas fa-user me-2"></i>
                          Voter: {vote.voterName}
                        </div>
                        <div className="vote-trace-candidate">
                          <i className="fas fa-vote-yea me-2"></i>
                          Voted for: {vote.candidateName} ({vote.positionName})
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <h4 className="section-title">
              <i className="fas fa-chart-line me-2"></i>
              Voting Analytics
            </h4>
            
            <div className="row">
              <div className="col-md-6">
                <div className="analytics-card">
                  <h5>Votes by Position</h5>
                  <div className="position-votes-list">
                    {data.positions.map(pos => {
                      const positionVotes = voteDetails.filter(v => v.positionId === pos.id);
                      return (
                        <div key={pos.id} className="position-vote-item">
                          <div className="position-name">{pos.name}</div>
                          <div className="position-vote-count">{positionVotes.length} votes</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="analytics-card">
                  <h5>Voting Timeline</h5>
                  <div className="timeline-stats">
                    <div className="timeline-item">
                      <div className="timeline-label">Earliest Vote</div>
                      <div className="timeline-value">
                        {voteDetails.length > 0 ? 
                          new Date(voteDetails[voteDetails.length - 1].timestamp).toLocaleDateString() : 
                          'No votes'
                        }
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-label">Latest Vote</div>
                      <div className="timeline-value">
                        {voteDetails.length > 0 ? 
                          new Date(voteDetails[0].timestamp).toLocaleDateString() : 
                          'No votes'
                        }
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-label">Voting Period</div>
                      <div className="timeline-value">{statistics.votingDays} days</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoteTraceability; 