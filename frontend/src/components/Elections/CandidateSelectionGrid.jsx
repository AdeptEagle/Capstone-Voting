import React from 'react';
import { getImageUrl } from '../../utils/image';

const CandidateSelectionGrid = ({ 
  candidates, 
  selectedCandidateIds, 
  onCandidateSelection,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        Loading candidates...
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="alert alert-info">
        <i className="fas fa-info-circle me-2"></i>
        No candidates available. You can create new candidates in the previous step.
      </div>
    );
  }

  return (
    <div className="candidate-selection-grid">
      {candidates.map((candidate) => (
        <div key={candidate.id} className="candidate-selection-card">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={`candidate-${candidate.id}`}
              checked={selectedCandidateIds.includes(candidate.id)}
              onChange={(e) => onCandidateSelection(candidate.id, e.target.checked)}
            />
            <label className="form-check-label w-100" htmlFor={`candidate-${candidate.id}`}>
              <div className="candidate-card-header">
                <div className="candidate-photo-container">
                  {candidate.photoUrl && candidate.photoUrl.trim() !== '' ? (
                    <img
                      src={getImageUrl(candidate.photoUrl)}
                      alt={candidate.name}
                      className="candidate-photo"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const placeholder = e.target.nextSibling;
                        if (placeholder) {
                          placeholder.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div 
                    className="candidate-photo-placeholder" 
                    style={{ 
                      display: candidate.photoUrl && candidate.photoUrl.trim() !== '' ? 'none' : 'flex' 
                    }}
                  >
                    <i className="fas fa-user"></i>
                  </div>
                </div>
              </div>
              <div className="candidate-card-body">
                <div className="candidate-info">
                  <div className="candidate-name">
                    {candidate.name}
                  </div>
                  <div className="candidate-position">
                    {candidate.positionName}
                  </div>
                  {candidate.departmentName && (
                    <div className="candidate-department">
                      <small className="text-muted">
                        <i className="fas fa-building me-1"></i>
                        {candidate.departmentName}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CandidateSelectionGrid;