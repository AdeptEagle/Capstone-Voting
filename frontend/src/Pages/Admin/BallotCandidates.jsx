import React, { useState, useEffect } from 'react';
import { useElection } from '../../contexts/ElectionContext';
import { 
  getCandidateAssignmentStatus
} from '../../services/api';
import './BallotCandidates.css';
import '../Candidates.css';
import { getCandidatePhotoUrl, CandidatePhotoPlaceholder } from '../../utils/image.jsx';

const BallotCandidates = () => {
  const { activeElection } = useElection();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeElection) {
      fetchCandidates();
    } else {
      setLoading(false);
    }
  }, [activeElection]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const data = await getCandidateAssignmentStatus(activeElection.id);
      setCandidates(data);
      setError('');
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get correct candidate photo URL
  const getCandidatePhotoUrl = (photoUrl) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      return photoUrl;
    }
    if (photoUrl.startsWith('/uploads/')) {
      return `http://localhost:3000${photoUrl}`;
    }
    return `http://localhost:3000/uploads/${photoUrl}`;
  };


  if (loading) {
    return (
      <div className="ballot-candidates-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading ballot candidates...</p>
      </div>
    );
  }

  if (!activeElection) {
    return (
      <div className="ballot-candidates-error">
        <div className="alert alert-warning text-center">
          <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
          <h4>No Current Ballot</h4>
          <p>There is no current ballot to view candidates for.</p>
          <p className="mb-0">Please create a ballot first.</p>
        </div>
      </div>
    );
  }

  const assignedCandidates = candidates.filter(candidate => candidate.isAssigned);
  const unassignedCandidates = candidates.filter(candidate => !candidate.isAssigned);

  // Debug logging
  console.log('All candidates:', candidates);
  console.log('Assigned candidates:', assignedCandidates);
  console.log('Unassigned candidates:', unassignedCandidates);

  // Group candidates by position
  const groupCandidatesByPosition = (candidates) => {
    const grouped = {};
    candidates.forEach(candidate => {
      const position = candidate.positionName || 'Unknown Position';
      if (!grouped[position]) {
        grouped[position] = [];
      }
      grouped[position].push(candidate);
    });
    return grouped;
  };

  const assignedByPosition = groupCandidatesByPosition(assignedCandidates);
  const unassignedByPosition = groupCandidatesByPosition(unassignedCandidates);

  console.log('Assigned by position:', assignedByPosition);
  console.log('Sample candidate photo URL:', candidates[0]?.photoUrl);

  return (
    <div className="ballot-candidates-container">
      <div className="dashboard-header-pro">
        <div className="header-content">
          <h1>Ballot Candidates View</h1>
          <p>View candidates for: <strong>{activeElection.title}</strong> 
            <span className={`badge ms-2 ${activeElection.status === 'active' ? 'bg-success' : activeElection.status === 'paused' ? 'bg-warning' : activeElection.status === 'stopped' ? 'bg-danger' : 'bg-secondary'}`}>
              {activeElection.status.toUpperCase()}
            </span>
          </p>
          <div className="alert alert-info">
            <i className="fas fa-info-circle me-2"></i>
            <strong>Note:</strong> Candidates are now managed during ballot creation. Use the "Edit Ballot" option to modify candidates.
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {candidates.length === 0 ? (
        <div className="no-candidates">
          <div className="no-candidates-content">
            <i className="fas fa-users"></i>
            <h3>No Candidates Found</h3>
            <p>No candidates are available for this ballot.</p>
          </div>
        </div>
      ) : assignedCandidates.length === 0 ? (
        <div className="no-candidates">
          <div className="no-candidates-content">
            <i className="fas fa-users"></i>
            <h3>No Candidates Assigned</h3>
            <p>No candidates have been assigned to this ballot yet.</p>
            <div className="mt-3">
              <div className="alert alert-warning">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <strong>Note:</strong> {candidates.length} candidates are available but not assigned to this ballot.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="candidates-user-view">
          {/* Show all candidates for debugging - remove this later */}
          {assignedCandidates.length === 0 && candidates.length > 0 && (
            <div className="alert alert-info mb-4">
              <i className="fas fa-info-circle me-2"></i>
              <strong>Debug Info:</strong> Showing all available candidates since none are assigned to this ballot.
            </div>
          )}
          
          {Object.entries(assignedCandidates.length > 0 ? assignedByPosition : groupCandidatesByPosition(candidates)).map(([position, positionCandidates]) => (
            <div key={position} className="position-section">
              <div className="position-header">
                <h2 className="position-title">{position}</h2>
                <div className="candidate-count">
                  {positionCandidates.length} {positionCandidates.length === 1 ? 'Candidate' : 'Candidates'}
                </div>
              </div>
              
              <div className="candidate-card-grid">
                {positionCandidates.map((candidate, index) => (
                  <div key={candidate.id} className="candidate-card-modern">
                    <div className="candidate-card-header">
                      <div className="candidate-rank-badge">
                        <span className="rank-number">{index + 1}</span>
                      </div>
                      <div className="candidate-photo-container">
                        {candidate.photoUrl && candidate.photoUrl.trim() !== '' ? (
                          <img 
                            src={getCandidatePhotoUrl(candidate.photoUrl)} 
                            alt={candidate.name}
                            className="candidate-photo"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentNode.querySelector('.candidate-photo-placeholder').style.display = 'flex';
                            }}
                          />
                        ) : (
                          <CandidatePhotoPlaceholder className="candidate-photo-placeholder" />
                        )}
                      </div>
                    </div>
                    
                    <div className="candidate-card-body">
                      <div className="candidate-info">
                        <div className="candidate-name">
                          {candidate.name}
                          <span className="verified">
                            <i className="fas fa-check-circle"></i>
                          </span>
                        </div>
                        <div className="candidate-position">
                          {position}
                        </div>
                      </div>
                      
                      {candidate.description && (
                        <div className="candidate-brief">
                          <p>{candidate.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          <strong>View Only:</strong> This page now shows a read-only view of ballot candidates. 
          To modify candidates, use the "Edit Ballot" option from the Elections page.
        </div>
      </div>
    </div>
  );
};

export default BallotCandidates; 