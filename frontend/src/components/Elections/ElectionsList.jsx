import React from 'react';
import ElectionCard from './ElectionCard';

const ElectionsList = ({ 
  elections, 
  onEdit, 
  onDelete, 
  onView, 
  onStart, 
  onPause, 
  onStop, 
  onResume, 
  onEnd, 
  updatingElection,
  onCreateNew 
}) => {
  if (elections.length === 0) {
    return (
      <div className="col-12">
        <div className="text-center py-5">
          <i className="fas fa-vote-yea fa-3x text-muted mb-3"></i>
          <h4 className="text-muted">No Elections Found</h4>
          <p className="text-muted">Create your first election to get started.</p>
          <button
            className="btn btn-primary"
            onClick={onCreateNew}
          >
            <i className="fas fa-plus me-1"></i>
            Create Election
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {elections.map(election => (
        <div key={election.id} className="col-lg-4 col-md-6 mb-4">
          <ElectionCard
            election={election}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            onStart={onStart}
            onPause={onPause}
            onStop={onStop}
            onResume={onResume}
            onEnd={onEnd}
            isUpdating={updatingElection === election.id}
          />
        </div>
      ))}
    </>
  );
};

export default ElectionsList;