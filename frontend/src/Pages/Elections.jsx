import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
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
      const [electionsRes, positionsRes] = await Promise.all([
        api.get('/api/elections'),
        api.get('/api/positions')
      ]);

      setElections(electionsRes.data || []);
      setPositions(positionsRes.data || []);
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

      await api.post('/api/elections', electionData);
      
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
        endTime: new Date(formData.endTime).toISOString().slice(0, 19).replace('T', ' ')
      };

      await api.put(`/api/elections/${editingElection.id}`, electionData);
      
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

  const handleDeleteElection = async (electionId) => {
    if (!window.confirm('Are you sure you want to delete this election? This action cannot be undone.')) {
      return;
    }

    try {
      setUpdatingElection(electionId);
      setError('');
      setSuccess('');

      await api.delete(`/api/elections/${electionId}`);
      
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

      await api.put(`/api/elections/${electionId}`, {
        title: election.title,
        description: election.description,
        startTime: election.startTime,
        endTime: election.endTime,
        status: newStatus
      });

      const statusText = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
      setSuccess(`Election "${election.title}" has been ${statusText.toLowerCase()}`);
      
      await fetchElectionsData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating election status:', error);
      setError(error.response?.data?.error || 'Failed to update election status');
    } finally {
      setUpdatingElection(null);
    }
  };

  const openEditModal = (election) => {
    setEditingElection(election);
    setFormData({
      title: election.title,
      description: election.description,
      startTime: election.startTime.slice(0, 16), // Format for datetime-local input
      endTime: election.endTime.slice(0, 16),
      positionIds: election.positionIds || [] // Use current positions if available
    });
    setShowEditModal(true);
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
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'ended': return 'secondary';
      case 'cancelled': return 'danger';
      default: return 'muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'fas fa-play-circle';
      case 'draft': return 'fas fa-edit';
      case 'ended': return 'fas fa-stop-circle';
      case 'cancelled': return 'fas fa-times-circle';
      default: return 'fas fa-question-circle';
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  const getStatusActions = (election) => {
    const actions = [];
    
    switch (election.status) {
      case 'draft':
        actions.push(
          <button
            key="activate"
            className="btn btn-success btn-sm me-2"
            onClick={() => handleStatusChange(election.id, 'active')}
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
            onClick={() => handleStatusChange(election.id, 'draft')}
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
            key="end"
            className="btn btn-danger btn-sm me-2"
            onClick={() => handleStatusChange(election.id, 'ended')}
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
        
      case 'ended':
        actions.push(
          <button
            key="reactivate"
            className="btn btn-success btn-sm me-2"
            onClick={() => handleStatusChange(election.id, 'active')}
            disabled={updatingElection === election.id}
          >
            {updatingElection === election.id ? (
              <i className="fas fa-spinner fa-spin me-1"></i>
            ) : (
              <i className="fas fa-redo me-1"></i>
            )}
            Restart Ballot
          </button>
        );
        break;
        
      case 'cancelled':
        actions.push(
          <button
            key="reactivate"
            className="btn btn-success btn-sm me-2"
            onClick={() => handleStatusChange(election.id, 'active')}
            disabled={updatingElection === election.id}
          >
            {updatingElection === election.id ? (
              <i className="fas fa-spinner fa-spin me-1"></i>
            ) : (
              <i className="fas fa-redo me-1"></i>
            )}
            Restart Ballot
          </button>
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
      {/* Header */}
      <div className="elections-header">
        <div className="elections-header-content">
          <h1>Elections Management</h1>
          <p>Create, manage, and monitor all voting elections and ballots</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={openCreateModal}
        >
          <i className="fas fa-plus me-2"></i>
          Create New Election
        </button>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Elections List */}
      <div className="elections-list">
        {elections.length > 0 ? (
          elections.map((election) => (
            <div key={election.id} className="election-card">
              <div className="election-header">
                <div className="election-title">
                  <h3>{election.title}</h3>
                  <span className={`status-badge badge bg-${getStatusColor(election.status)}`}>
                    <i className={`${getStatusIcon(election.status)} me-1`}></i>
                    {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                  </span>
                </div>
                <div className="election-meta">
                  <small className="text-muted">
                    Created by {election.createdByUsername}
                  </small>
                </div>
              </div>

              <div className="election-content">
                <p className="election-description">{election.description}</p>
                
                <div className="election-details">
                  <div className="detail-row">
                    <span className="detail-label">Start Time:</span>
                    <span className="detail-value">{formatDateTime(election.startTime)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">End Time:</span>
                    <span className="detail-value">{formatDateTime(election.endTime)}</span>
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
                  </div>
                  
                  <div className="management-actions">
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
          <div className="modal-dialog">
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
          <div className="modal-dialog">
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
                    disabled={updatingElection === editingElection.id || formData.positionIds.length === 0}
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
