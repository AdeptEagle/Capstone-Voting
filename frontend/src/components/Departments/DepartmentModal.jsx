import React from 'react';

const DepartmentModal = ({ 
  show, 
  isEditing = false, 
  department = null,
  formData, 
  onChange, 
  onSubmit, 
  onClose 
}) => {
  if (!show) return null;

  return (
    <div className="department-modal-overlay">
      <div className="department-modal">
        <div className="department-modal-header">
          <h5 className="department-modal-title">
            <i className={`fas ${isEditing ? 'fa-edit' : 'fa-university'}`}></i>
            {isEditing ? `Edit Department - ${department?.name}` : 'Create New Department'}
          </h5>
          <button
            type="button"
            className="department-modal-close"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="department-modal-body">
            {!isEditing && (
              <div className="department-form-group">
                <label className="department-form-label">Department ID</label>
                <input
                  type="text"
                  className="department-form-input"
                  value={formData.id}
                  onChange={(e) => onChange({...formData, id: e.target.value.toUpperCase()})}
                  placeholder="e.g., CTE, CAS, COE"
                  maxLength="10"
                  pattern="[A-Za-z0-9-]+"
                  required
                />
                <small className="department-form-help">
                  Enter a unique department identifier (e.g., CTE for College of Teacher Education)
                </small>
              </div>
            )}
            <div className="department-form-group">
              <label className="department-form-label">Department Name</label>
              <input
                type="text"
                className="department-form-input"
                value={formData.name}
                onChange={(e) => onChange({...formData, name: e.target.value})}
                placeholder="e.g., College of Teacher Education"
                required
              />
            </div>
            {isEditing && (
              <div className="department-form-group">
                <label className="department-form-label">Department ID</label>
                <input
                  type="text"
                  className="department-form-input"
                  value={formData.id}
                  disabled
                />
                <small className="department-form-help">
                  Department ID cannot be changed
                </small>
              </div>
            )}
          </div>
          <div className="department-modal-footer">
            <button
              type="button"
              className="department-btn department-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="department-btn department-btn-primary">
              <i className={`fas ${isEditing ? 'fa-save' : 'fa-university'}`}></i>
              {isEditing ? 'Update Department' : 'Create Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;