import React from 'react';
import { CandidateImage } from '../../utils/image';
import './CandidateCard.css';

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
    <div className="modern-card candidate-card">
      <div className="candidate-card-header">
        <div className="candidate-card-info">
          <h3 className="candidate-card-name">{candidate.name}</h3>
          <div className="candidate-card-position">{candidate.positionName || 'No Position'}</div>
        </div>
        <div className="candidate-card-actions">
          <button 
            className="view-platform-btn"
            onClick={() => onView(candidate)}
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
          <span>{candidate.departmentId}</span>
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

      {showSelection && (
        <div className="candidate-selection">
          <label className="selection-checkbox">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(candidate.id, e.target.checked)}
            />
            <span className="checkmark"></span>
          </label>
        </div>
      )}
    </div>
  );
};

export default CandidateCard;