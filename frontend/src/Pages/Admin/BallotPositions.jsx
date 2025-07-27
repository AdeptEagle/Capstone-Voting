import React, { useState, useEffect } from 'react';
import { useElection } from '../../contexts/ElectionContext';
import { 
  getPositionAssignmentStatus, 
  assignPositionToElection, 
  removePositionFromElection 
} from '../../services/api';
import './BallotPositions.css';

const BallotPositions = () => {
  const { activeElection } = useElection();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (activeElection) {
      fetchPositions();
    } else {
      setLoading(false);
    }
  }, [activeElection]);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const data = await getPositionAssignmentStatus(activeElection.id);
      setPositions(data);
      setError('');
    } catch (err) {
      console.error('Error fetching positions:', err);
      setError('Failed to fetch positions');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPosition = async (positionId) => {
    try {
      setError('');
      setSuccess('');
      await assignPositionToElection(activeElection.id, positionId);
      setSuccess('Position assigned to ballot successfully!');
      fetchPositions(); // Refresh the list
    } catch (err) {
      console.error('Error assigning position:', err);
      setError(err.response?.data?.error || 'Failed to assign position to ballot');
    }
  };

  const handleRemovePosition = async (positionId) => {
    try {
      setError('');
      setSuccess('');
      await removePositionFromElection(activeElection.id, positionId);
      setSuccess('Position removed from ballot successfully!');
      fetchPositions(); // Refresh the list
    } catch (err) {
      console.error('Error removing position:', err);
      setError(err.response?.data?.error || 'Failed to remove position from ballot');
    }
  };

  if (loading) {
    return (
      <div className="ballot-positions-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading ballot positions...</p>
      </div>
    );
  }

  if (!activeElection) {
    return (
      <div className="ballot-positions-error">
        <div className="alert alert-warning text-center">
          <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
          <h4>No Active Ballot</h4>
          <p>There is no active ballot to manage positions for.</p>
          <p className="mb-0">Please create or activate a ballot first.</p>
        </div>
      </div>
    );
  }

  const assignedPositions = positions.filter(pos => pos.isAssigned);
  const unassignedPositions = positions.filter(pos => !pos.isAssigned);

  return (
    <div className="ballot-positions-container">
      <div className="dashboard-header-pro">
        <div className="header-content">
          <h1>Ballot Positions Management</h1>
          <p>Manage positions for: <strong>{activeElection.title}</strong></p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      <div className="row">
        {/* Assigned Positions */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-check-circle text-success me-2"></i>
                Positions in Ballot ({assignedPositions.length})
              </h5>
            </div>
            <div className="card-body">
              {assignedPositions.length === 0 ? (
                <p className="text-muted text-center py-3">No positions assigned to this ballot yet.</p>
              ) : (
                <div className="list-group list-group-flush">
                  {assignedPositions.map((position) => (
                    <div key={position.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{position.name}</h6>
                        <small className="text-muted">Vote Limit: {position.voteLimit}</small>
                      </div>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleRemovePosition(position.id)}
                        title="Remove from ballot"
                      >
                        <i className="fas fa-times"></i> Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Available Positions */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-plus-circle text-primary me-2"></i>
                Available Positions ({unassignedPositions.length})
              </h5>
            </div>
            <div className="card-body">
              {unassignedPositions.length === 0 ? (
                <p className="text-muted text-center py-3">All positions are already assigned to this ballot.</p>
              ) : (
                <div className="list-group list-group-flush">
                  {unassignedPositions.map((position) => (
                    <div key={position.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{position.name}</h6>
                        <small className="text-muted">Vote Limit: {position.voteLimit}</small>
                      </div>
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => handleAssignPosition(position.id)}
                        title="Add to ballot"
                      >
                        <i className="fas fa-plus"></i> Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          <strong>Instructions:</strong> Use the "Add" button to assign positions to the current ballot. 
          Use the "Remove" button to remove positions from the ballot. 
          Only positions assigned to the ballot will be available for voting.
        </div>
      </div>
    </div>
  );
};

export default BallotPositions; 