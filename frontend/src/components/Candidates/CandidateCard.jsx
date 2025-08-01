import React from 'react';
import { CandidateImage } from '../../utils/image';

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
        <CandidateImage 
          photoUrl={candidate.photoUrl}
          alt={candidate.name}
          className="candidate-photo"
          size="normal"
        />
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
            className="btn btn-outline-primary"
            onClick={() => onView(candidate)}
            title="View Details"
            style={{ 
              fontSize: '0.75rem', 
              padding: '0.25rem 0.5rem', 
              lineHeight: '1.2',
              borderRadius: '0.25rem'
            }}
          >
            <i className="fas fa-eye" style={{ fontSize: '0.7rem' }}></i>
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => onEdit(candidate)}
            title="Edit Candidate"
            style={{ 
              fontSize: '0.75rem', 
              padding: '0.25rem 0.5rem', 
              lineHeight: '1.2',
              borderRadius: '0.25rem'
            }}
          >
            <i className="fas fa-edit" style={{ fontSize: '0.7rem' }}></i>
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={() => onDelete(candidate.id)}
            title="Delete Candidate"
            style={{ 
              fontSize: '0.75rem', 
              padding: '0.25rem 0.5rem', 
              lineHeight: '1.2',
              borderRadius: '0.25rem'
            }}
          >
            <i className="fas fa-trash" style={{ fontSize: '0.7rem' }}></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default CandidateCard;