import React from 'react';

const ActiveElectionWarning = () => {
  return (
    <div className="alert alert-warning mb-4">
      <div className="d-flex align-items-center">
        <i className="fas fa-exclamation-triangle fa-2x me-3"></i>
        <div>
          <h5 className="alert-heading mb-1">Active Election in Progress</h5>
          <p className="mb-0">
            Candidate modifications are disabled during active elections to maintain ballot integrity. 
            You can still view candidate information, but adding, editing, or deleting candidates is not allowed 
            until the current election ends.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActiveElectionWarning;