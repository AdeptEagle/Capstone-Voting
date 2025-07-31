import React from 'react';

const DeleteConfirmationModal = ({ 
  show, 
  election, 
  deleteConfirmation, 
  setDeleteConfirmation, 
  onConfirm, 
  onCancel, 
  isDeleting 
}) => {
  if (!show || !election) return null;

  return (
    <>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Delete Ballot
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onCancel}
              ></button>
            </div>
            <div className="modal-body">
              <div className="alert alert-danger">
                <h6 className="alert-heading">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Warning: This action cannot be undone!
                </h6>
                <p className="mb-0">
                  You are about to permanently delete the ballot <strong>"{election.title}"</strong>.
                </p>
              </div>
              
              <p>This will permanently remove:</p>
              <ul className="text-danger">
                <li>All election data</li>
                <li>All votes cast by voters</li>
                <li>All candidate assignments</li>
                <li>All position assignments</li>
              </ul>
              
              <div className="mb-3">
                <label className="form-label">
                  Type <strong>"{election.title}"</strong> to confirm deletion:
                </label>
                <input
                  type="text"
                  className={`form-control ${deleteConfirmation && deleteConfirmation !== election.title ? 'is-invalid' : ''}`}
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder={`Type "${election.title}" to confirm`}
                  autoFocus
                />
                {deleteConfirmation && deleteConfirmation !== election.title && (
                  <div className="invalid-feedback">
                    Confirmation text does not match the ballot name.
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
                disabled={deleteConfirmation !== election.title || isDeleting}
              >
                {isDeleting ? (
                  <i className="fas fa-spinner fa-spin me-1"></i>
                ) : (
                  <i className="fas fa-trash me-1"></i>
                )}
                Delete Ballot
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default DeleteConfirmationModal;