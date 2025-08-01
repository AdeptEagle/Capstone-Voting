import React, { useState, useEffect } from 'react';
import { getCandidates, getPositions, getDepartments } from '../../services/api';
import { useElection } from '../../contexts/ElectionContext';
import ElectionStatusMessage from '../../components/ElectionStatusMessage';
import { CandidateImage } from '../../utils/image';
import './UserCandidates.css';

const UserCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  
  const { canViewCandidates, hasActiveElection, activeElection } = useElection();

  useEffect(() => {
    if (canViewCandidates) {
      fetchData();
    }
  }, [canViewCandidates]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [candidatesData, positionsData] = await Promise.all([
        getCandidates(),
        getPositions()
      ]);

      // Add position names to candidates
      const candidatesWithPositions = candidatesData.map(candidate => ({
        ...candidate,
        positionName: positionsData.find(p => p.id === candidate.positionId)?.name || 'No Position'
      }));

      setCandidates(candidatesWithPositions);
      setPositions(positionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  // Filter candidates based on search and position
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.positionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (candidate.departmentName && candidate.departmentName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPosition = !selectedPosition || candidate.positionId === selectedPosition;
    
    return matchesSearch && matchesPosition;
  });

  // Group candidates by position
  const candidatesByPosition = filteredCandidates.reduce((acc, candidate) => {
    const position = candidate.positionName || 'No Position';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(candidate);
    return acc;
  }, {});

  if (!canViewCandidates) {
    return <ElectionStatusMessage />;
  }

  if (loading) {
    return (
      <div className="user-candidates-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading candidates...</p>
      </div>
    );
  }

  return (
    <div className="user-candidates-container">
      {/* Header */}
      <div className="dashboard-header-modern">
        <div className="header-content">
          <div className="header-title-section">
            <h1 className="dashboard-title">
              <i className="fas fa-users me-3"></i>
              Election Candidates
            </h1>
            <p className="dashboard-subtitle">
              {activeElection ? `Candidates for: ${activeElection.title}` : 'View all registered candidates'}
            </p>
          </div>
          <div className="header-info">
            <div className="info-card">
              <div className="info-value">{filteredCandidates.length}</div>
              <div className="info-label">Total Candidates</div>
            </div>
            <div className="info-card">
              <div className="info-value">{Object.keys(candidatesByPosition).length}</div>
              <div className="info-label">Positions</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mx-4" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="search-filter-section">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="search-input-group">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search candidates, positions, or departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
            >
              <option value="">All Positions</option>
              {positions.map(position => (
                <option key={position.id} value={position.id}>
                  {position.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setSearchTerm('');
                setSelectedPosition('');
              }}
            >
              <i className="fas fa-times me-1"></i>
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Candidates Display */}
      {Object.keys(candidatesByPosition).length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <i className="fas fa-users fa-4x text-muted mb-3"></i>
            <h3 className="text-muted">No Candidates Found</h3>
            <p className="text-muted">
              {searchTerm || selectedPosition ? 'Try adjusting your search criteria' : 'No candidates are currently registered'}
            </p>
          </div>
        </div>
      ) : (
        <div className="candidates-by-position">
          {Object.keys(candidatesByPosition)
            .sort()
            .map(positionName => (
              <div key={positionName} className="position-section">
                <div className="position-header">
                  <h4 className="position-title">
                    <i className="fas fa-certificate me-2"></i>
                    {positionName}
                  </h4>
                  <span className="candidate-count">
                    {candidatesByPosition[positionName].length} candidate{candidatesByPosition[positionName].length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="candidates-grid">
                  {candidatesByPosition[positionName].map(candidate => (
                    <div key={candidate.id} className="modern-card candidate-card">
                      <div className="candidate-card-header">
                        <div className="candidate-card-info">
                          <h3 className="candidate-card-name">{candidate.name}</h3>
                          <div className="candidate-card-position">{candidate.positionName}</div>
                        </div>
                        <div className="candidate-card-actions">
                          <button 
                            className="view-platform-btn"
                            onClick={() => {}} // Placeholder for future view platform functionality
                            title="View Platform"
                          >
                            <i className="fas fa-eye"></i>
                            View Platform
                          </button>
                        </div>
                      </div>

                      <div className="candidate-photo-section">
                        <CandidateImage 
                          photoUrl={candidate.photoUrl}
                          alt={candidate.name}
                          className="candidate-photo"
                          size="large"
                        />
                      </div>

                      <div className="candidate-details-section">
                        <div className="candidate-stat">
                          <i className="fas fa-building"></i>
                          <span>{candidate.departmentId || 'No Department'}</span>
                        </div>
                        {candidate.courseId && (
                          <div className="candidate-stat">
                            <i className="fas fa-graduation-cap"></i>
                            <span>{candidate.courseId}</span>
                          </div>
                        )}
                      </div>

                      {candidate.description && (
                        <div className="candidate-platform-preview">
                          <p>
                            {candidate.description.length > 100 
                              ? `${candidate.description.substring(0, 100)}...` 
                              : candidate.description
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Voting Instructions */}
      {activeElection && activeElection.status === 'active' && (
        <div className="voting-instructions">
          <div className="alert alert-info">
            <div className="d-flex align-items-center">
              <i className="fas fa-info-circle fa-2x me-3"></i>
              <div>
                <h6 className="alert-heading mb-1">Ready to Vote?</h6>
                <p className="mb-0">
                  The election is currently active. You can cast your vote by going to the voting page.
                </p>
              </div>
              <div className="ms-auto">
                <a href="/user/vote" className="btn btn-primary">
                  <i className="fas fa-vote-yea me-2"></i>
                  Cast Your Vote
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCandidates;