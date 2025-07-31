import React from 'react';
import { getImageUrl } from '../../utils/image';

const CandidateCard = ({ 
  candidate, 
  onView, 
  onEdit, 
  onDelete, 
  onSelect, 
  isSelected = false,
  showActions = true,
  showSelection = false 
}) => {
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  const handleImageLoad = (e) => {
    e.target.style.display = 'block';
    e.target.nextSibling.style.display = 'none';
  };

  return (
    <div className="candidate-card">
      {showSelection && (
        <div className="candidate-selection">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(candidate.id, e.target.checked)}
            className="form-check-input"
          />
        </div>
      )}
      
      <div className="candidate-photo-container" onClick={() => onView(candidate)}>
        {candidate.photoUrl ? (
          <>
            <img
              src={getImageUrl(candidate.photoUrl)}
              alt={candidate.name}
              className="candidate-photo"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            <div className="candidate-photo-placeholder" style={{ display: 'none' }}>
              <i className="fas fa-user"></i>
            </div>
          </>
        ) : (
          <div className="candidate-photo-placeholder">
            <i className="fas fa-user"></i>
          </div>
        )}
      </div>

      <div className="candidate-info">
        <h5 className="candidate-name" onClick={() => onView(candidate)}>
          {candidate.name}
        </h5>
        <p className="candidate-position">
          {candidate.positionName || 'No Position'}
        </p>
        <div className="candidate-details">
          <small className="text-muted">
            <i className="fas fa-building me-1"></i>
            {candidate.departmentId}
          </small>
          {candidate.courseId && (
            <small className="text-muted d-block">
              <i className="fas fa-graduation-cap me-1"></i>
              {candidate.courseId}
            </small>
          )}
        </div>
        
        {candidate.description && (
          <p className="candidate-description">
            {candidate.description.length > 100 
              ? `${candidate.description.substring(0, 100)}...` 
              : candidate.description
            }
          </p>
        )}
      </div>

      {showActions && (
        <div className="candidate-actions">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => onView(candidate)}
            title="View Details"
          >
            <i className="fas fa-eye"></i>
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => onEdit(candidate)}
            title="Edit Candidate"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => onDelete(candidate.id)}
            title="Delete Candidate"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default CandidateCard;