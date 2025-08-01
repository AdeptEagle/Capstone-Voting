import React from 'react';
import CourseItem from './CourseItem';
import './DepartmentCard.css';

const DepartmentCard = ({
  department,
  onEdit,
  onDelete,
  onAddCourse,
  onEditCourse,
  onDeleteCourse
}) => {
  // Department icons mapping
  const departmentIcons = {
    'College of Business and Management': 'fa-chart-line',
    'College of Computer Studies': 'fa-laptop-code',
    'College of Education and Arts': 'fa-graduation-cap',
    'College of Engineering': 'fa-cogs',
    'College of Science': 'fa-flask',
    'College of Medicine': 'fa-user-md',
    'College of Law': 'fa-gavel',
    'College of Arts and Letters': 'fa-paint-brush',
    'College of Social Sciences': 'fa-users',
    'College of Architecture': 'fa-building',
    // Default icon if no match
    'default': 'fa-university'
  };

  const getDepartmentIcon = (deptName) => {
    return departmentIcons[deptName] || departmentIcons['default'];
  };

  return (
    <div className="department-card">
      <div className="department-header">
        <div className="department-title">
          <i className={`fas ${getDepartmentIcon(department.name)} department-icon`}></i>
          <h3>{department.name}</h3>
        </div>
        <div className="department-actions">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => onEdit(department)}
            title="Edit Department"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => onDelete(department)}
            title="Delete Department"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <div className="department-info">
        <div className="info-item">
          <i className="fas fa-id-badge"></i>
          <span>Code: {department.code}</span>
        </div>
        <div className="info-item">
          <i className="fas fa-graduation-cap"></i>
          <span>Courses: {department.courses?.length || 0}</span>
        </div>
      </div>

      <div className="courses-section">
        <div className="courses-header">
          <h4>Courses</h4>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onAddCourse(department)}
          >
            <i className="fas fa-plus"></i> Add Course
          </button>
        </div>

        <div className="courses-list">
          {department.courses && department.courses.length > 0 ? (
            department.courses.map(course => (
              <CourseItem
                key={course.id}
                course={course}
                onEdit={() => onEditCourse(course)}
                onDelete={() => onDeleteCourse(course)}
              />
            ))
          ) : (
            <div className="no-courses">
              <p>No courses added yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentCard;