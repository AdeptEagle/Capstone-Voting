import React from 'react';

const CourseModal = ({ 
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
            <i className="fas fa-graduation-cap"></i>
            {isEditing ? 'Edit Course' : 'Create Course'} - {department?.name}
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
            <input
              type="hidden"
              name="departmentId"
              value={formData.departmentId}
            />
            <div className="department-form-group">
              <label className="department-form-label">Course ID</label>
              <input
                type="text"
                className="department-form-input"
                value={formData.id}
                onChange={(e) => onChange({...formData, id: e.target.value.toUpperCase()})}
                placeholder="e.g., BSIT, BSME, BSCE"
                maxLength="10"
                pattern="[A-Za-z0-9-]+"
                required
                disabled={isEditing}
              />
              <small className="department-form-help">
                {isEditing 
                  ? "Course ID cannot be changed"
                  : "Enter a unique course identifier (e.g., BSIT for BS in Information Technology)"
                }
              </small>
            </div>
            <div className="department-form-group">
              <label className="department-form-label">Course Name</label>
              <input
                type="text"
                className="department-form-input"
                value={formData.name}
                onChange={(e) => onChange({...formData, name: e.target.value})}
                placeholder="e.g., BS in Information Technology"
                required
              />
            </div>
          </div>
          <div className="department-modal-footer">
            <button
              type="button"
              className="department-btn department-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="department-btn department-btn-success">
              <i className="fas fa-graduation-cap"></i>
              {isEditing ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;