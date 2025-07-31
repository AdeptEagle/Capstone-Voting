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
      <div className="department-card-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        gap: '1rem',
        flexWrap: 'nowrap'
      }}>
        <div className="department-card-title" style={{ 
          flex: '1', 
          minWidth: '0',
          overflow: 'hidden'
        }}>
          <h3 className="department-card-name" style={{ 
            margin: '0 0 0.25rem 0',
            fontSize: '1.1rem',
            fontWeight: '600',
            lineHeight: '1.3',
            wordBreak: 'break-word',
            hyphens: 'auto'
          }}>{department.name}</h3>
          <span className="department-card-id" style={{ 
            fontSize: '0.8rem',
            color: '#6c757d',
            fontFamily: 'monospace'
          }}>{department.id}</span>
        </div>
        <div className="department-card-actions" style={{ 
          display: 'flex', 
          gap: '0.5rem',
          flexShrink: '0',
          alignItems: 'flex-start'
        }}>
          <button 
            className="department-btn department-btn-success department-btn-sm"
            onClick={() => onAddCourse(department)}
            title="Add Course"
            style={{ 
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              borderRadius: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '32px',
              height: '32px'
            }}
          >
            <i className="fas fa-plus" style={{ fontSize: '0.7rem' }}></i>
          </button>
          <button 
            className="department-btn department-btn-primary department-btn-sm"
            onClick={() => onEdit(department)}
            title="Edit Department"
            style={{ 
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              borderRadius: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '32px',
              height: '32px'
            }}
          >
            <i className="fas fa-edit" style={{ fontSize: '0.7rem' }}></i>
          </button>
          <button 
            className="department-btn department-btn-danger department-btn-sm"
            onClick={() => onDelete(department.id)}
            title="Delete Department"
            style={{ 
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              borderRadius: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '32px',
              height: '32px'
            }}
          >
            <i className="fas fa-trash" style={{ fontSize: '0.7rem' }}></i>
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
              className="department-btn department-btn-outline-success department-btn-sm"
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