import React, { useState } from 'react';

const BulkDeleteModal = ({ 
  show, 
  items = [], 
  itemType = 'items',
  onConfirm, 
  onCancel, 
  isDeleting = false,
  getItemDisplayName = (item) => item.name || item.id || 'Unknown'
}) => {
  const [confirmText, setConfirmText] = useState('');
  
  if (!show || items.length === 0) return null;

  const expectedText = 'DELETE';
  const isConfirmed = confirmText.toUpperCase() === expectedText;
  const itemCount = items.length;

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

  // Get display names for items (show first 10, then "and X more")
  const displayItems = items.slice(0, 10);
  const remainingCount = Math.max(0, items.length - 10);

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Bulk Delete Confirmation
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
              <strong className="text-danger">
                {itemCount} {itemType}{itemCount > 1 ? 's' : ''}
              </strong>:
            </p>
            
            <div className="bg-light p-3 rounded mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <small className="text-muted fw-bold">
                {itemType.charAt(0).toUpperCase() + itemType.slice(1)}{itemCount > 1 ? 's' : ''} to delete:
              </small>
              <div className="mt-2">
                {displayItems.map((item, index) => (
                  <div key={index} className="text-danger fw-bold mb-1">
                    • {getItemDisplayName(item)}
                  </div>
                ))}
                {remainingCount > 0 && (
                  <div className="text-muted fst-italic">
                    ... and {remainingCount} more {itemType}{remainingCount > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>

            <div className="alert alert-warning">
              <i className="fas fa-info-circle me-2"></i>
              <strong>Impact:</strong> Deleting multiple {itemType}s may affect related data and cannot be reversed.
            </div>

            <div className="mb-3">
              <label className="form-label">
                <strong>Type "DELETE" to confirm bulk deletion:</strong>
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

            <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
              <div>
                <strong>Selection Summary:</strong>
              </div>
              <div className="text-end">
                <span className="badge bg-danger fs-6">
                  {itemCount} {itemType}{itemCount > 1 ? 's' : ''} selected
                </span>
              </div>
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
                  Deleting {itemCount} {itemType}{itemCount > 1 ? 's' : ''}...
                </>
              ) : (
                <>
                  <i className="fas fa-trash me-1"></i>
                  Delete {itemCount} {itemType}{itemCount > 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkDeleteModal;