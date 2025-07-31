import React, { useState } from 'react';

const PositionDeleteModal = ({ 
  show, 
  position, 
  positions = [], 
  onConfirm, 
  onCancel, 
  isDeleting = false 
}) => {
  const [confirmText, setConfirmText] = useState('');
  
  if (!show || !position) return null;

  const isMultiple = Array.isArray(position);
  const positionCount = isMultiple ? position.length : 1;
  const positionNames = isMultiple 
    ? position.map(p => positions.find(pos => pos.id === p)?.name || p).join(', ')
    : position.name;

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
              Confirm Position Deletion
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
              You are about to delete{' '}
              <strong>
                {positionCount} position{positionCount > 1 ? 's' : ''}
              </strong>:
            </p>
            
            <div className="bg-light p-3 rounded mb-3">
              <small className="text-muted">Position{positionCount > 1 ? 's' : ''} to delete:</small>
              <div className="fw-bold text-danger">
                {positionNames}
              </div>
            </div>

            <div className="alert alert-warning">
              <i className="fas fa-info-circle me-2"></i>
              <strong>Impact:</strong> All candidates associated with {positionCount > 1 ? 'these positions' : 'this position'} will also be affected.
            </div>

            <div className="mb-3">
              <label className="form-label">
                <strong>Type "DELETE" to confirm:</strong>
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
                  Deleting...
                </>
              ) : (
                <>
                  <i className="fas fa-trash me-1"></i>
                  Delete Position{positionCount > 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionDeleteModal;