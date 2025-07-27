import React, { useState, useEffect } from 'react';
import { useElection } from '../../contexts/ElectionContext';
import { 
  getCandidateAssignmentStatus, 
  assignCandidateToElection, 
  removeCandidateFromElection,
  testElectionCandidatesTable
} from '../../services/api';
import './BallotCandidates.css';

const BallotCandidates = () => {
  const { activeElection } = useElection();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (activeElection) {
      fetchCandidates();
    } else {
      setLoading(false);
    }
  }, [activeElection]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const data = await getCandidateAssignmentStatus(activeElection.id);
      setCandidates(data);
      setError('');
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignCandidate = async (candidateId) => {
    try {
      setError('');
      setSuccess('');
      await assignCandidateToElection(activeElection.id, candidateId);
      setSuccess('Candidate assigned to ballot successfully!');
      fetchCandidates(); // Refresh the list
    } catch (err) {
      console.error('Error assigning candidate:', err);
      setError(err.response?.data?.error || 'Failed to assign candidate to ballot');
    }
  };

  const handleRemoveCandidate = async (candidateId) => {
    try {
      setError('');
      setSuccess('');
      await removeCandidateFromElection(activeElection.id, candidateId);
      setSuccess('Candidate removed from ballot successfully!');
      fetchCandidates(); // Refresh the list
    } catch (err) {
      console.error('Error removing candidate:', err);
      setError(err.response?.data?.error || 'Failed to remove candidate from ballot');
    }
  };

  const handleTestTable = async () => {
    try {
      setError('');
      setSuccess('');
      const result = await testElectionCandidatesTable();
      console.log('Table test result:', result);
      if (result.tableExists) {
        setSuccess(`election_candidates table exists! Structure: ${JSON.stringify(result.structure, null, 2)}`);
      } else {
        setError('election_candidates table does not exist! Please restart the backend server.');
      }
    } catch (err) {
      console.error('Error testing table:', err);
      setError('Failed to test table: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return (
      <div className="ballot-candidates-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading ballot candidates...</p>
      </div>
    );
  }

  if (!activeElection) {
    return (
      <div className="ballot-candidates-error">
        <div className="alert alert-warning text-center">
          <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
          <h4>No Active Ballot</h4>
          <p>There is no active ballot to manage candidates for.</p>
          <p className="mb-0">Please create or activate a ballot first.</p>
        </div>
      </div>
    );
  }

  const assignedCandidates = candidates.filter(candidate => candidate.isAssigned);
  const unassignedCandidates = candidates.filter(candidate => !candidate.isAssigned);

  // Group candidates by position
  const groupCandidatesByPosition = (candidates) => {
    const grouped = {};
    candidates.forEach(candidate => {
      const position = candidate.positionName || 'Unknown Position';
      if (!grouped[position]) {
        grouped[position] = [];
      }
      grouped[position].push(candidate);
    });
    return grouped;
  };

  const assignedByPosition = groupCandidatesByPosition(assignedCandidates);
  const unassignedByPosition = groupCandidatesByPosition(unassignedCandidates);

  return (
    <div className="ballot-candidates-container">
      <div className="dashboard-header-pro">
        <div className="header-content">
          <h1>Ballot Candidates Management</h1>
          <p>Manage candidates for: <strong>{activeElection.title}</strong></p>
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
        {/* Assigned Candidates */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-check-circle text-success me-2"></i>
                Candidates in Ballot ({assignedCandidates.length})
              </h5>
            </div>
            <div className="card-body">
              {assignedCandidates.length === 0 ? (
                <p className="text-muted text-center py-3">No candidates assigned to this ballot yet.</p>
              ) : (
                <div className="candidates-list">
                  {Object.entries(assignedByPosition).map(([position, positionCandidates]) => (
                    <div key={position} className="position-group mb-3">
                      <h6 className="position-title text-primary">{position}</h6>
                      <div className="list-group list-group-flush">
                        {positionCandidates.map((candidate) => (
                          <div key={candidate.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div className="candidate-info">
                              <h6 className="mb-1">{candidate.name}</h6>
                              {candidate.description && (
                                <small className="text-muted d-block">{candidate.description}</small>
                              )}
                            </div>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleRemoveCandidate(candidate.id)}
                              title="Remove from ballot"
                            >
                              <i className="fas fa-times"></i> Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Available Candidates */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-plus-circle text-primary me-2"></i>
                Available Candidates ({unassignedCandidates.length})
              </h5>
            </div>
            <div className="card-body">
              {unassignedCandidates.length === 0 ? (
                <p className="text-muted text-center py-3">All candidates are already assigned to this ballot.</p>
              ) : (
                <div className="candidates-list">
                  {Object.entries(unassignedByPosition).map(([position, positionCandidates]) => (
                    <div key={position} className="position-group mb-3">
                      <h6 className="position-title text-primary">{position}</h6>
                      <div className="list-group list-group-flush">
                        {positionCandidates.map((candidate) => (
                          <div key={candidate.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div className="candidate-info">
                              <h6 className="mb-1">{candidate.name}</h6>
                              {candidate.description && (
                                <small className="text-muted d-block">{candidate.description}</small>
                              )}
                            </div>
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={() => handleAssignCandidate(candidate.id)}
                              title="Add to ballot"
                            >
                              <i className="fas fa-plus"></i> Add
                            </button>
                          </div>
                        ))}
                      </div>
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
          <strong>Instructions:</strong> Use the "Add" button to assign candidates to the current ballot. 
          Use the "Remove" button to remove candidates from the ballot. 
          Only candidates assigned to the ballot will be available for voting.
        </div>
        <div className="mt-3">
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={handleTestTable}
          >
            <i className="fas fa-database me-1"></i>
            Test Database Table
          </button>
        </div>
      </div>
    </div>
  );
};

export default BallotCandidates; 