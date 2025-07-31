import React, { useState } from 'react';

const CourseDeleteModal = ({ 
  show, 
  course, 
  department,
  onConfirm, 
  onCancel, 
  isDeleting = false 
}) => {
  const [confirmText, setConfirmText] = useState('');
  
  if (!show || !course) return null;

  const expectedText = 'DELETE';
  const isConfirmed = confirmText.toUpperCase() === expectedText;

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
      setConfirmText('');
    }
  };

  const handleCancel = () => {
    setConfirmText('');
    onCancel();
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Confirm Course Deletion
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleCancel}
              disabled={isDeleting}
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="alert alert-danger">
              <i className="fas fa-warning me-2"></i>
              <strong>Warning:</strong> This action cannot be undone!
            </div>
            
            <p className="mb-3">
              You are about to delete the course:
            </p>
            
            <div className="bg-light p-3 rounded mb-3">
              <div className="d-flex align-items-center">
                <i className="fas fa-graduation-cap text-success me-2"></i>
                <div>
                  <strong className="text-danger">{course.name}</strong>
                  <small className="text-muted d-block">
                    ID: {course.id}
                    {department && (
                      <span> • Department: {department.name}</span>
                    )}
                  </small>
                </div>
              </div>
            </div>

            <div className="alert alert-warning">
              <i className="fas fa-users me-2"></i>
              <strong>Impact:</strong> All voters enrolled in this course will be affected and may need to be reassigned.
            </div>

            <div className="mb-3">
              <label className="form-label">
                <strong>Type "DELETE" to confirm course deletion:</strong>
              </label>
              <input
                type="text"
                className={`form-control ${confirmText && !isConfirmed ? 'is-invalid' : isConfirmed ? 'is-valid' : ''}`}
                placeholder="Type DELETE to confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                disabled={isDeleting}
                autoFocus
              />
              {confirmText && !isConfirmed && (
                <div className="invalid-feedback">
                  Please type "DELETE" exactly as shown
                </div>
              )}
            </div>
          </div>
          
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={isDeleting}
            >
              <i className="fas fa-times me-1"></i>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleConfirm}
              disabled={!isConfirmed || isDeleting}
            >
              {isDeleting ? (
                <>
                  <i className="fas fa-spinner fa-spin me-1"></i>
                  Deleting Course...
                </>
              ) : (
                <>
                  <i className="fas fa-trash me-1"></i>
                  Delete Course
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDeleteModal;