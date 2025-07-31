import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getElections, getPositions, getCandidates, createElection, updateElection, deleteElection, startElection, pauseElection, stopElection, resumeElection, endElection, getElectionPositions, createPosition, createCandidate, getDepartments } from '../services/api';
import './Elections.css';

// Import new components
import ElectionCard from '../components/Elections/ElectionCard';
import ElectionForm from '../components/Elections/ElectionForm';
import DeleteConfirmationModal from '../components/Elections/DeleteConfirmationModal';
import MultiStepForm from '../components/Elections/MultiStepForm';
import { useElectionForm } from '../hooks/useElectionForm';
import { getStatusColor, getStatusIcon, formatDateTime, getStatusActions } from '../utils/electionUtils';

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingElection, setDeletingElection] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [editingElection, setEditingElection] = useState(null);
  const [updatingElection, setUpdatingElection] = useState(null);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const navigate = useNavigate();

  // Use custom hook for form management
  const {
    formData,
    setFormData,
    currentStep,
    setCurrentStep,
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

  const [existingCandidates, setExistingCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchElectionsData();
  }, []);

  const fetchElectionsData = async () => {
    try {
      setLoading(true);
      const [elections, positions, departmentsData] = await Promise.all([
        getElections(),
        getPositions(),
        getDepartments()
      ]);

      console.log('Fetched elections:', elections); // Debug log
      setElections(elections || []);
      setPositions(positions || []);
      setDepartments(departmentsData || []);
    } catch (error) {
      console.error('Error fetching elections data:', error);
      setError('Failed to load elections data');
    } finally {
      setLoading(false);
    }
  };

  // Use the resetForm from our custom hook, but extend it for this component's needs
  const resetForm = () => {
    resetFormHook();
    setExistingCandidates([]);
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // First, create any new positions
      const createdPositions = [];
      for (const position of tempPositions) {
        if (position.isNew) {
          try {
            // Validate required fields
            if (!position.id || !position.name) {
              throw new Error(`Position ${position.id || 'Unknown'} is missing required fields (ID and Name)`);
            }
            
            const newPosition = await createPosition({
              id: position.id,
              name: position.name,
              voteLimit: position.voteLimit,
              displayOrder: position.displayOrder
            });
            createdPositions.push(newPosition);
          } catch (error) {
            console.error('Error creating position:', error);
            // Use the specific error message from the backend if available
            const errorMessage = error.response?.data?.error || error.message || `Failed to create position: ${position.name}`;
            throw new Error(errorMessage);
          }
        }
      }

      // Then create any new candidates
      const createdCandidates = [];
      for (const candidate of tempCandidates) {
        if (candidate.isNew) {
          try {
            const candidateData = new FormData();
            candidateData.append('name', candidate.name);
            candidateData.append('positionId', candidate.positionId);
            candidateData.append('departmentId', candidate.departmentId);
            candidateData.append('platform', candidate.platform || '');
            
            if (candidate.photo) {
              candidateData.append('photo', candidate.photo);
            }

            const newCandidate = await createCandidate(candidateData);
            createdCandidates.push(newCandidate);
          } catch (error) {
            console.error('Error creating candidate:', error);
            const errorMessage = error.response?.data?.error || error.message || `Failed to create candidate: ${candidate.name}`;
            throw new Error(errorMessage);
          }
        }
      }

      // Get all position IDs (existing + newly created)
      const allPositionIds = [
        ...formData.positionIds,
        ...createdPositions.map(p => p.id)
      ];

      // Create the election
      const electionData = {
        title: formData.title,
        description: formData.description,
        startTime: formData.startTime,
        endTime: formData.endTime,
        positionIds: allPositionIds,
        candidateIds: [
          ...formData.selectedCandidateIds,
          ...createdCandidates.map(c => c.id)
        ]
      };

      const newElection = await createElection(electionData);
      
      setElections([...elections, newElection]);
      setSuccess('Election created successfully!');
      setShowCreateModal(false);
      resetForm();
      
      // Refresh data to get updated positions and candidates
      await fetchElectionsData();
    } catch (error) {
      console.error('Error creating election:', error);
      setError(error.message || 'Failed to create election');
    } finally {
      setLoading(false);
    }
  };

  const handleEditElection = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const updatedElection = await updateElection(editingElection.id, {
        title: formData.title,
        description: formData.description,
        startTime: formData.startTime,
        endTime: formData.endTime,
        positionIds: formData.positionIds
      });

      setElections(elections.map(election => 
        election.id === editingElection.id ? updatedElection : election
      ));
      setSuccess('Election updated successfully!');
      setShowEditModal(false);
      setEditingElection(null);
      resetForm();
    } catch (error) {
      console.error('Error updating election:', error);
      setError('Failed to update election');
    } finally {
      setLoading(false);
    }
  };

  const handleStartElection = async (electionId) => {
    try {
      setUpdatingElection(electionId);
      setError('');
      setSuccess('');

      const updatedElection = await startElection(electionId);
      setElections(elections.map(election => 
        election.id === electionId ? updatedElection : election
      ));
      setSuccess('Election started successfully!');
    } catch (error) {
      console.error('Error starting election:', error);
      setError('Failed to start election');
    } finally {
      setUpdatingElection(null);
    }
  };

  const handlePauseElection = async (electionId) => {
    try {
      setUpdatingElection(electionId);
      setError('');
      setSuccess('');

      const updatedElection = await pauseElection(electionId);
      setElections(elections.map(election => 
        election.id === electionId ? updatedElection : election
      ));
      setSuccess('Election paused successfully!');
    } catch (error) {
      console.error('Error pausing election:', error);
      setError('Failed to pause election');
    } finally {
      setUpdatingElection(null);
    }
  };

  const handleStopElection = async (electionId) => {
    try {
      setUpdatingElection(electionId);
      setError('');
      setSuccess('');

      const updatedElection = await stopElection(electionId);
      setElections(elections.map(election => 
        election.id === electionId ? updatedElection : election
      ));
      setSuccess('Election stopped successfully!');
    } catch (error) {
      console.error('Error stopping election:', error);
      setError('Failed to stop election');
    } finally {
      setUpdatingElection(null);
    }
  };

  const handleResumeElection = async (electionId) => {
    try {
      setUpdatingElection(electionId);
      setError('');
      setSuccess('');

      const updatedElection = await resumeElection(electionId);
      setElections(elections.map(election => 
        election.id === electionId ? updatedElection : election
      ));
      setSuccess('Election resumed successfully!');
    } catch (error) {
      console.error('Error resuming election:', error);
      setError('Failed to resume election');
    } finally {
      setUpdatingElection(null);
    }
  };

  const handleEndElection = async (electionId) => {
    try {
      setUpdatingElection(electionId);
      setError('');
      setSuccess('');

      const updatedElection = await endElection(electionId);
      setElections(elections.map(election => 
        election.id === electionId ? updatedElection : election
      ));
      setSuccess('Election ended and saved to history successfully!');
    } catch (error) {
      console.error('Error ending election:', error);
      setError('Failed to end election');
    } finally {
      setUpdatingElection(null);
    }
  };

  const handleDeleteElection = async (electionId) => {
    const election = elections.find(e => e.id === electionId);
    setDeletingElection(election);
    setDeleteConfirmation('');
    setShowDeleteModal(true);
  };

  const confirmDeleteElection = async () => {
    try {
      setUpdatingElection(deletingElection.id);
      setError('');
      setSuccess('');

      await deleteElection(deletingElection.id);
      setElections(elections.filter(election => election.id !== deletingElection.id));
      setSuccess('Election deleted successfully!');
      setShowDeleteModal(false);
      setDeletingElection(null);
      setDeleteConfirmation('');
    } catch (error) {
      console.error('Error deleting election:', error);
      setError('Failed to delete election');
    } finally {
      setUpdatingElection(null);
    }
  };

  const cancelDeleteElection = () => {
    setShowDeleteModal(false);
    setDeletingElection(null);
    setDeleteConfirmation('');
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

  const openEditModal = async (election) => {
    try {
      setLoadingPositions(true);
      setEditingElection(election);
      
      // Pre-populate form with election data
      setFormData({
        title: election.title,
        description: election.description,
        startTime: election.startTime,
        endTime: election.endTime,
        positionIds: [],
        newPositions: [],
        newCandidates: [],
        selectedCandidateIds: []
      });

      // Fetch and set the positions for this election
      const electionPositions = await getElectionPositions(election.id);
      const positionIds = electionPositions.map(pos => pos.id);
      
      setFormData(prev => ({
        ...prev,
        positionIds: positionIds
      }));

      setShowEditModal(true);
    } catch (error) {
      console.error('Error loading election positions:', error);
      setError('Failed to load election positions');
    } finally {
      setLoadingPositions(false);
    }
  };

  const openCreateModal = async () => {
    setCurrentStep(1);
    resetForm();
    setShowCreateModal(true);
    // Fetch existing candidates for selection
    await fetchExistingCandidates();
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
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
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
                  onSubmit={handleCreateElection}
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
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingElection(null);
                    resetForm();
                  }}
                ></button>
              </div>
              <form onSubmit={handleEditElection}>
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        election={deletingElection}
        deleteConfirmation={deleteConfirmation}
        setDeleteConfirmation={setDeleteConfirmation}
        onConfirm={confirmDeleteElection}
        onCancel={cancelDeleteElection}
        isDeleting={updatingElection === deletingElection?.id}
      />
    </div>
  );
}

export default Elections;