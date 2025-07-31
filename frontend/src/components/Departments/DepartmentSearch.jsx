import React from 'react';

const DepartmentSearch = ({ searchTerm, onSearchChange, totalCount, filteredCount }) => {
  return (
    <div className="department-search">
      <div className="department-search-wrapper">
        <i className="fas fa-search department-search-icon"></i>
        <input
          type="text"
          className="department-search-input"
          placeholder="Search departments by name or ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button 
            className="department-search-clear"
            onClick={() => onSearchChange('')}
            title="Clear search"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
      {searchTerm && (
        <div className="department-search-results">
          <span>Showing {filteredCount} of {totalCount} departments</span>
        </div>
      )}
    </div>
  );
};

export default DepartmentSearch;