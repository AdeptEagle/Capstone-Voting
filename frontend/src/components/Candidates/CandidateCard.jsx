import React from 'react';
import { CandidateImage } from '../../utils/image';
import './CandidateCard.css';

const CandidateCard = ({ candidate, onView, showSelection = false, isSelected = false, onSelect }) => {
  return (
    <div className="candidate-card">
      <div className="candidate-number">{candidate.number || 1}</div>
      
      <div className="candidate-photo-container">
        <CandidateImage
          photoUrl={candidate.photoUrl}
          alt={candidate.name}
          className="candidate-photo"
        />
      </div>

      <div className="candidate-info">
        <h3 className="candidate-name">{candidate.name}</h3>
        <div className="candidate-position">{candidate.positionName || 'No Position'}</div>
        
        <div className="candidate-details">
          <div className="detail-item">
            <i className="fas fa-building"></i>
            <span>{candidate.departmentId || 'No Department'}</span>
          </div>
          {candidate.courseId && (
            <div className="detail-item">
              <i className="fas fa-graduation-cap"></i>
              <span>{candidate.courseId}</span>
            </div>
          )}
        </div>

        <button
          className="view-platform-btn"
          onClick={() => onView(candidate)}
          title="View Platform"
        >
          View Platform
        </button>

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
    </div>
  );
};

export default CandidateCard;