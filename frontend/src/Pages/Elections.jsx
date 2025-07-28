import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getElections, getPositions, getCandidates, createElection, updateElection, deleteElection, startElection, pauseElection, stopElection, resumeElection, endElection, getElectionPositions, createPosition, createCandidate, getDepartments } from '../services/api';
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

  // Enhanced form state for creating elections with positions and candidates
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    positionIds: [],
    // New fields for dynamic position/candidate creation
    newPositions: [],
    newCandidates: [],
    // Existing candidates selection
    selectedCandidateIds: []
  });

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [tempPositions, setTempPositions] = useState([]);
  const [tempCandidates, setTempCandidates] = useState([]);
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

      // Then, create any new candidates
      for (const candidate of tempCandidates) {
        if (candidate.isNew) {
          try {
            const candidateData = new FormData();
            candidateData.append('id', candidate.id);
            candidateData.append('name', candidate.name);
            candidateData.append('positionId', candidate.positionId);
            candidateData.append('departmentId', candidate.departmentId || '');
            candidateData.append('description', candidate.description || '');
            
            if (candidate.photoFile) {
              candidateData.append('photo', candidate.photoFile);
            }

            await createCandidate(candidateData);
          } catch (error) {
            console.error('Error creating candidate:', error);
            throw new Error(`Failed to create candidate: ${candidate.name}`);
          }
        }
      }

      // Finally, create the election with all position IDs (existing + new)
      const allPositionIds = [
        ...formData.positionIds,
        ...createdPositions.map(p => p.id)
      ];

      const electionData = {
        id: crypto.randomUUID(),
        title: formData.title,
        description: formData.description,
        startTime: new Date(formData.startTime).toISOString().slice(0, 19).replace('T', ' '),
        endTime: new Date(formData.endTime).toISOString().slice(0, 19).replace('T', ' '),
        positionIds: allPositionIds,
        candidateIds: formData.selectedCandidateIds
      };

      await createElection(electionData);
      
      setSuccess('Election created successfully with all positions and candidates!');
      setShowCreateModal(false);
      resetForm();
      await fetchElectionsData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error creating election:', error);
      setError(error.response?.data?.error || error.message || 'Failed to create election');
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

  const openCreateModal = async () => {
    setEditingElection(null);
    resetForm();
    setShowCreateModal(true);
    // Fetch existing candidates for selection
    await fetchExistingCandidates();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      positionIds: [],
      // New fields for dynamic position/candidate creation
      newPositions: [],
      newCandidates: [],
      // Existing candidates selection
      selectedCandidateIds: []
    });
    setCurrentStep(1);
    setTempPositions([]);
    setTempCandidates([]);
    setExistingCandidates([]);
  };

  // Helper functions for multi-step form
  const addNewPosition = () => {
    const newPosition = {
      id: '',
      name: '',
      voteLimit: 1,
      displayOrder: tempPositions.length + 1,
      isNew: true,
      candidates: []
    };
    setTempPositions([...tempPositions, newPosition]);
  };

  const updateTempPosition = useCallback((index, field, value) => {
    setTempPositions(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  }, []);

  const removeTempPosition = (index) => {
    setTempPositions(tempPositions.filter((_, i) => i !== index));
    // Also remove associated candidates
    const positionId = tempPositions[index]?.id;
    if (positionId) {
      setTempCandidates(tempCandidates.filter(c => c.positionId !== positionId));
    }
  };

  const addCandidateToPosition = (positionId) => {
    const newCandidate = {
      id: crypto.randomUUID(),
      name: '',
      positionId: positionId,
      departmentId: '',
      description: '',
      photoFile: null,
      isNew: true
    };
    setTempCandidates([...tempCandidates, newCandidate]);
  };

  const updateTempCandidate = useCallback((index, field, value) => {
    setTempCandidates(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  }, []);

  const removeTempCandidate = (index) => {
    setTempCandidates(tempCandidates.filter((_, i) => i !== index));
  };

  const handlePhotoChange = (candidateIndex, file) => {
    const updated = [...tempCandidates];
    updated[candidateIndex] = { ...updated[candidateIndex], photoFile: file };
    setTempCandidates(updated);
  };

  // Candidate selection functions
  const fetchExistingCandidates = async () => {
    try {
      setLoadingCandidates(true);
      const candidates = await getCandidates();
      setExistingCandidates(candidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Failed to load existing candidates');
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleCandidateSelection = (candidateId, isSelected) => {
    setFormData(prev => {
      const updated = { ...prev };
      if (isSelected) {
        if (!updated.selectedCandidateIds.includes(candidateId)) {
          updated.selectedCandidateIds = [...updated.selectedCandidateIds, candidateId];
        }
      } else {
        updated.selectedCandidateIds = updated.selectedCandidateIds.filter(id => id !== candidateId);
      }
      return updated;
    });
  };

  const addAllCandidates = () => {
    const filteredCandidates = getFilteredCandidates();
    const allCandidateIds = filteredCandidates.map(c => c.id);
    setFormData(prev => ({
      ...prev,
      selectedCandidateIds: allCandidateIds
    }));
  };

  const removeAllCandidates = () => {
    setFormData(prev => ({
      ...prev,
      selectedCandidateIds: []
    }));
  };

  const getCandidatesForPosition = (positionId) => {
    return existingCandidates.filter(c => c.positionId === positionId);
  };

  // Get candidates for selected positions only
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

  const nextStep = () => {
    if (currentStep === 1 && (!formData.title || !formData.startTime || !formData.endTime)) {
      setError('Please fill in all required fields');
      return;
    }
    if (currentStep === 2) {
      // Check if we have at least one position (existing or new)
      if (tempPositions.length === 0 && formData.positionIds.length === 0) {
        setError('Please add at least one position');
        return;
      }
      
      // Validate new positions
      for (const position of tempPositions) {
        if (!position.id || !position.name) {
          setError(`Position ${tempPositions.indexOf(position) + 1} is missing required fields (ID and Name)`);
          return;
        }
        
        // Check for duplicate IDs within new positions (case-insensitive)
        const duplicateId = tempPositions.filter(p => p.id.toLowerCase() === position.id.toLowerCase()).length > 1;
        if (duplicateId) {
          setError(`Duplicate Position ID: "${position.id}". Each position must have a unique ID.`);
          return;
        }
        
        // Check for duplicate names within new positions (case-insensitive)
        const duplicateName = tempPositions.filter(p => p.name.toLowerCase() === position.name.toLowerCase()).length > 1;
        if (duplicateName) {
          setError(`Duplicate Position Name: "${position.name}". Each position must have a unique name.`);
          return;
        }
        
        // Check if ID conflicts with existing positions (case-insensitive)
        const existingPosition = positions.find(p => p.id.toLowerCase() === position.id.toLowerCase());
        if (existingPosition) {
          setError(`Position ID "${position.id}" already exists. Please use a different ID.`);
          return;
        }
        
        // Check if name conflicts with existing positions (case-insensitive)
        const existingPositionName = positions.find(p => p.name.toLowerCase() === position.name.toLowerCase());
        if (existingPositionName) {
          setError(`Position name "${position.name}" already exists. Please use a different name.`);
          return;
        }
      }
    }
    
    if (currentStep === 3) {
      // Check if we have at least some candidates (existing or new)
      const totalCandidates = formData.selectedCandidateIds.length + tempCandidates.length;
      if (totalCandidates === 0) {
        setError('Please select at least one candidate or add new candidates');
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
    setError('');
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setError('');
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
    
    // If status is null/undefined, treat as 'pending' (default status)
    const status = election.status || 'pending';
    
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
            <p className="dashboard-subtitle-pro">Create complete ballots with positions and candidates in one streamlined process</p>
          </div>
          <div className="dashboard-header-actions">
            <button
              className="btn btn-custom-blue"
              onClick={openCreateModal}
              disabled={elections.some(e => e.status !== 'ended')}
              title={elections.some(e => e.status !== 'ended') ? "End the current election first" : ""}
            >
              <i className="fas fa-plus me-2"></i>
              Create Ballot with Positions & Candidates
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
                  Create New Election - Step {currentStep} of 3
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
                {/* Step 1: Basic Election Info */}
                {currentStep === 1 && (
                  <div>
                  <div className="mb-3">
                      <label className="form-label">Election Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g., Student Council Election 2024"
                      required
                    />
                  </div>
                  <div className="mb-3">
                      <label className="form-label">Description *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Describe the purpose and scope of this election..."
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                          <label className="form-label">Start Time *</label>
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
                          <label className="form-label">End Time *</label>
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
                  </div>
                )}

                {/* Step 2: Positions Setup */}
                {currentStep === 2 && (
                  <div>
                    <div className="mb-4">
                      <h6 className="mb-3">
                        <i className="fas fa-list me-2"></i>
                        Select Existing Positions
                      </h6>
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
                                {position.name} (Vote Limit: {position.voteLimit})
                            </label>
                          </div>
                        ))
                      ) : (
                          <p className="text-muted">No existing positions available.</p>
                      )}
                    </div>
                    </div>

                                          <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6>
                            <i className="fas fa-plus me-2"></i>
                            Add New Positions
                          </h6>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={addNewPosition}
                          >
                            <i className="fas fa-plus me-1"></i>
                            Add Position
                          </button>
                        </div>
                        <div className="alert alert-info mb-3">
                          <i className="fas fa-info-circle me-2"></i>
                          <strong>Tip:</strong> Position IDs and names must be unique. Use descriptive names like "President", "Vice President", etc. Position IDs are typically short codes like "PRES", "VP", "SEC".
                        </div>
                      
                                             {tempPositions.map((position, index) => (
                         <div key={`temp-position-${index}`} className="card mb-3">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <h6 className="card-title mb-0">New Position {index + 1}</h6>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeTempPosition(index)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Position ID *</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={position.id}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      updateTempPosition(index, 'id', value);
                                    }}
                                    onBlur={(e) => {
                                      // Convert to uppercase on blur for consistency
                                      const value = e.target.value.toUpperCase();
                                      if (value !== position.id) {
                                        updateTempPosition(index, 'id', value);
                                      }
                                    }}
                                    placeholder="e.g., PRES, VP, SEC"
                                    required
                                  />
                                  <small className="text-muted">Type normally, will convert to uppercase when you leave the field</small>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Position Name *</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={position.name}
                                    onChange={(e) => updateTempPosition(index, 'name', e.target.value)}
                                    placeholder="e.g., President, Vice President"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Vote Limit</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    min="1"
                                    value={position.voteLimit}
                                    onChange={(e) => updateTempPosition(index, 'voteLimit', parseInt(e.target.value))}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Display Order</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    min="0"
                                    value={position.displayOrder}
                                    onChange={(e) => updateTempPosition(index, 'displayOrder', parseInt(e.target.value))}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Candidates Setup */}
                {currentStep === 3 && (
                  <div>
                    {/* Existing Candidates Selection */}
                    <div className="mb-4">
                      <div className="candidate-selection-header">
                        <div className="header-content">
                          <div className="header-title">
                            <i className="fas fa-users"></i>
                            <span className="title-text">Select Existing Candidates</span>
                  </div>
                          <div className="header-actions">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success action-btn"
                              onClick={addAllCandidates}
                              disabled={loadingCandidates || getFilteredCandidates().length === 0}
                            >
                              <i className="fas fa-check-double"></i>
                              <span>Add All</span>
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger action-btn"
                              onClick={removeAllCandidates}
                              disabled={formData.selectedCandidateIds.length === 0}
                            >
                              <i className="fas fa-times"></i>
                              <span>Remove All</span>
                            </button>
                </div>
                        </div>
                        {getFilteredCandidates().length > 0 && (
                          <div className="header-subtitle">
                            <span className="candidate-count">
                              <i className="fas fa-info-circle me-1"></i>
                              {getFilteredCandidates().length} candidates available for selected positions
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {loadingCandidates ? (
                        <div className="text-center py-3">
                          <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <span className="text-muted">Loading existing candidates...</span>
                        </div>
                      ) : getFilteredCandidates().length > 0 ? (
                        <div className="candidate-selection-grid">
                          {getFilteredCandidates().map(candidate => (
                            <div key={candidate.id} className={`candidate-selection-card ${formData.selectedCandidateIds.includes(candidate.id) ? 'selected' : ''}`}>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`candidate-${candidate.id}`}
                                  checked={formData.selectedCandidateIds.includes(candidate.id)}
                                  onChange={(e) => handleCandidateSelection(candidate.id, e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor={`candidate-${candidate.id}`}>
                                  <div className="candidate-card-header">
                                    <div className="candidate-photo-container">
                                      {candidate.photoUrl && candidate.photoUrl.trim() !== '' ? (
                                        <img 
                                          src={candidate.photoUrl} 
                                          alt={candidate.name}
                                          className="candidate-photo"
                                          onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                          }}
                                          onLoad={(e) => {
                                            // Ensure image fits properly
                                            e.target.style.maxWidth = '100%';
                                            e.target.style.maxHeight = '100%';
                                            e.target.style.objectFit = 'cover';
                                            e.target.style.objectPosition = 'center';
                                          }}
                                        />
                                      ) : null}
                                      <div className="candidate-photo-placeholder" style={{ display: candidate.photoUrl && candidate.photoUrl.trim() !== '' ? 'none' : 'flex' }}>
                                        <i className="fas fa-user"></i>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="candidate-card-body">
                                    <div className="candidate-info">
                                      <div className="candidate-name">
                                        {candidate.name}
                                      </div>
                                      <div className="candidate-position">
                                        {candidate.positionName}
                                      </div>
                                    </div>
                                  </div>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="alert alert-info">
                          <i className="fas fa-info-circle me-2"></i>
                          {existingCandidates.length === 0 ? 
                            'No existing candidates available. You can add new candidates below.' :
                            'No candidates available for the selected positions. Please select different positions or add new candidates below.'
                          }
                        </div>
                      )}
                    </div>

                    {/* New Candidates for New Positions */}
                    {tempPositions.length > 0 && (
                      <div className="mb-4">
                        <h6 className="mb-3">
                          <i className="fas fa-plus me-2"></i>
                          Add New Candidates for New Positions
                        </h6>
                        
                        {tempPositions.map((position, posIndex) => (
                          <div key={`temp-position-${posIndex}`} className="card mb-4">
                            <div className="card-header">
                              <h6 className="mb-0">
                                <i className="fas fa-user-tie me-2"></i>
                                {position.name || `Position ${posIndex + 1}`}
                              </h6>
                            </div>
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted">Candidates for this position</span>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => addCandidateToPosition(position.id)}
                                >
                                  <i className="fas fa-plus me-1"></i>
                                  Add Candidate
                                </button>
                              </div>
                              
                              {tempCandidates
                                .filter(candidate => candidate.positionId === position.id)
                                .map((candidate, candidateIndex) => {
                                  const globalCandidateIndex = tempCandidates.findIndex(c => c.id === candidate.id);
                                  return (
                                    <div key={`temp-candidate-${globalCandidateIndex}`} className="card mb-3">
                                      <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                          <h6 className="card-title mb-0">Candidate {candidateIndex + 1}</h6>
                                          <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => removeTempCandidate(globalCandidateIndex)}
                                          >
                                            <i className="fas fa-trash"></i>
                                          </button>
                                        </div>
                                        <div className="row">
                                          <div className="col-md-6">
                                            <div className="mb-3">
                                              <label className="form-label">Candidate Name *</label>
                                              <input
                                                type="text"
                                                className="form-control"
                                                value={candidate.name}
                                                onChange={(e) => updateTempCandidate(globalCandidateIndex, 'name', e.target.value)}
                                                placeholder="Enter candidate name"
                                                required
                                              />
                                            </div>
                                          </div>
                                          <div className="col-md-6">
                                            <div className="mb-3">
                                              <label className="form-label">Department/Group</label>
                                              <select
                                                className="form-select"
                                                value={candidate.departmentId}
                                                onChange={(e) => updateTempCandidate(globalCandidateIndex, 'departmentId', e.target.value)}
                                              >
                                                <option value="">Select a department</option>
                                                {departments.map(department => (
                                                  <option key={department.id} value={department.id}>
                                                    {department.name}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row">
                                          <div className="col-md-6">
                                            <div className="mb-3">
                                              <label className="form-label">Photo (Optional)</label>
                                              <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                onChange={(e) => handlePhotoChange(globalCandidateIndex, e.target.files[0])}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        <div className="mb-3">
                                          <label className="form-label">Description/Platform</label>
                                          <textarea
                                            className="form-control"
                                            rows="3"
                                            value={candidate.description}
                                            onChange={(e) => updateTempCandidate(globalCandidateIndex, 'description', e.target.value)}
                                            placeholder="Describe the candidate's platform, qualifications, or vision..."
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              
                              {tempCandidates.filter(c => c.positionId === position.id).length === 0 && (
                                <div className="text-center py-3">
                                  <p className="text-muted mb-2">No candidates added yet</p>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => addCandidateToPosition(position.id)}
                                  >
                                    <i className="fas fa-plus me-1"></i>
                                    Add First Candidate
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

                <div className="modal-footer">
                <div className="d-flex justify-content-between w-100">
                  <div>
                    {currentStep > 1 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                        onClick={prevStep}
                      >
                        <i className="fas fa-arrow-left me-1"></i>
                        Previous
                      </button>
                    )}
                  </div>
                  
                  <div>
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                    
                    {currentStep < 3 ? (
                  <button
                        type="button"
                    className="btn btn-primary"
                        onClick={nextStep}
                      >
                        Next
                        <i className="fas fa-arrow-right ms-1"></i>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-success"
                        onClick={handleCreateElection}
                        disabled={loading}
                  >
                    {loading ? (
                      <i className="fas fa-spinner fa-spin me-1"></i>
                    ) : (
                          <i className="fas fa-check me-1"></i>
                    )}
                    Create Election
                  </button>
                    )}
                </div>
                </div>
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
