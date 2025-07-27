import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getElections, getPositions, createElection, updateElection, deleteElection, startElection, pauseElection, stopElection, resumeElection, endElection, getElectionPositions } from '../services/api';
import './Elections.css';

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingElection, setEditingElection] = useState(null);
  const [updatingElection, setUpdatingElection] = useState(null);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const navigate = useNavigate();

  // Form state for creating/editing elections
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    positionIds: []
  });

  useEffect(() => {
    fetchElectionsData();
  }, []);

  const fetchElectionsData = async () => {
    try {
      setLoading(true);
      const [elections, positions] = await Promise.all([
        getElections(),
        getPositions()
      ]);

      console.log('Fetched elections:', elections); // Debug log
      setElections(elections || []);
      setPositions(positions || []);
    } catch (error) {
      console.error('Error fetching elections data:', error);
      setError('Failed to load elections data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const electionData = {
        id: crypto.randomUUID(),
        ...formData,
        startTime: new Date(formData.startTime).toISOString().slice(0, 19).replace('T', ' '),
        endTime: new Date(formData.endTime).toISOString().slice(0, 19).replace('T', ' ')
      };

      await createElection(electionData);
      
      setSuccess('Election created successfully!');
      setShowCreateModal(false);
      resetForm();
      await fetchElectionsData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error creating election:', error);
      setError(error.response?.data?.error || 'Failed to create election');
    } finally {
      setLoading(false);
    }
  };

  const handleEditElection = async (e) => {
    e.preventDefault();
    try {
      setUpdatingElection(editingElection.id);
      setError('');
      setSuccess('');

      const electionData = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString().slice(0, 19).replace('T', ' '),
        endTime: new Date(formData.endTime).toISOString().slice(0, 19).replace('T', ' '),
        status: editingElection.status // Preserve the current status
      };

      console.log('Updating election with data:', electionData); // Debug log
      await updateElection(editingElection.id, electionData);
      
      setSuccess('Election updated successfully!');
      setShowEditModal(false);
      setEditingElection(null);
      resetForm();
      await fetchElectionsData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating election:', error);
      setError(error.response?.data?.error || 'Failed to update election');
    } finally {
      setUpdatingElection(null);
    }
  };

  const handleStartElection = async (electionId) => {
    try {
      setUpdatingElection(electionId);
      setError('');
      setSuccess('');

      await startElection(electionId);
      
      setSuccess('Election started successfully!');
      await fetchElectionsData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error starting election:', error);
      setError(error.response?.data?.error || 'Failed to start election');
    } finally {
      setUpdatingElection(null);
    }
  };

  const handlePauseElection = async (electionId) => {
    try {
      setUpdatingElection(electionId);
      setError('');
      setSuccess('');

      await pauseElection(electionId);
      
      setSuccess('Election paused successfully!');
      await fetchElectionsData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error pausing election:', error);
      setError(error.response?.data?.error || 'Failed to pause election');
    } finally {
      setUpdatingElection(null);
    }
  };

  const handleStopElection = async (electionId) => {
    try {
      setUpdatingElection(electionId);
      setError('');
      setSuccess('');

      await stopElection(electionId);
      
      setSuccess('Election stopped successfully!');
      await fetchElectionsData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error stopping election:', error);
      setError(error.response?.data?.error || 'Failed to stop election');
    } finally {
      setUpdatingElection(null);
    }
  };

  const handleResumeElection = async (electionId) => {
    try {
      setUpdatingElection(electionId);
      setError('');
      setSuccess('');

      await resumeElection(electionId);
      
      setSuccess('Election resumed successfully!');
      await fetchElectionsData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error resuming election:', error);
      setError(error.response?.data?.error || 'Failed to resume election');
    } finally {
      setUpdatingElection(null);
    }
  };

  const handleEndElection = async (electionId) => {
    try {
      setUpdatingElection(electionId);
      setError('');
      setSuccess('');

      await endElection(electionId);
      
      setSuccess('Election ended successfully and saved to history!');
      await fetchElectionsData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error ending election:', error);
      setError(error.response?.data?.error || 'Failed to end election');
    } finally {
      setUpdatingElection(null);
    }
  };

  const handleDeleteElection = async (electionId) => {
    try {
      setUpdatingElection(electionId);
      setError('');
      setSuccess('');

      await deleteElection(electionId);
      
      setSuccess('Election deleted successfully!');
      await fetchElectionsData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting election:', error);
      setError(error.response?.data?.error || 'Failed to delete election');
    } finally {
      setUpdatingElection(null);
    }
  };

  const handleStatusChange = async (electionId, newStatus) => {
    try {
      setUpdatingElection(electionId);
      setError('');
      setSuccess('');

      const election = elections.find(e => e.id === electionId);
      if (!election) {
        setError('Election not found');
        return;
      }

      await updateElection(electionId, {
        title: election.title,
        description: election.description,
        startTime: election.startTime,
        endTime: election.endTime,
        status: newStatus
      });

      const statusText = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
      setSuccess(`Election "${election.title || 'Untitled Election'}" has been ${statusText.toLowerCase()}`);
      
      await fetchElectionsData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating election status:', error);
      setError(error.response?.data?.error || 'Failed to update election status');
    } finally {
      setUpdatingElection(null);
    }
  };

  const handleFixStatus = async (electionId) => {
    try {
      setUpdatingElection(electionId);
      setError('');
      setSuccess('');

      const election = elections.find(e => e.id === electionId);
      if (!election) {
        setError('Election not found');
        return;
      }

      await updateElection(electionId, {
        title: election.title,
        description: election.description,
        startTime: election.startTime,
        endTime: election.endTime,
        status: 'pending'
      });

      setSuccess('Election status fixed! Set to Pending.');
      await fetchElectionsData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error fixing election status:', error);
      setError(error.response?.data?.error || 'Failed to fix election status');
    } finally {
      setUpdatingElection(null);
    }
  };

  const openEditModal = async (election) => {
    try {
      setEditingElection(election);
      setError(''); // Clear any previous errors
      setLoadingPositions(true);
      
      // Set initial form data while loading positions
      setFormData({
        title: election.title || '',
        description: election.description || '',
        startTime: election.startTime ? election.startTime.slice(0, 16) : '', // Format for datetime-local input
        endTime: election.endTime ? election.endTime.slice(0, 16) : '',
        positionIds: [] // Start with empty array
      });
      setShowEditModal(true);
      
      // Fetch the positions for this specific election
      const electionPositions = await getElectionPositions(election.id);
      const positionIds = electionPositions.map(pos => pos.id);
      
      // Update form data with fetched positions
      setFormData(prev => ({
        ...prev,
        positionIds: positionIds
      }));
    } catch (error) {
      console.error('Error fetching election positions:', error);
      setError('Failed to load election positions. Please try again.');
      // Don't close the modal, let user see the error
    } finally {
      setLoadingPositions(false);
    }
  };

  const openCreateModal = () => {
    setEditingElection(null);
    resetForm();
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      positionIds: []
    });
  };

  const getStatusColor = (status) => {
    // If status is null/undefined, treat as 'pending'
    const electionStatus = status || 'pending';
    switch (electionStatus) {
      case 'pending': return 'warning';
      case 'active': return 'success';
      case 'paused': return 'info';
      case 'stopped': return 'danger';
      case 'ended': return 'secondary';
      default: return 'warning'; // Default to warning for pending
    }
  };

  const getStatusIcon = (status) => {
    // If status is null/undefined, treat as 'pending'
    const electionStatus = status || 'pending';
    switch (electionStatus) {
      case 'pending': return 'fas fa-clock';
      case 'active': return 'fas fa-play-circle';
      case 'paused': return 'fas fa-pause-circle';
      case 'stopped': return 'fas fa-stop-circle';
      case 'ended': return 'fas fa-check-circle';
      default: return 'fas fa-clock'; // Default to clock for pending
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Not set';
    try {
      return new Date(dateTime).toLocaleString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getStatusActions = (election) => {
    const actions = [];
    
    // Debug: Log the election status
    console.log('Election status:', election.status, 'Election ID:', election.id);
    
    // If status is null/undefined, treat as 'pending' (default status)
    const status = election.status || 'pending';
    
    console.log('Processed status:', status);
    
    // If status is null/undefined, show a fix button
    if (!election.status) {
      actions.push(
        <button
          key="fix-status"
          className="btn btn-warning btn-sm me-2"
          onClick={() => handleFixStatus(election.id)}
          disabled={updatingElection === election.id}
        >
          {updatingElection === election.id ? (
            <i className="fas fa-spinner fa-spin me-1"></i>
          ) : (
            <i className="fas fa-wrench me-1"></i>
          )}
          Fix Status (Set to Pending)
        </button>
      );
    }
    
    switch (status) {
      case 'pending':
        actions.push(
          <button
            key="start"
            className="btn btn-success btn-sm me-2"
            onClick={() => handleStartElection(election.id)}
            disabled={updatingElection === election.id}
          >
            {updatingElection === election.id ? (
              <i className="fas fa-spinner fa-spin me-1"></i>
            ) : (
              <i className="fas fa-play me-1"></i>
            )}
            Start Ballot
          </button>
        );
        break;
        
      case 'active':
        actions.push(
          <button
            key="pause"
            className="btn btn-warning btn-sm me-2"
            onClick={() => handlePauseElection(election.id)}
            disabled={updatingElection === election.id}
          >
            {updatingElection === election.id ? (
              <i className="fas fa-spinner fa-spin me-1"></i>
            ) : (
              <i className="fas fa-pause me-1"></i>
            )}
            Pause Ballot
          </button>,
          <button
            key="stop"
            className="btn btn-danger btn-sm me-2"
            onClick={() => handleStopElection(election.id)}
            disabled={updatingElection === election.id}
          >
            {updatingElection === election.id ? (
              <i className="fas fa-spinner fa-spin me-1"></i>
            ) : (
              <i className="fas fa-stop me-1"></i>
            )}
            Stop Ballot
          </button>
        );
        break;
        
      case 'paused':
        actions.push(
          <button
            key="resume"
            className="btn btn-success btn-sm me-2"
            onClick={() => handleResumeElection(election.id)}
            disabled={updatingElection === election.id}
          >
            {updatingElection === election.id ? (
              <i className="fas fa-spinner fa-spin me-1"></i>
            ) : (
              <i className="fas fa-play me-1"></i>
            )}
            Resume Ballot
          </button>,
          <button
            key="stop"
            className="btn btn-danger btn-sm me-2"
            onClick={() => handleStopElection(election.id)}
            disabled={updatingElection === election.id}
          >
            {updatingElection === election.id ? (
              <i className="fas fa-spinner fa-spin me-1"></i>
            ) : (
              <i className="fas fa-stop me-1"></i>
            )}
            Stop Ballot
          </button>
        );
        break;
        
      case 'stopped':
        actions.push(
          <button
            key="resume"
            className="btn btn-success btn-sm me-2"
            onClick={() => handleResumeElection(election.id)}
            disabled={updatingElection === election.id}
          >
            {updatingElection === election.id ? (
              <i className="fas fa-spinner fa-spin me-1"></i>
            ) : (
              <i className="fas fa-play me-1"></i>
            )}
            Resume Ballot
          </button>,
          <button
            key="end"
            className="btn btn-secondary btn-sm me-2"
            onClick={() => handleEndElection(election.id)}
            disabled={updatingElection === election.id}
          >
            {updatingElection === election.id ? (
              <i className="fas fa-spinner fa-spin me-1"></i>
            ) : (
              <i className="fas fa-check me-1"></i>
            )}
            End Ballot (Save to History)
          </button>
        );
        break;
        
      case 'ended':
        actions.push(
          <span key="ended" className="text-muted">
            <i className="fas fa-check-circle me-1"></i>
            Election completed and saved to history
          </span>
        );
        break;
        
      default:
        actions.push(
          <span key="unknown" className="text-muted">
            <i className="fas fa-question-circle me-1"></i>
            Unknown status
          </span>
        );
        break;
    }
    
    return actions;
  };

  if (loading) {
    return (
      <div className="elections-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading elections...</p>
      </div>
    );
  }

  return (
    <div className="elections-container">
      {/* Unified Professional Header */}
      <div className="dashboard-header-pro">
        <div className="dashboard-header-row">
          <div>
            <h1 className="dashboard-title-pro">Election Management</h1>
            <p className="dashboard-subtitle-pro">Manage the single election ballot system (one election at a time)</p>
          </div>
          <div className="dashboard-header-actions">
            <button
              className="btn btn-custom-blue"
              onClick={openCreateModal}
              disabled={elections.some(e => e.status !== 'ended')}
              title={elections.some(e => e.status !== 'ended') ? "End the current election first" : ""}
            >
              <i className="fas fa-plus me-2"></i>
              Create New Election
            </button>
            <button
              className="btn btn-outline-secondary ms-2"
              onClick={() => navigate('/admin/election-history')}
            >
              <i className="fas fa-history me-2"></i>
              View History
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Admin Guide for Single Election Policy */}
      {(() => {
        const currentElection = elections.length > 0 ? elections[0] : null;
        if (currentElection) {
          return (
            <div className="alert alert-warning mb-3">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <strong>Reminder:</strong> Only one active election allowed. End current election to create a new one.
            </div>
          );
        }
        return null;
      })()}

      {/* Elections List */}
      <div className="elections-list">
        {elections.length > 0 ? (
          elections.map((election) => (
            <div key={election.id} className="election-card">
              <div className="election-header">
                <div className="election-title">
                  <h3>{election.title || 'Untitled Election'}</h3>
                  <span className={`status-badge badge bg-${getStatusColor(election.status)}`}>
                    <i className={`${getStatusIcon(election.status)} me-1`}></i>
                    {(election.status || 'pending').charAt(0).toUpperCase() + (election.status || 'pending').slice(1)}
                    {/* Debug: Show raw status */}
                    <small className="ms-1">({election.status || 'null'})</small>
                  </span>
                </div>
                <div className="election-meta">
                  <small className="text-muted">
                    Created by {election.createdByUsername || 'Unknown'}
                  </small>
                </div>
              </div>

              <div className="election-content">
                <p className="election-description">{election.description || 'No description available'}</p>
                
                <div className="election-details">
                  <div className="detail-row">
                    <span className="detail-label">Start Time:</span>
                    <span className="detail-value">{election.startTime ? formatDateTime(election.startTime) : 'Not set'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">End Time:</span>
                    <span className="detail-value">{election.endTime ? formatDateTime(election.endTime) : 'Not set'}</span>
                  </div>
                  {election.positionCount > 0 && (
                    <div className="detail-row">
                      <span className="detail-label">Positions:</span>
                      <span className="detail-value">{election.positionCount} position{election.positionCount !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                <div className="election-actions">
                  <div className="status-actions">
                    {getStatusActions(election)}
                    {getStatusActions(election).length === 0 && (
                      <span className="text-muted">
                        <i className="fas fa-info-circle me-1"></i>
                        No actions available for status: {election.status || 'pending'}
                      </span>
                    )}
                  </div>
                  
                  <div className="management-actions">
                    {election.status !== 'ended' && (
                      <>
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => openEditModal(election)}
                          disabled={updatingElection === election.id}
                        >
                          <i className="fas fa-edit me-1"></i>
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteElection(election.id)}
                          disabled={updatingElection === election.id}
                        >
                          {updatingElection === election.id ? (
                            <i className="fas fa-spinner fa-spin me-1"></i>
                          ) : (
                            <i className="fas fa-trash me-1"></i>
                          )}
                          Delete
                        </button>
                      </>
                    )}
                    {election.status === 'ended' && (
                      <div className="d-flex align-items-center">
                        <span className="text-success me-3">
                          <i className="fas fa-check-circle me-1"></i>
                          Completed
                        </span>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => navigate('/admin/election-history')}
                        >
                          <i className="fas fa-history me-1"></i>
                          View History
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-elections">
            <i className="fas fa-vote-yea"></i>
            <h3>No Elections Found</h3>
            <p>Create your first election to get started</p>
            <button
              className="btn btn-primary"
              onClick={openCreateModal}
            >
              <i className="fas fa-plus me-2"></i>
              Create Election
            </button>
          </div>
        )}
      </div>

      {/* Create Election Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Election</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <form onSubmit={handleCreateElection}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Election Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Start Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          value={formData.startTime}
                          onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">End Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          value={formData.endTime}
                          onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Positions to Include</label>
                    <div className="position-checkboxes">
                      {positions.length > 0 ? (
                        positions.map(position => (
                          <div key={position.id} className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`create-position-${position.id}`}
                              checked={formData.positionIds.includes(position.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({
                                    ...formData,
                                    positionIds: [...formData.positionIds, position.id]
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    positionIds: formData.positionIds.filter(id => id !== position.id)
                                  });
                                }
                              }}
                            />
                            <label className="form-check-label" htmlFor={`create-position-${position.id}`}>
                              {position.name}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">No positions available. Please create positions first.</p>
                      )}
                    </div>
                    {formData.positionIds.length === 0 && (
                      <small className="text-danger">Please select at least one position</small>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || formData.positionIds.length === 0}
                  >
                    {loading ? (
                      <i className="fas fa-spinner fa-spin me-1"></i>
                    ) : (
                      <i className="fas fa-plus me-1"></i>
                    )}
                    Create Election
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Election Modal */}
      {showEditModal && editingElection && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Election</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingElection(null);
                    resetForm();
                  }}
                ></button>
              </div>
              <form onSubmit={handleEditElection}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Election Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Start Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          value={formData.startTime}
                          onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">End Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          value={formData.endTime}
                          onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Positions to Include</label>
                    {loadingPositions ? (
                      <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="text-muted">Loading election positions...</span>
                      </div>
                    ) : (
                      <div className="position-checkboxes">
                        {positions.length > 0 ? (
                          positions.map(position => (
                            <div key={position.id} className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id={`edit-position-${position.id}`}
                                checked={formData.positionIds.includes(position.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({
                                      ...formData,
                                      positionIds: [...formData.positionIds, position.id]
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      positionIds: formData.positionIds.filter(id => id !== position.id)
                                    });
                                  }
                                }}
                              />
                              <label className="form-check-label" htmlFor={`edit-position-${position.id}`}>
                                {position.name}
                              </label>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted">No positions available. Please create positions first.</p>
                        )}
                      </div>
                    )}
                    {!loadingPositions && formData.positionIds.length === 0 && (
                      <small className="text-danger">Please select at least one position</small>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingElection(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={updatingElection === editingElection.id || formData.positionIds.length === 0 || loadingPositions}
                  >
                    {updatingElection === editingElection.id ? (
                      <i className="fas fa-spinner fa-spin me-1"></i>
                    ) : (
                      <i className="fas fa-save me-1"></i>
                    )}
                    Update Election
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Elections;
