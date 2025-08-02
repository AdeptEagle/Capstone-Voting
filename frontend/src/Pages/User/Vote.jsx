import React, { useEffect, useState } from 'react';
import { getPositions, getCandidates, getVoters, createVote, createMultipleVotes, getElectionCandidates, getElectionPositions, getVotingStatus } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useElection } from '../../contexts/ElectionContext';
import ElectionStatusMessage from '../../components/ElectionStatusMessage';
import './Vote.css';
import { getImageUrl, CandidatePhotoPlaceholder } from '../../utils/image';

// Simple UUID generator
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const Vote = () => {
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [user, setUser] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [selectedVotes, setSelectedVotes] = useState({});
  const [votingStatus, setVotingStatus] = useState({}); // NEW: Track voting status for each position
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showIdConfirmation, setShowIdConfirmation] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [idConfirmation, setIdConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showVoteSummary, setShowVoteSummary] = useState(false);
  const navigate = useNavigate();
  const { canVote, hasActiveElection, triggerImmediateRefresh, activeElection } = useElection();
  const [imgError, setImgError] = useState({}); // Track image errors by candidate ID

  // NEW: Load voting status for each position
  const loadVotingStatus = async () => {
    if (!activeElection || !user) return;
    
    try {
      const statusPromises = positions.map(async (position) => {
        try {
          const status = await getVotingStatus(activeElection.id, position.id);
          return { positionId: position.id, status };
        } catch (error) {
          console.error(`Error loading status for position ${position.id}:`, error);
          return { positionId: position.id, status: null };
        }
      });
      
      const statuses = await Promise.all(statusPromises);
      const statusMap = {};
      statuses.forEach(({ positionId, status }) => {
        statusMap[positionId] = status;
      });
      setVotingStatus(statusMap);
    } catch (error) {
      console.error('Error loading voting status:', error);
    }
  };

  useEffect(() => {
    // Trigger immediate election status refresh
    triggerImmediateRefresh();
    
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId') || JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id;
        
        if (!activeElection) {
          setLoading(false);
          return;
        }

        const [positions, candidates, voters] = await Promise.all([
          getElectionPositions(activeElection.id), // Only positions assigned to this election
          getElectionCandidates(activeElection.id), // Only candidates assigned to this election
          getVoters()
        ]);
        
        setPositions(positions);
        setCandidates(candidates);
        const voter = voters.find(v => v.id === userId);
        setUser(voter);
        setHasVoted(voter?.hasVoted);
      } catch (error) {
        console.error('Error fetching vote data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeElection?.id]);

  // NEW: Load voting status when positions and user are available
  useEffect(() => {
    if (positions.length > 0 && user && activeElection) {
      loadVotingStatus();
    }
  }, [positions, user, activeElection]);

  // ✅ UPDATE: Enhanced candidate selection with voting status
  const handleSelect = (positionId, candidateId) => {
    const currentPosition = positions.find(p => p.id === positionId);
    const currentStatus = votingStatus[positionId];
    
    if (!currentPosition) return;

    const voteLimit = currentPosition.voteLimit || 1;
    const currentVotes = currentStatus?.votingStatus?.currentVotes || 0;
    const remainingVotes = voteLimit - currentVotes;
    
    setSelectedVotes(prev => {
      const currentSelections = prev[positionId] || [];
      
      // Check if candidate is already selected
      if (currentSelections.includes(candidateId)) {
        // Remove selection
        return {
          ...prev,
          [positionId]: currentSelections.filter(id => id !== candidateId)
        };
      }
      
      // Check if we can add more votes based on remaining votes
      if (currentSelections.length >= remainingVotes) {
        alert(`You can only select ${remainingVotes} more candidate(s) for ${currentPosition.name}`);
        return prev;
      }
      
      // Add selection
      return {
        ...prev,
        [positionId]: [...currentSelections, candidateId]
      };
    });
  };

  const handleNext = () => {
    if (currentPositionIndex < positions.length - 1) {
      setCurrentPositionIndex(currentPositionIndex + 1);
    } else {
      // All positions voted on, show confirmation
      setShowConfirmation(true);
    }
  };

  const handlePrevious = () => {
    if (currentPositionIndex > 0) {
      setCurrentPositionIndex(currentPositionIndex - 1);
    }
  };

  const handleFirstConfirmation = () => {
    setShowConfirmation(false);
    setShowIdConfirmation(true);
  };

  // ✅ UPDATE: Enhanced vote submission with better error handling
  const handleIdConfirmation = async () => {
    if (idConfirmation.toLowerCase() !== 'confirm') {
      setError('Please type "CONFIRM" exactly to proceed');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');
    
    if (!user) {
      setError('User information not found. Please log in again.');
      setSubmitting(false);
      return;
    }
    
    const voterId = user.id;
    
    try {
      // Convert selections to vote objects
      const votes = [];
      Object.entries(selectedVotes).forEach(([positionId, candidateIds]) => {
        console.log(`Processing position ${positionId} with candidates:`, candidateIds);
        candidateIds.forEach(candidateId => {
          votes.push({
            electionId: activeElection.id,
            positionId,
            candidateId
          });
        });
      });

      // Check for duplicate votes in the array
      const voteKeys = votes.map(v => `${v.voterId}-${v.electionId}-${v.positionId}-${v.candidateId}`);
      const uniqueKeys = [...new Set(voteKeys)];
      if (voteKeys.length !== uniqueKeys.length) {
        console.error('❌ DUPLICATE VOTES DETECTED:', votes);
        setError('Duplicate votes detected. Please refresh and try again.');
        setSubmitting(false);
        return;
      }

      if (votes.length === 0) {
        setError('Please select at least one candidate before submitting.');
        setSubmitting(false);
        return;
      }

      console.log('Submitting votes:', votes);
      console.log('Vote count by position:');
      const positionCounts = {};
      votes.forEach(vote => {
        positionCounts[vote.positionId] = (positionCounts[vote.positionId] || 0) + 1;
      });
      console.log(positionCounts);
      
      try {
        // Use the new multiple votes API with improved error handling
        const response = await createMultipleVotes({ 
          voterId: voterId,
          votes: votes
        });
        
        console.log('Votes cast successfully:', response);
        
        if (response.success) {
          setSuccess('Your votes have been submitted successfully! Thank you for participating.');
          setHasVoted(true);
          setShowIdConfirmation(false);
          setShowFinalScreen(true);
          
          // Reload voting status to reflect changes
          setTimeout(() => {
            loadVotingStatus();
          }, 1000);
        } else {
          setError(response.message || 'Failed to submit votes');
        }
        
      } catch (error) {
        console.error('Vote submission error:', error);
        
        // Handle specific voting errors with improved error messages
        if (error.response?.data?.errors) {
          const errorMessages = error.response.data.errors.map(err => 
            `Position ${err.positionId}: ${err.error}`
          ).join('\n');
          setError(`Some votes failed:\n${errorMessages}`);
        } else if (error.response?.data?.error) {
          setError(error.response.data.error);
        } else {
          setError(error.message || 'Failed to submit votes');
        }
        
        // Reset submission state but keep the confirmation dialog open
        setSubmitting(false);
        return; // Stop processing on error
      }
      
    } catch (err) {
      console.error('Vote submission error:', err);
      setError(err.message || 'Failed to submit votes');
      setSubmitting(false);
      return;
    } finally {
      setSubmitting(false);
    }
  };

  const getCurrentPosition = () => positions[currentPositionIndex];
  const getCurrentCandidates = () => candidates.filter(c => c.positionId === getCurrentPosition()?.id);
  const isCurrentPositionVoted = () => {
    const currentSelections = selectedVotes[getCurrentPosition()?.id] || [];
    return currentSelections.length > 0;
  };
  const isLastPosition = () => currentPositionIndex === positions.length - 1;
  const allPositionsVoted = () => positions.every(pos => {
    const selections = selectedVotes[pos.id] || [];
    return selections.length > 0;
  });

  const getCurrentSelections = () => selectedVotes[getCurrentPosition()?.id] || [];
  const isCandidateSelected = (candidateId) => {
    const selections = getCurrentSelections();
    return selections.includes(candidateId);
  };

  const getSelectionCount = () => {
    const selections = getCurrentSelections();
    return selections.length;
  };

  const getVoteLimit = () => {
    return getCurrentPosition()?.voteLimit || 1;
  };

  const canSelectMore = () => {
    return getSelectionCount() < getVoteLimit();
  };

  // ✅ NEW: Helper function to get voting status for a position
  const getVotingStatusForPosition = (positionId) => {
    return votingStatus[positionId] || null;
  };

  // ✅ NEW: Helper function to get remaining votes for a position
  const getRemainingVotes = (positionId) => {
    const position = positions.find(p => p.id === positionId);
    const status = getVotingStatusForPosition(positionId);
    
    if (!position || !status) return position?.voteLimit || 0;
    
    return Math.max(0, position.voteLimit - status.votingStatus.currentVotes);
  };

  // ✅ NEW: Helper function to check if candidate is already voted for
  const isCandidateVotedFor = (positionId, candidateId) => {
    const status = getVotingStatusForPosition(positionId);
    if (!status) return false;
    
    return status.candidates.some(c => c.id === candidateId && c.isVotedFor);
  };

  // ✅ NEW: Helper function to get vote progress text
  const getVoteProgressText = (positionId) => {
    const position = positions.find(p => p.id === positionId);
    const status = getVotingStatusForPosition(positionId);
    
    if (!position || !status) return '';
    
    const { currentVotes, remainingVotes } = status.votingStatus;
    const totalVotes = position.voteLimit;
    
    if (currentVotes === 0) {
      return `Vote for up to ${totalVotes} candidate(s)`;
    } else if (remainingVotes === 0) {
      return `You have voted for all ${currentVotes} candidate(s)`;
    } else {
      return `Voted: ${currentVotes}/${totalVotes}, Remaining: ${remainingVotes}`;
    }
  };

  if (loading) {
    return (
      <div className="vote-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading voting interface...</p>
      </div>
    );
  }

  // Check if user can vote (has active election)
  if (!canVote) {
    return <ElectionStatusMessage type="vote" />;
  }

  // Check if user is found in voters list
  if (!user) {
    return (
      <div className="vote-error">
        <div className="alert alert-danger text-center">
          <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
          <h4>User Not Found</h4>
          <p>Your account was not found in the voters list.</p>
          <p className="mb-0">Please contact an administrator to register you as a voter.</p>
        </div>
      </div>
    );
  }

  if (hasVoted && !showFinalScreen) {
    return (
      <div className="vote-locked-container">
        <div className="vote-locked-content">
          <div className="vote-locked-icon">
            <i className="fas fa-lock"></i>
          </div>
          <h2>Voting Complete</h2>
          <p>You have already cast your votes. Thank you for participating in the election!</p>
          <div className="vote-locked-actions">
            <button className="btn btn-primary" onClick={() => navigate('/results')}>
              <i className="fas fa-chart-bar me-2"></i>
              View Results
            </button>
            <button className="btn btn-outline-primary" onClick={() => navigate('/user/dashboard')}>
              <i className="fas fa-home me-2"></i>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showFinalScreen) {
    return (
      <div className="vote-final-screen">
        <div className="vote-final-content">
          <div className="vote-final-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h2>Vote Confirmed!</h2>
          <p>Your votes have been successfully recorded and submitted. Thank you for participating in the election.</p>
          <div className="vote-final-info">
            <p><strong>Student ID:</strong> {user?.studentId}</p>
            <p><strong>Voter Name:</strong> {user?.name}</p>
            <p><strong>Submission Time:</strong> {new Date().toLocaleString()}</p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/user/dashboard')}>
            <i className="fas fa-home me-2"></i>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="vote-no-positions">
        <div className="vote-no-positions-content">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>No Positions Available</h2>
          <p>There are no voting positions available at the moment. Please check back later.</p>
                      <button className="btn btn-outline-primary" onClick={() => navigate('/user/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vote-container">
      {/* Progress Bar */}
      <div className="vote-progress">
        <div className="vote-progress-bar">
          <div 
            className="vote-progress-fill" 
            style={{ width: `${((currentPositionIndex + 1) / positions.length) * 100}%` }}
          ></div>
        </div>
        <div className="vote-progress-text">
          Position {currentPositionIndex + 1} of {positions.length}
        </div>
      </div>

      {/* Current Position */}
      <div className="vote-position-section">
        <h2 className="vote-position-title">
          {getCurrentPosition()?.name}
        </h2>
        
        {/* ✅ NEW: Voting Status Information */}
        <div className="vote-status-info">
          <p className="vote-position-subtitle">
            {getVoteProgressText(getCurrentPosition()?.id)}
          </p>
          
          {/* Show remaining votes if any */}
          {getRemainingVotes(getCurrentPosition()?.id) > 0 && (
            <div className="vote-remaining-info">
              <span className="badge bg-info">
                {getRemainingVotes(getCurrentPosition()?.id)} vote(s) remaining
              </span>
            </div>
          )}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="vote-candidates-grid">
          {getCurrentCandidates().map((candidate, index) => {
            const isVotedFor = isCandidateVotedFor(getCurrentPosition()?.id, candidate.id);
            const isSelected = isCandidateSelected(candidate.id);
            
            return (
              <div 
                key={candidate.id} 
                className={`vote-candidate-card-modern ${isSelected ? 'selected' : ''} ${isVotedFor ? 'voted-for' : ''} ${!isSelected && !canSelectMore() ? 'disabled' : ''}`}
                onClick={() => handleSelect(getCurrentPosition()?.id, candidate.id)}
              >
                <div className="vote-candidate-card-header">
                  <div className="vote-candidate-rank-badge">
                    <span className="rank-number">{index + 1}</span>
                  </div>
                  
                  {/* ✅ NEW: Show voted badge if already voted for */}
                  {isVotedFor && (
                    <div className="vote-candidate-voted-badge">
                      <i className="fas fa-check-circle"></i>
                      <span>Voted</span>
                    </div>
                  )}
                  
                  <div className="vote-candidate-photo-container">
                    {candidate.photoUrl && !imgError[candidate.id] ? (
                      <img 
                        src={getImageUrl(candidate.photoUrl)}
                        alt={candidate.name} 
                        className="vote-candidate-photo"
                        onError={e => {
                          setImgError(prev => ({ ...prev, [candidate.id]: true }));
                          e.target.style.display = 'none';
                          const placeholder = e.target.parentNode?.querySelector('.candidate-photo-placeholder');
                          if (placeholder) {
                            placeholder.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <CandidatePhotoPlaceholder className="candidate-photo-placeholder" style={{ display: candidate.photoUrl && !imgError[candidate.id] ? 'none' : 'flex' }} />
                  </div>
                  <div className="vote-candidate-overlay">
                    <h3 className="vote-candidate-overlay-name">
                      {candidate.name}
                      <span className="verified"><i className="fas fa-check-circle"></i></span>
                    </h3>
                    <div className="vote-candidate-overlay-position">{candidate.positionName}</div>
                    <p className="vote-candidate-overlay-description">
                      {candidate.description ? 
                        candidate.description.substring(0, 120) + (candidate.description.length > 120 ? '...' : '') :
                        'Learn more about this candidate and their vision for the position.'
                      }
                    </p>
                  </div>
                  <div className="vote-candidate-selection-overlay">
                    <input
                      type={getVoteLimit() === 1 ? "radio" : "checkbox"}
                      name={`position-${getCurrentPosition()?.id}`}
                      value={candidate.id}
                      checked={isSelected}
                      onChange={() => handleSelect(getCurrentPosition()?.id, candidate.id)}
                      disabled={!isSelected && !canSelectMore()}
                      className="vote-selection-input"
                    />
                    <span className={`vote-selection-indicator ${getVoteLimit() === 1 ? 'radio-custom' : 'checkbox-custom'}`}></span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {getCurrentCandidates().length === 0 && (
          <div className="vote-no-candidates">
            <i className="fas fa-user-slash"></i>
            <p>No candidates available for this position.</p>
          </div>
        )}

        {getVoteLimit() > 1 && (
          <div className="vote-limit-info">
            <div className="vote-limit-progress">
              <div className="vote-limit-bar">
                <div 
                  className="vote-limit-fill" 
                  style={{ width: `${(getSelectionCount() / getVoteLimit()) * 100}%` }}
                ></div>
              </div>
              <span className="vote-limit-text">
                {getSelectionCount()} of {getVoteLimit()} candidates selected
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="vote-navigation">
        <button 
          className="btn btn-outline-secondary" 
          onClick={handlePrevious}
          disabled={currentPositionIndex === 0}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Previous
        </button>
        
        <div className="vote-navigation-center">
          <button 
            className="btn btn-outline-info btn-sm"
            onClick={() => setShowVoteSummary(!showVoteSummary)}
          >
            <i className={`fas ${showVoteSummary ? 'fa-eye-slash' : 'fa-eye'} me-2`}></i>
            {showVoteSummary ? 'Hide Summary' : 'Show Summary'}
            {!showVoteSummary && (
              <span className="summary-count-badge">
                {positions.filter(pos => selectedVotes[pos.id]?.length > 0).length}/{positions.length}
              </span>
            )}
          </button>
        </div>
        
        <button 
          className="btn btn-primary" 
          onClick={handleNext}
          disabled={!isCurrentPositionVoted()}
        >
          {isLastPosition() ? (
            <>
              <i className="fas fa-check me-2"></i>
              Review & Submit
            </>
          ) : (
            <>
              Next
              <i className="fas fa-arrow-right ms-2"></i>
            </>
          )}
        </button>
      </div>

      {/* Collapsible Vote Summary */}
      {showVoteSummary && (
        <div className="vote-summary-collapsible">
          <div className="vote-summary-header">
            <h4>Your Votes Summary</h4>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setShowVoteSummary(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="vote-summary-list">
            {positions.map((pos, index) => {
              const selectedCandidates = candidates.filter(c => selectedVotes[pos.id]?.includes(c.id));
              return (
                <div key={pos.id} className={`vote-summary-item ${index === currentPositionIndex ? 'current' : ''}`}>
                  <span className="vote-summary-position">{pos.name}:</span>
                  <div className="vote-summary-candidates">
                    {selectedCandidates.length > 0 ? (
                      <div className="selected-candidates-grid">
                        {selectedCandidates.map(candidate => (
                          <div key={candidate.id} className="selected-candidate-item">
                            <div className="candidate-avatar-wrapper">
                            {candidate.photoUrl && !imgError[candidate.id] ? (
                              <img 
                                  src={getImageUrl(candidate.photoUrl)} 
                                alt={candidate.name} 
                                className="selected-candidate-photo"
                                onError={() => setImgError(prev => ({ ...prev, [candidate.id]: true }))}
                              />
                            ) : (
                                <CandidatePhotoPlaceholder className="selected-candidate-photo-placeholder" />
                              )}
                              </div>
                            <span className="selected-candidate-name">{candidate.name}</span>
                          </div>
                        ))}
                        {selectedCandidates.length > 3 && (
                          <div className="candidate-count-badge">
                            +{selectedCandidates.length - 3}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="vote-summary-candidate">Not selected</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* First Confirmation Modal */}
      {showConfirmation && (
        <div className="vote-confirmation-overlay">
          <div className="vote-confirmation-modal">
            <div className="vote-confirmation-header">
              <i className="fas fa-exclamation-triangle text-warning"></i>
              <h3>First Confirmation</h3>
            </div>
            <div className="vote-confirmation-body">
              <p><strong>Warning:</strong> You cannot change your votes after submission.</p>
              <div className="vote-confirmation-summary">
                <h5>Vote Summary:</h5>
                {positions.map(pos => {
                  const selectedCandidates = candidates.filter(c => selectedVotes[pos.id]?.includes(c.id));
                  return (
                    <div key={pos.id} className="vote-confirmation-item">
                      <strong>{pos.name}:</strong>
                      <div className="confirmation-candidates">
                        {selectedCandidates.length > 0 ? (
                          <div className="confirmation-candidates-grid">
                            {selectedCandidates.map(candidate => (
                              <div key={candidate.id} className="confirmation-candidate-item">
                                <div className="candidate-avatar-wrapper">
                                {candidate.photoUrl && !imgError[candidate.id] ? (
                                  <img 
                                      src={getImageUrl(candidate.photoUrl)} 
                                    alt={candidate.name} 
                                    className="confirmation-candidate-photo"
                                    onError={() => setImgError(prev => ({ ...prev, [candidate.id]: true }))}
                                  />
                                ) : (
                                    <CandidatePhotoPlaceholder className="confirmation-candidate-photo-placeholder" />
                                  )}
                                  </div>
                                <span className="confirmation-candidate-name">{candidate.name}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span>Not selected</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="vote-confirmation-actions">
              <button 
                className="btn btn-outline-secondary" 
                onClick={() => setShowConfirmation(false)}
              >
                Review Again
              </button>
              <button 
                className="btn btn-warning" 
                onClick={handleFirstConfirmation}
              >
                <i className="fas fa-arrow-right me-2"></i>
                Proceed to ID Confirmation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ID Confirmation Modal */}
      {showIdConfirmation && (
        <div className="vote-confirmation-overlay">
          <div className="vote-confirmation-modal">
            <div className="vote-confirmation-header">
              <i className="fas fa-shield-alt text-danger"></i>
              <h3>Final ID Confirmation</h3>
            </div>
            <div className="vote-confirmation-body">
              <div className="id-confirmation-section">
                <p><strong>Student ID Verification:</strong></p>
                <p className="student-id-display">{user?.studentId}</p>
                <p>To finalize your vote submission, please type <strong>"CONFIRM"</strong> in the field below:</p>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type CONFIRM here..."
                  value={idConfirmation}
                  onChange={(e) => setIdConfirmation(e.target.value)}
                  style={{ textTransform: 'uppercase' }}
                />
                {error && <div className="alert alert-danger mt-2">{error}</div>}
              </div>
              <div className="vote-confirmation-summary">
                <h5>Final Vote Summary:</h5>
                {positions.map(pos => {
                  const selectedCandidates = candidates.filter(c => selectedVotes[pos.id]?.includes(c.id));
                  return (
                    <div key={pos.id} className="vote-confirmation-item">
                      <strong>{pos.name}:</strong>
                      <div className="confirmation-candidates">
                        {selectedCandidates.length > 0 ? (
                          <div className="confirmation-candidates-grid">
                            {selectedCandidates.map(candidate => (
                              <div key={candidate.id} className="confirmation-candidate-item">
                                <div className="candidate-avatar-wrapper">
                                {candidate.photoUrl && !imgError[candidate.id] ? (
                                  <img 
                                      src={getImageUrl(candidate.photoUrl)} 
                                    alt={candidate.name} 
                                    className="confirmation-candidate-photo"
                                    onError={() => setImgError(prev => ({ ...prev, [candidate.id]: true }))}
                                  />
                                ) : (
                                    <CandidatePhotoPlaceholder className="confirmation-candidate-photo-placeholder" />
                                  )}
                                  </div>
                                <span className="confirmation-candidate-name">{candidate.name}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span>Not selected</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="vote-confirmation-actions">
              <button 
                className="btn btn-outline-secondary" 
                onClick={() => {
                  setShowIdConfirmation(false);
                  setShowConfirmation(true);
                  setError('');
                }}
                disabled={submitting}
              >
                Go Back
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleIdConfirmation}
                disabled={submitting || idConfirmation.toLowerCase() !== 'confirm'}
              >
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check me-2"></i>
                    Final Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vote; 