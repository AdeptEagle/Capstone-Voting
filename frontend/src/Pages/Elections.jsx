import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getElections, getPositions, getCandidates, getDepartments } from '../services/api';
import './Elections.css';

// Import new components and hooks
import ElectionForm from '../components/Elections/ElectionForm';
import DeleteConfirmationModal from '../components/Elections/DeleteConfirmationModal';
import MultiStepForm from '../components/Elections/MultiStepForm';
import ElectionsList from '../components/Elections/ElectionsList';
import ElectionHeader from '../components/Elections/ElectionHeader';
import ElectionMessages from '../components/Elections/ElectionMessages';

import { useElectionForm } from '../hooks/useElectionForm';
import { useElectionActions } from '../hooks/useElectionActions';
import { useElectionModals } from '../hooks/useElectionModals';
import { createInitialElectionState, clearMessages } from '../utils/electionStateUtils';

const Elections = () => {
  // Initialize state
  const initialState = createInitialElectionState();
  const [elections, setElections] = useState(initialState.elections);
  const [positions, setPositions] = useState(initialState.positions);
  const [existingCandidates, setExistingCandidates] = useState(initialState.existingCandidates);
  const [departments, setDepartments] = useState(initialState.departments);
  const [loading, setLoading] = useState(initialState.loading);
  const [loadingPositions, setLoadingPositions] = useState(initialState.loadingPositions);
  const [loadingCandidates, setLoadingCandidates] = useState(initialState.loadingCandidates);
  const [error, setError] = useState(initialState.error);
  const [success, setSuccess] = useState(initialState.success);
  
  const navigate = useNavigate();

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

  const {
    updatingElection,
    loading: actionsLoading,
    handleStartElection,
    handlePauseElection,
    handleStopElection,
    handleResumeElection,
    handleEndElection,
    handleDeleteElection,
    handleCreateElection,
    handleUpdateElection,
    handleEditClick
  } = useElectionActions();

  const {
    showCreateModal,
    showEditModal,
    showDeleteModal,
    deletingElection,
    deleteConfirmation,
    editingElection,
    setDeleteConfirmation,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete
  } = useElectionModals();

  useEffect(() => {
    fetchElectionsData();
  }, []);

  const fetchElectionsData = async () => {
    try {
      setLoading(true);
      const [electionsData, positionsData, departmentsData] = await Promise.all([
        getElections(),
        getPositions(),
        getDepartments()
      ]);

      setElections(electionsData || []);
      setPositions(positionsData || []);
      setDepartments(departmentsData || []);
    } catch (error) {
      console.error('Error fetching elections data:', error);
      setError('Failed to load elections data');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced reset form
  const resetForm = () => {
    resetFormHook();
    setExistingCandidates([]);
  };

  const onCreateElection = async (e) => {
    e.preventDefault();
    try {
      await handleCreateElection(formData, tempPositions, tempCandidates, elections, setElections, setSuccess, setError);
      closeCreateModal(resetForm);
      await fetchElectionsData(); // Refresh data
    } catch (error) {
      // Error handled in hook
    }
  };

  const onEditElection = async (e) => {
    e.preventDefault();
    try {
      await handleUpdateElection(editingElection, formData, elections, setElections, setSuccess, setError);
      closeEditModal(resetForm);
    } catch (error) {
      // Error handled in hook
    }
  };

  // Wrapper functions for election actions
  const onStartElection = (electionId) => 
    handleStartElection(electionId, elections, setElections, setSuccess, setError);
  
  const onPauseElection = (electionId) => 
    handlePauseElection(electionId, elections, setElections, setSuccess, setError);
  
  const onStopElection = (electionId) => 
    handleStopElection(electionId, elections, setElections, setSuccess, setError);
  
  const onResumeElection = (electionId) => 
    handleResumeElection(electionId, elections, setElections, setSuccess, setError);
  
  const onEndElection = (electionId) => 
    handleEndElection(electionId, elections, setElections, setSuccess, setError);
  
  const onDeleteElection = (election) => openDeleteModal(election);
  
  const confirmDeleteElection = async () => {
    if (confirmDelete(async () => {
      await handleDeleteElection(deletingElection.id, elections, setElections, setSuccess, setError);
      closeDeleteModal();
    })) {
      // Deletion confirmed and executed
    }
  };

  const handleStatusChange = async (electionId, newStatus) => {
    switch (newStatus) {
      case 'active':
        await handleStartElection(electionId);
        break;
      case 'paused':
        await handlePauseElection(electionId);
        break;
      case 'stopped':
        await handleStopElection(electionId);
        break;
      case 'active_from_paused':
      case 'active_from_stopped':
        await handleResumeElection(electionId);
        break;
      case 'ended':
        await handleEndElection(electionId);
        break;
      default:
        console.warn('Unknown status change:', newStatus);
    }
  };

  const handleFixStatus = async (electionId) => {
    try {
      setUpdatingElection(electionId);
      setError('');
      setSuccess('');

      const election = elections.find(e => e.id === electionId);
      if (!election) {
        throw new Error('Election not found');
      }

      // Set status to 'pending' by updating the election
      const updatedElection = await updateElection(electionId, {
        ...election,
        status: 'pending'
      });

      setElections(elections.map(e => 
        e.id === electionId ? updatedElection : e
      ));
      setSuccess('Election status fixed successfully!');
    } catch (error) {
      console.error('Error fixing election status:', error);
      setError('Failed to fix election status');
    } finally {
      setUpdatingElection(null);
    }
  };

  const fetchExistingCandidates = async () => {
    try {
      setLoadingCandidates(true);
      const candidates = await getCandidates();
      setExistingCandidates(candidates || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Failed to load existing candidates');
    } finally {
      setLoadingCandidates(false);
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
      <div className="elections-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">
              <i className="fas fa-vote-yea me-3"></i>
              Election Management
            </h1>
            <p className="page-subtitle">Create, manage, and monitor election ballots</p>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-success btn-lg"
              onClick={openCreateModal}
            >
              <i className="fas fa-plus me-2"></i>
              Create New Ballot
            </button>
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

      {/* Elections Grid */}
      <div className="elections-grid">
        {elections.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <i className="fas fa-vote-yea fa-4x text-muted mb-3"></i>
              <h3 className="text-muted">No Elections Yet</h3>
              <p className="text-muted mb-4">Get started by creating your first election ballot</p>
              <button
                className="btn btn-primary btn-lg"
                onClick={openCreateModal}
              >
                <i className="fas fa-plus me-2"></i>
                Create Your First Ballot
              </button>
            </div>
          </div>
        ) : (
          <div className="row">
            {elections.map(election => (
              <div key={election.id} className="col-lg-6 col-xl-4 mb-4">
                <ElectionCard
                  election={election}
                  onEdit={openEditModal}
                  onDelete={handleDeleteElection}
                  onStatusChange={handleStatusChange}
                  isUpdating={updatingElection === election.id}
                />
              </div>
            ))}
          </div>
        )}

        {/* Quick Create Button (Floating) */}
        {elections.length > 0 && (
          <div className="floating-create-btn">
            <button
              className="btn btn-success btn-lg rounded-circle"
              onClick={openCreateModal}
              title="Create New Ballot"
            >
              <i className="fas fa-plus me-2"></i>
              Create Ballot with Positions & Candidates
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Create Election Modal with Multi-Step Form */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Create New Election - Step {currentStep} of 4
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => closeCreateModal(resetForm)}
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
                  loading={loading}
                />
              </div>
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
                                      onClick={() => closeEditModal(resetForm)}
                ></button>
              </div>
              <form onSubmit={onEditElection}>
                <div className="modal-body">
                  <ElectionForm
                    formData={formData}
                    setFormData={setFormData}
                    positions={positions}
                    loadingPositions={loadingPositions}
                    isEditing={true}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => closeEditModal(resetForm)}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        election={deletingElection}
        deleteConfirmation={deleteConfirmation}
        setDeleteConfirmation={setDeleteConfirmation}
        onConfirm={confirmDeleteElection}
        onCancel={closeDeleteModal}
        isDeleting={updatingElection === deletingElection?.id}
      />
    </div>
  );
}

export default Elections;