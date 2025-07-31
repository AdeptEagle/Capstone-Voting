import React from 'react';

const PositionFormModal = ({ 
  show, 
  editingPosition, 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  error = '',
  existingPositions = []
}) => {
  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Check for duplicate names
  const isDuplicateName = () => {
    if (!formData.name.trim()) return false;
    
    const duplicates = existingPositions.filter(pos => 
      pos.name.toLowerCase() === formData.name.toLowerCase() &&
      (!editingPosition || pos.id !== editingPosition.id)
    );
    
    return duplicates.length > 0;
  };

  // Check for duplicate IDs
  const isDuplicateId = () => {
    if (!formData.id.trim() || editingPosition) return false;
    
    return existingPositions.some(pos => 
      pos.id.toLowerCase() === formData.id.toLowerCase()
    );
  };

  const duplicateName = isDuplicateName();
  const duplicateId = isDuplicateId();
  const hasErrors = duplicateName || duplicateId || !formData.name.trim() || (!editingPosition && !formData.id.trim());

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className={`fas ${editingPosition ? 'fa-edit' : 'fa-plus'} me-2`}></i>
              {editingPosition ? 'Edit Position' : 'Create New Position'}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
              disabled={isLoading}
            ></button>
          </div>
          
          <form onSubmit={onSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {!editingPosition && (
                <div className="mb-3">
                  <label className="form-label">
                    Position ID <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${duplicateId ? 'is-invalid' : formData.id.trim() ? 'is-valid' : ''}`}
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    placeholder="e.g., PRES, VP, SEC"
                    required
                    disabled={isLoading}
                    maxLength={20}
                  />
                  {duplicateId && (
                    <div className="invalid-feedback">
                      This Position ID already exists. Please choose a different one.
                    </div>
                  )}
                  <small className="text-muted">
                    Unique identifier for this position (letters, numbers, underscores only)
                  </small>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">
                  Position Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${duplicateName ? 'is-invalid' : formData.name.trim() ? 'is-valid' : ''}`}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., President, Vice President, Secretary"
                  required
                  disabled={isLoading}
                  maxLength={100}
                />
                {duplicateName && (
                  <div className="invalid-feedback">
                    A position with this name already exists. Please choose a different name.
                  </div>
                )}
                <small className="text-muted">
                  Display name for this position
                </small>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Vote Limit <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="voteLimit"
                  value={formData.voteLimit}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required
                  disabled={isLoading}
                />
                <small className="text-muted">
                  Maximum number of candidates voters can select for this position (1-10)
                </small>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Display Order
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  min="0"
                  disabled={isLoading}
                />
                <small className="text-muted">
                  Order in which this position appears on ballots (0 = first)
                </small>
              </div>

              {/* Preview Section */}
              {formData.name && !duplicateName && (
                <div className="alert alert-info">
                  <h6 className="alert-heading">
                    <i className="fas fa-eye me-1"></i>
                    Preview
                  </h6>
                  <p className="mb-1">
                    <strong>Position:</strong> {formData.name}
                  </p>
                  <p className="mb-1">
                    <strong>Vote Limit:</strong> {formData.voteLimit} candidate{formData.voteLimit > 1 ? 's' : ''}
                  </p>
                  <p className="mb-0">
                    <strong>Display Order:</strong> {formData.displayOrder || 0}
                  </p>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
                disabled={isLoading}
              >
                <i className="fas fa-times me-1"></i>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={hasErrors || isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-1"></i>
                    {editingPosition ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <i className={`fas ${editingPosition ? 'fa-save' : 'fa-plus'} me-1`}></i>
                    {editingPosition ? 'Update Position' : 'Create Position'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PositionFormModal;