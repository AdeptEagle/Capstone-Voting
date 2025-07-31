import React from 'react';

const DepartmentHeader = ({ onAddDepartment }) => {
  return (
    <div className="department-header">
      <div className="department-title-section">
        <h1 className="department-title">
          <i className="fas fa-university"></i>
          Department Management
        </h1>
        <p className="department-subtitle">
          Manage academic departments and their associated courses
        </p>
      </div>
      <div className="department-actions">
        <button className="department-btn department-btn-primary" onClick={onAddDepartment}>
          <i className="fas fa-plus"></i>
          Add Department
        </button>
      </div>
    </div>
  );
};

export default DepartmentHeader;