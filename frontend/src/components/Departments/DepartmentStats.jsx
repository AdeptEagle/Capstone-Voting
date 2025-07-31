import React from 'react';

const DepartmentStats = ({ stats }) => {
  return (
    <div className="department-stats">
      <div className="department-stat-card">
        <div className="department-stat-icon">
          <i className="fas fa-university"></i>
        </div>
        <div className="department-stat-content">
          <div className="department-stat-number">{stats.totalDepartments}</div>
          <div className="department-stat-label">Total Departments</div>
        </div>
      </div>
      <div className="department-stat-card">
        <div className="department-stat-icon">
          <i className="fas fa-graduation-cap"></i>
        </div>
        <div className="department-stat-content">
          <div className="department-stat-number">{stats.totalCourses}</div>
          <div className="department-stat-label">Total Courses</div>
        </div>
      </div>
      <div className="department-stat-card">
        <div className="department-stat-icon">
          <i className="fas fa-users"></i>
        </div>
        <div className="department-stat-content">
          <div className="department-stat-number">{stats.totalVoters}</div>
          <div className="department-stat-label">Total Voters</div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentStats;