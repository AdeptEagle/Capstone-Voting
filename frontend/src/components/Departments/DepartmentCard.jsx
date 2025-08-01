import React from 'react';
import CourseItem from './CourseItem';

const DepartmentCard = ({ 
  department, 
  courses, 
  voterCount,
  onEdit, 
  onDelete, 
  onAddCourse,
  onEditCourse,
  onDeleteCourse 
}) => {
  const departmentCourses = courses.filter(course => course.departmentId === department.id);

  return (
    <div className="department-card">
      <div className="department-card-header">
        <div className="department-card-info">
          <h3 className="department-card-name">{department.name}</h3>
          <div className="department-card-position">{department.id}</div>
        </div>
        <div className="department-card-actions">
          <button 
            className="view-platform-btn"
            onClick={() => onAddCourse(department)}
            title="View Platform"
          >
            <i className="fas fa-eye"></i>
            View Platform
          </button>
        </div>
      </div>
        
      <div className="department-card-stats">
        <div className="department-stat">
          <i className="fas fa-graduation-cap"></i>
          <span>{departmentCourses.length} Courses</span>
        </div>
        <div className="department-stat">
          <i className="fas fa-users"></i>
          <span>{voterCount || 0} Voters</span>
        </div>
      </div>

      <div className="department-courses-section">
        <div className="department-courses-header">
          <h4 className="department-courses-title">
            <i className="fas fa-book"></i>
            Courses
          </h4>
          <span className="department-courses-count">{departmentCourses.length}</span>
        </div>
          
        {departmentCourses.length > 0 ? (
          <div className="department-courses-list">
            {departmentCourses.map(course => (
              <CourseItem 
                key={course.id}
                course={course}
                department={department}
                onEdit={() => onEditCourse(department, course)}
                onDelete={() => onDeleteCourse(course.id)}
              />
            ))}
          </div>
        ) : (
          <div className="department-no-courses">
            <i className="fas fa-book-open"></i>
            <p>No courses in this department</p>
            <button 
              className="view-platform-btn"
              onClick={() => onAddCourse(department)}
            >
              <i className="fas fa-plus"></i>
              Add First Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentCard;