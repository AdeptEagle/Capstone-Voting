import React from 'react';

const ElectionHeader = ({ onCreateNew }) => {
  return (
    <div className="row mb-4">
      <div className="col">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">
            <i className="fas fa-vote-yea me-2"></i>
            Elections Management
          </h2>
          <button
            className="btn btn-primary"
            onClick={onCreateNew}
          >
            <i className="fas fa-plus me-1"></i>
            Create Election
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElectionHeader;