import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getElectionHistory, deleteElection } from '../services/api';
import './ElectionHistory.css';

const ElectionHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedElection, setSelectedElection] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, election: null, confirmationText: '' });
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getElectionHistory();
      setHistory(data || []);
      setError('');
    } catch (error) {
      console.error('Error fetching election history:', error);
      setError('Failed to load election history');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Not set';
    return new Date(dateTime).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'active':
        return 'success';
      case 'paused':
        return 'info';
      case 'stopped':
        return 'danger';
      case 'ended':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'fas fa-clock';
      case 'active':
        return 'fas fa-play-circle';
      case 'paused':
        return 'fas fa-pause-circle';
      case 'stopped':
        return 'fas fa-stop-circle';
      case 'ended':
        return 'fas fa-check-circle';
      default:
        return 'fas fa-question-circle';
    }
  };

  const viewElectionDetails = (election) => {
    setSelectedElection(election);
  };

  const closeElectionDetails = () => {
    setSelectedElection(null);
  };

  const openDeleteModal = (election) => {
    setDeleteModal({
      show: true,
      election: election,
      confirmationText: ''
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      show: false,
      election: null,
      confirmationText: ''
    });
  };

  const handleDeleteElection = async () => {
    const { election, confirmationText } = deleteModal;
    
    if (confirmationText !== election.title) {
      setError('Ballot name does not match. Please type the exact ballot name to confirm deletion.');
      return;
    }

    try {
      setDeleting(true);
      setError('');
      setSuccess('');

      await deleteElection(election.id);
      
      setSuccess(`Election "${election.title}" has been permanently deleted.`);
      closeDeleteModal();
      await fetchHistory(); // Refresh the list
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting election:', error);
      setError(error.response?.data?.error || 'Failed to delete election');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="election-history-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading election history...</p>
      </div>
    );
  }

  return (
    <div className="election-history-container">
      {/* Unified Professional Header */}
      <div className="dashboard-header-pro">
        <div className="dashboard-header-row">
          <div>
            <h1 className="dashboard-title-pro">Election History</h1>
            <p className="dashboard-subtitle-pro">View completed elections and their results</p>
          </div>
          <div className="dashboard-header-actions">
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate('/admin/elections')}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back to Elections
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* History List */}
      <div className="election-history-list">
        {history.length > 0 ? (
          history.map((election) => (
            <div key={election.id} className="election-history-card">
              <div className="election-history-header">
                <div className="election-history-title">
                  <h3>{election.title || 'Untitled Election'}</h3>
                  <span className={`status-badge badge bg-${getStatusColor(election.status)}`}>
                    <i className={`${getStatusIcon(election.status)} me-1`}></i>
                    {election.status ? election.status.charAt(0).toUpperCase() + election.status.slice(1) : 'Unknown'}
                  </span>
                </div>
                <div className="election-history-meta">
                  <small className="text-muted">
                    Created by {election.createdByUsername || 'Unknown'}
                  </small>
                </div>
              </div>

              <div className="election-history-content">
                <p className="election-history-description">{election.description || 'No description available'}</p>
                
                <div className="election-history-stats">
                  <div className="stat-item">
                    <i className="fas fa-calendar-alt"></i>
                    <span><strong>Start:</strong> {formatDateTime(election.startTime)}</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-calendar-check"></i>
                    <span><strong>End:</strong> {formatDateTime(election.endTime)}</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-briefcase"></i>
                    <span><strong>Positions:</strong> {election.positionCount || 0}</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-vote-yea"></i>
                    <span><strong>Total Votes:</strong> {election.totalVotes || 0}</span>
                  </div>
                </div>

                <div className="election-history-actions">
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => viewElectionDetails(election)}
                  >
                    <i className="fas fa-eye me-1"></i>
                    View Details & Results
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => openDeleteModal(election)}
                  >
                    <i className="fas fa-trash me-1"></i>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-history">
            <i className="fas fa-history fa-3x mb-3"></i>
            <h3>No Election History</h3>
            <p>No completed elections found. Elections will appear here once they are ended.</p>
          </div>
        )}
      </div>

      {/* Election Details Modal */}
      {selectedElection && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Election Details: {selectedElection.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeElectionDetails}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <h6 className="border-bottom pb-2 mb-3">Election Information</h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label"><strong>Description:</strong></label>
                      <div className="form-control-plaintext">
                        {selectedElection.description || 'No description'}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label"><strong>Created By:</strong></label>
                      <div className="form-control-plaintext">
                        {selectedElection.createdByUsername || 'Unknown'}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <i className="fas fa-calendar-alt me-1"></i>
                        <strong>Start Time:</strong>
                      </label>
                      <div className="form-control-plaintext">
                        {formatDateTime(selectedElection.startTime)}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <i className="fas fa-calendar-check me-1"></i>
                        <strong>End Time:</strong>
                      </label>
                      <div className="form-control-plaintext">
                        {formatDateTime(selectedElection.endTime)}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <i className="fas fa-briefcase me-1"></i>
                        <strong>Positions:</strong>
                      </label>
                      <div className="form-control-plaintext">
                        {selectedElection.positionCount || 0}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <i className="fas fa-vote-yea me-1"></i>
                        <strong>Total Votes Cast:</strong>
                      </label>
                      <div className="form-control-plaintext">
                        {selectedElection.totalVotes || 0}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <h6 className="border-bottom pb-2 mb-3">Results Summary</h6>
                  <p>Detailed results and statistics for this election will be displayed here.</p>
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    Full results analysis coming in the next improvement.
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeElectionDetails}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.election && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Delete Election
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeDeleteModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-warning mb-3">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <strong>Warning:</strong> This action cannot be undone. All election data, votes, and results will be permanently deleted.
                </div>
                
                <div className="mb-3">
                  <label className="form-label">
                    <strong>Election to delete:</strong>
                  </label>
                  <div className="form-control-plaintext">
                    {deleteModal.election.title}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">
                    Type the ballot name <strong>"{deleteModal.election.title}"</strong> to confirm deletion:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={deleteModal.confirmationText}
                    onChange={(e) => setDeleteModal({
                      ...deleteModal,
                      confirmationText: e.target.value
                    })}
                    placeholder={`Type: ${deleteModal.election.title}`}
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeDeleteModal}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteElection}
                  disabled={deleting || deleteModal.confirmationText !== deleteModal.election.title}
                >
                  {deleting ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-1"></i>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-trash me-1"></i>
                      Delete Permanently
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionHistory; 