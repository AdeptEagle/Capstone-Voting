import React from 'react';
import PhotoUpload from './PhotoUpload';

const CandidateForm = ({
  formData,
  onChange,
  onPhotoChange,
  onRemovePhoto,
  photoFile,
  positions = [],
  departments = [],
  courses = [],
  loadingCourses = false,
  photoPreview = '',
  onDepartmentChange,
  isEditing = false
}) => {
  const handleDepartmentChange = (e) => {
    onChange(e);
    if (onDepartmentChange) {
      onDepartmentChange(e.target.value);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Position</label>
        <select
          className="form-select"
          name="positionId"
          value={formData.positionId}
          onChange={onChange}
          required
        >
          <option value="">Select a position</option>
          {positions.map(position => (
            <option key={position.id} value={position.id}>
              {position.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Department *</label>
        <select
          className="form-select"
          name="departmentId"
          value={formData.departmentId}
          onChange={handleDepartmentChange}
          required
        >
          <option value="">Select a department</option>
          {departments.map(department => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
        <small className="text-muted">Choose the department this candidate represents (required)</small>
      </div>

      <div className="mb-3">
        <label className="form-label">Course *</label>
        <select
          className="form-select"
          name="courseId"
          value={formData.courseId}
          onChange={onChange}
          disabled={!formData.departmentId || loadingCourses}
          required
        >
          <option value="">Select a course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.id} - {course.name}
            </option>
          ))}
        </select>
        <small className="text-muted">
          {loadingCourses ? 'Loading courses...' : 
           formData.departmentId ? 'Choose the course this candidate represents (required)' : 
           'Select a department first to choose a course'}
        </small>
      </div>

      <PhotoUpload
        photoFile={photoFile}
        photoPreview={photoPreview}
        onPhotoChange={onPhotoChange}
        onRemovePhoto={onRemovePhoto}
      />

      <div className="mb-3">
        <label className="form-label">Description (optional)</label>
        <textarea
          className="form-control"
          rows={3}
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Brief description about the candidate"
        />
      </div>
    </div>
  );
};

export default CandidateForm;