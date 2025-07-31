import React from 'react';

const CourseItem = ({ course, onEdit, onDelete }) => {
  return (
    <div className="department-course-item">
      <div className="department-course-info">
        <div className="department-course-id">{course.id}</div>
        <div className="department-course-name">{course.name}</div>
      </div>
      <div className="department-course-actions">
        <button 
          className="department-btn department-btn-outline department-btn-sm"
          onClick={onEdit}
          title="Edit Course"
        >
          <i className="fas fa-edit"></i>
        </button>
        <button 
          className="department-btn department-btn-outline-danger department-btn-sm"
          onClick={onDelete}
          title="Delete Course"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default CourseItem;