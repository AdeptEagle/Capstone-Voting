import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getPositions, 
  getAllCandidates, 
  getDepartments, 
  deleteElection,
  startElection,
  pauseElection,
  stopElection,
  resumeElection,
  endElection
} from '../services/api';
import { useElection } from '../contexts/ElectionContext';
import MultiStepForm from '../components/Elections/MultiStepForm';
import CountdownTimer from '../components/Elections/CountdownTimer';
import { useElectionForm } from '../hooks/useElectionForm';
import { useElectionActions } from '../hooks/useElectionActions';
import { createInitialElectionState } from '../utils/electionStateUtils';
import './Elections.css';

const Elections = () => {
  const navigate = useNavigate();
  const { activeElection, allElections, loading: contextLoading, refreshElection } = useElection();
  
  // Initialize state
  const initialState = createInitialElectionState();
  const [positions, setPositions] = useState(initialState.positions);
  const [existingCandidates, setExistingCandidates] = useState(initialState.existingCandidates);
  const [departments, setDepartments] = useState(initialState.departments);
  const [loading, setLoading] = useState(initialState.loading);
  const [error, setError] = useState(initialState.error);
  const [success, setSuccess] = useState(initialState.success);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [updatingElection, setUpdatingElection] = useState(null);

  // Use election actions hook
  const {
    handleCreateElection,
    loading: actionsLoading
  } = useElectionActions();

  // Use custom hooks
  const {
    formData,
    setFormData,
    currentStep,
    tempPositions,
    setTempPositions,
    tempCandidates,
    setTempCandidates,
    resetForm: resetFormHook,
    addNewPosition,
    updateTempPosition,
    removeTempPosition,
    addCandidateToPosition,
    updateTempCandidate,
    removeTempCandidate,
    handlePhotoChange,
    handleCandidateSelection,
    addAllCandidates,
    removeAllCandidates,
    getCandidatesForPosition,
    nextStep,
    prevStep
  } = useElectionForm();

  useEffect(() => {
    fetchElectionsData();
  }, []);

  const fetchElectionsData = async () => {
    try {
      setLoading(true);
      const [positionsData, departmentsData] = await Promise.all([
        getPositions(),
        getDepartments()
      ]);

      setPositions(positionsData || []);
      setDepartments(departmentsData || []);
    } catch (error) {
      console.error('Error fetching elections data:', error);
      setError('Failed to load elections data');
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingCandidates = async () => {
    try {
      const candidates = await getAllCandidates();
      setExistingCandidates(candidates || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Failed to load existing candidates');
    }
  };

  const getFilteredCandidates = () => {
    const selectedPositionIds = [
      ...formData.positionIds,
      ...tempPositions.map(p => p.id)
    ];
    
    if (selectedPositionIds.length === 0) {
      return [];
    }
    
    return existingCandidates.filter(candidate => 
      selectedPositionIds.includes(candidate.positionId)
    );
  };

  // Enhanced reset form
  const resetForm = () => {
    resetFormHook();
    setExistingCandidates([]);
  };

  // Enhanced open create modal with candidate fetching
  const openCreateModalWithCandidates = async () => {
    resetForm();
    setShowCreateModal(true);
    await fetchExistingCandidates();
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    resetForm();
    setError('');
  };

  const onCreateElection = async (e) => {
    e.preventDefault();
    
    // Check if there's already an active election
    if (activeElection && activeElection.status !== 'ended') {
      setError('Only one ballot can exist at a time. Please end or delete the current ballot first.');
      return;
    }

    try {
      // Use the hook to handle the complex creation logic
      await handleCreateElection(formData, tempPositions, tempCandidates, allElections, () => {}, setSuccess, setError);
      closeCreateModal();
      await refreshElection(); // Refresh election context
      await fetchElectionsData(); // Refresh local data
    } catch (error) {
      console.error('Error creating election:', error);
      setError(error.response?.data?.error || 'Failed to create ballot');
    }
  };

  const handleStatusChange = async (electionId, action) => {
    setUpdatingElection(electionId);
    try {
      let result;
      switch (action) {
        case 'start':
          result = await startElection(electionId);
          setSuccess('Ballot started successfully! Users can now vote.');
          break;
        case 'pause':
          result = await pauseElection(electionId);
          setSuccess('Ballot paused successfully.');
          break;
        case 'resume':
          result = await resumeElection(electionId);
          setSuccess('Ballot resumed successfully.');
          break;
        case 'stop':
          result = await stopElection(electionId);
          setSuccess('Ballot stopped successfully.');
          break;
        case 'end':
          result = await endElection(electionId);
          setSuccess('Ballot ended and saved to history successfully.');
          break;
        default:
          throw new Error('Invalid action');
      }
      
      await refreshElection();
    } catch (error) {
      console.error(`Error ${action}ing election:`, error);
      setError(`Failed to ${action} ballot: ${error.response?.data?.error || error.message}`);
    } finally {
      setUpdatingElection(null);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
    setDeleteConfirmation('');
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteConfirmation('');
  };

  const handleDeleteElection = async () => {
    if (deleteConfirmation.toLowerCase() !== 'delete') {
      setError('Please type "delete" to confirm');
      return;
    }

    try {
      setLoading(true);
      await deleteElection(activeElection.id);
      setSuccess('Ballot deleted successfully!');
      closeDeleteModal();
      await refreshElection();
    } catch (error) {
      console.error('Error deleting election:', error);
      setError('Failed to delete ballot');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'paused': return 'bg-warning';
      case 'stopped': return 'bg-secondary';
      case 'ended': return 'bg-info';
      case 'pending': return 'bg-primary';
      default: return 'bg-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'fas fa-play-circle';
      case 'paused': return 'fas fa-pause-circle';
      case 'stopped': return 'fas fa-stop-circle';
      case 'ended': return 'fas fa-check-circle';
      case 'pending': return 'fas fa-clock';
      default: return 'fas fa-circle';
    }
  };

  const canPerformAction = (action) => {
    if (!activeElection) return false;
    
    switch (action) {
      case 'start':
        return activeElection.status === 'pending';
      case 'pause':
        return activeElection.status === 'active';
      case 'resume':
        return activeElection.status === 'paused';
      case 'stop':
        return activeElection.status === 'active' || activeElection.status === 'paused';
      case 'end':
        return activeElection.status === 'stopped';
      case 'delete':
        return activeElection.status !== 'active';
      default:
        return false;
    }
  };

  if (contextLoading || loading) {
    return (
      <div className="elections-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading ballot management...</p>
      </div>
    );
  }

  return (
    <div className="elections-container">
      {/* Header */}
      <div className="dashboard-header-pro">
        <div className="dashboard-header-row">
          <div>
            <h1 className="dashboard-title-pro">
              <i className="fas fa-vote-yea me-3"></i>
              Ballot Management
            </h1>
            <p className="dashboard-subtitle-pro">Manage your voting ballot - Only one ballot allowed at a time</p>
          </div>
          <div className="dashboard-actions-pro">
            {!activeElection || activeElection.status === 'ended' ? (
              <button
                className="btn btn-success btn-lg"
                onClick={openCreateModalWithCandidates}
                disabled={loading}
              >
                <i className="fas fa-plus me-2"></i>
                Create New Ballot
              </button>
            ) : (
              <div className="d-flex gap-2">
                {canPerformAction('start') && (
                  <button
                    className="btn btn-success"
                    onClick={() => handleStatusChange(activeElection.id, 'start')}
                    disabled={updatingElection === activeElection.id}
                  >
                    <i className="fas fa-play me-2"></i>
                    Start Ballot
                  </button>
                )}
                {canPerformAction('pause') && (
                  <button
                    className="btn btn-warning"
                    onClick={() => handleStatusChange(activeElection.id, 'pause')}
                    disabled={updatingElection === activeElection.id}
                  >
                    <i className="fas fa-pause me-2"></i>
                    Pause
                  </button>
                )}
                {canPerformAction('resume') && (
                  <button
                    className="btn btn-info"
                    onClick={() => handleStatusChange(activeElection.id, 'resume')}
                    disabled={updatingElection === activeElection.id}
                  >
                    <i className="fas fa-play me-2"></i>
                    Resume
                  </button>
                )}
                {canPerformAction('stop') && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleStatusChange(activeElection.id, 'stop')}
                    disabled={updatingElection === activeElection.id}
                  >
                    <i className="fas fa-stop me-2"></i>
                    Stop
                  </button>
                )}
                {canPerformAction('end') && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleStatusChange(activeElection.id, 'end')}
                    disabled={updatingElection === activeElection.id}
                  >
                    <i className="fas fa-save me-2"></i>
                    End & Save to History
                  </button>
                )}
                {canPerformAction('delete') && (
                  <button
                    className="btn btn-danger"
                    onClick={openDeleteModal}
                    disabled={updatingElection === activeElection.id}
                  >
                    <i className="fas fa-trash me-2"></i>
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
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

      {/* Current Ballot Status */}
      <div className="current-ballot-section">
        {activeElection && activeElection.status !== 'ended' ? (
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="fas fa-ballot-check me-2"></i>
                Current Ballot
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8">
                  <h6 className="card-title">{activeElection.title}</h6>
                  <p className="card-text text-muted">{activeElection.description}</p>
                  <div className="row">
                    <div className="col-sm-6">
                      <small className="text-muted">
                        <i className="fas fa-calendar-start me-1"></i>
                        Start: {new Date(activeElection.startTime).toLocaleString()}
                      </small>
                    </div>
                    <div className="col-sm-6">
                      <small className="text-muted">
                        <i className="fas fa-calendar-end me-1"></i>
                        End: {new Date(activeElection.endTime).toLocaleString()}
                      </small>
                    </div>
                  </div>
                  {activeElection.status === 'active' && (
                    <div className="mt-2">
                      <div className="alert alert-success mb-0">
                        <i className="fas fa-users me-2"></i>
                        <strong>Users can now vote!</strong> The ballot is currently active.
                      </div>
                    </div>
                  )}

                  {/* Countdown Timer */}
                  {activeElection.endTime && (activeElection.status === 'active' || activeElection.status === 'pending') && (
                    <div className="mt-3">
                      <CountdownTimer
                        endTime={activeElection.endTime}
                        electionId={activeElection.id}
                        electionTitle={activeElection.title}
                        onExpired={(electionId) => {
                          console.log(`Election ${electionId} expired, refreshing...`);
                          refreshElection();
                        }}
                        size="normal"
                        showTitle={false}
                        variant="primary"
                      />
                    </div>
                  )}
                </div>
                <div className="col-md-4 text-end">
                  <span className={`badge ${getStatusBadgeClass(activeElection.status)} fs-6 p-2`}>
                    <i className={`${getStatusIcon(activeElection.status)} me-2`}></i>
                    {activeElection.status.toUpperCase()}
                  </span>
                  {updatingElection === activeElection.id && (
                    <div className="spinner-border spinner-border-sm ms-2" role="status">
                      <span className="visually-hidden">Updating...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-content">
              <i className="fas fa-vote-yea fa-4x text-muted mb-3"></i>
              <h3 className="text-muted">No Active Ballot</h3>
              <p className="text-muted mb-4">Create a new ballot to start managing your election</p>
              <button
                className="btn btn-primary btn-lg"
                onClick={openCreateModalWithCandidates}
                disabled={loading}
              >
                <i className="fas fa-plus me-2"></i>
                Create Your First Ballot
              </button>
            </div>
          </div>
        )}
      </div>

      {/* History Section */}
      {allElections.some(e => e.status === 'ended') && (
        <div className="history-section">
          <h5 className="mb-3">
            <i className="fas fa-history me-2"></i>
            Ballot History
          </h5>
          <div className="row">
            {allElections
              .filter(election => election.status === 'ended')
              .map(election => (
                <div key={election.id} className="col-lg-6 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title">{election.title}</h6>
                      <p className="card-text text-muted small">{election.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Ended: {new Date(election.endTime).toLocaleDateString()}
                        </small>
                        <span className="badge bg-info">
                          <i className="fas fa-check-circle me-1"></i>
                          ENDED
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Create Election Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Create New Ballot - Step {currentStep} of 4
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeCreateModal}
                ></button>
              </div>
              
              {error && (
                <div className="alert alert-danger m-3">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <div className="modal-body">
                <MultiStepForm
                  currentStep={currentStep}
                  formData={formData}
                  setFormData={setFormData}
                  tempPositions={tempPositions}
                  setTempPositions={setTempPositions}
                  tempCandidates={tempCandidates}
                  setTempCandidates={setTempCandidates}
                  existingCandidates={existingCandidates}
                  departments={departments}
                  positions={positions}
                  onAddNewPosition={addNewPosition}
                  onUpdateTempPosition={updateTempPosition}
                  onRemoveTempPosition={removeTempPosition}
                  onAddCandidateToPosition={addCandidateToPosition}
                  onUpdateTempCandidate={updateTempCandidate}
                  onRemoveTempCandidate={removeTempCandidate}
                  onPhotoChange={handlePhotoChange}
                  onCandidateSelection={handleCandidateSelection}
                  onAddAllCandidates={() => addAllCandidates(getFilteredCandidates())}
                  onRemoveAllCandidates={removeAllCandidates}
                  getCandidatesForPosition={getCandidatesForPosition}
                  getFilteredCandidates={getFilteredCandidates}
                  onNextStep={nextStep}
                  onPrevStep={prevStep}
                  onSubmit={onCreateElection}
                  loading={loading || actionsLoading}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Delete Ballot
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeDeleteModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-danger">
                  <strong>Warning:</strong> This action cannot be undone!
                </div>
                <p>
                  You are about to permanently delete the ballot: 
                  <strong> "{activeElection?.title}"</strong>
                </p>
                <p>Type <strong>delete</strong> to confirm:</p>
                <input
                  type="text"
                  className="form-control"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type 'delete' to confirm"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteElection}
                  disabled={deleteConfirmation.toLowerCase() !== 'delete' || loading}
                >
                  {loading ? (
                    <i className="fas fa-spinner fa-spin me-1"></i>
                  ) : (
                    <i className="fas fa-trash me-1"></i>
                  )}
                  Delete Ballot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Elections;