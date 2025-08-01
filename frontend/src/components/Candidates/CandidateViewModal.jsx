import React from 'react';
import { CandidateImage } from '../../utils/image';

const CandidateViewModal = ({ 
  candidate, 
  show, 
  onClose, 
  onEdit, 
  showActions = true 
}) => {
  if (!show || !candidate) return null;

  return (
    <>
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
                      className="rounded-circle"
                      style={{ 
                        width: '200px', 
                        height: '200px',
                        objectFit: 'cover',
                        border: '4px solid #e9ecef'
                      }}
                      size="xl"
                    />
                  </div>
                  <h4 className="candidate-profile-name">{candidate.name}</h4>
                  <p className="candidate-profile-position text-muted">
                    {candidate.positionName || 'No Position'}
                  </p>
                </div>
                
                <div className="col-md-8">
                  <div className="candidate-details">
                    <h3 className="mb-3">{candidate.name}</h3>
                    
                    <div className="detail-group mb-4">
                      <h5 className="text-primary mb-3">
                        <i className="fas fa-info-circle me-2"></i>
                        Basic Information
                      </h5>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="detail-item mb-3">
                            <label className="detail-label">Position:</label>
                            <span className="detail-value">
                              {candidate.positionName || 'No Position'}
                            </span>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="detail-item mb-3">
                            <label className="detail-label">Department:</label>
                            <span className="detail-value">
                              {candidate.departmentId || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="detail-item mb-3">
                            <label className="detail-label">Course:</label>
                            <span className="detail-value">
                              {candidate.courseId || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {candidate.description && (
                      <div className="detail-group mb-4">
                        <h5 className="text-primary mb-3">
                          <i className="fas fa-file-text me-2"></i>
                          Description
                        </h5>
                        <p className="candidate-description">
                          {candidate.description}
                        </p>
                      </div>
                    )}

                    <div className="detail-group">
                      <h5 className="text-primary mb-3">
                        <i className="fas fa-chart-bar me-2"></i>
                        Quick Stats
                      </h5>
                      <div className="row">
                        <div className="col-sm-4">
                          <div className="stat-card text-center p-3 border rounded">
                            <div className="stat-number h4 mb-1 text-success">
                              <i className="fas fa-check-circle"></i>
                            </div>
                            <div className="stat-label small text-muted">Active</div>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="stat-card text-center p-3 border rounded">
                            <div className="stat-number h4 mb-1 text-primary">
                              <i className="fas fa-calendar"></i>
                            </div>
                            <div className="stat-label small text-muted">Registered</div>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="stat-card text-center p-3 border rounded">
                            <div className="stat-number h4 mb-1 text-info">
                              <i className="fas fa-user-check"></i>
                            </div>
                            <div className="stat-label small text-muted">Verified</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {showActions && (
              <div className="modal-footer">
                <div className="d-flex justify-content-between w-100">
                  <div className="modal-actions">
                    <button 
                      className="btn btn-outline-primary me-2" 
                      onClick={() => onEdit(candidate)}
                    >
                      <i className="fas fa-edit me-2"></i>Edit
                    </button>
                    <button className="btn btn-outline-info me-2">
                      <i className="fas fa-share me-2"></i>Share
                    </button>
                  </div>
                  <button className="btn btn-secondary" onClick={onClose}>
                    <i className="fas fa-times me-2"></i>Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateViewModal;