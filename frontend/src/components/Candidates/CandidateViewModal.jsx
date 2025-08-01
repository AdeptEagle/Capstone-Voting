import React from 'react';
import { CandidateImage } from '../../utils/image';
import './CandidateViewModal.css';

const CandidateViewModal = ({ 
  candidate,
  onClose,
  onEdit,
  showActions = true 
}) => {
  if (!candidate) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-user me-2"></i>
              Candidate Profile
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            />
          </div>
          
          <div className="modal-body">
            <div className="row">
              <div className="col-md-4 text-center">
                <div className="candidate-profile-photo mb-3">
                  <CandidateImage
                    photoUrl={candidate.photoUrl}
                    alt={candidate.name}
                    className="rounded-circle img-thumbnail"
                    style={{ 
                      width: '200px', 
                      height: '200px',
                      objectFit: 'cover'
                    }}
                    size="xl"
                  />
                </div>
                <h4 className="candidate-profile-name">{candidate.name}</h4>
                <div className="candidate-profile-position badge bg-primary">
                  {candidate.positionName || 'No Position'}
                </div>
              </div>
              
              <div className="col-md-8">
                <div className="candidate-details">
                  <div className="detail-group mb-4">
                    <h5 className="text-primary mb-3">
                      <i className="fas fa-info-circle me-2"></i>
                      Basic Information
                    </h5>
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <div className="detail-item">
                          <label className="detail-label">
                            <i className="fas fa-certificate text-muted me-2"></i>
                            Position
                          </label>
                          <div className="detail-value">
                            {candidate.positionName || 'No Position'}
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="detail-item">
                          <label className="detail-label">
                            <i className="fas fa-building text-muted me-2"></i>
                            Department
                          </label>
                          <div className="detail-value">
                            {candidate.departmentId || 'N/A'}
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="detail-item">
                          <label className="detail-label">
                            <i className="fas fa-graduation-cap text-muted me-2"></i>
                            Course
                          </label>
                          <div className="detail-value">
                            {candidate.courseId || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="detail-group">
                    <h5 className="text-primary mb-3">
                      <i className="fas fa-bullhorn me-2"></i>
                      Platform
                    </h5>
                    <div className="platform-content p-3 bg-light rounded">
                      {candidate.description ? (
                        <p className="candidate-description mb-0">
                          {candidate.description}
                        </p>
                      ) : (
                        <p className="text-muted mb-0 text-center">
                          No platform statement available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            {showActions && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onEdit(candidate)}
              >
                <i className="fas fa-edit me-2"></i>
                Edit Candidate
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateViewModal;