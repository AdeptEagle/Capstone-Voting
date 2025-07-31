import { useState } from 'react';
import { 
  startElection, 
  pauseElection, 
  stopElection, 
  resumeElection, 
  endElection,
  deleteElection,
  createElection,
  updateElection,
  createPosition,
  createCandidate,
  getElectionPositions
} from '../services/api';

export const useElectionActions = () => {
  const [updatingElection, setUpdatingElection] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateElectionState = (elections, setElections, electionId, updatedElection) => {
    setElections(elections.map(election => 
      election.id === electionId ? updatedElection : election
    ));
  };

  const executeElectionAction = async (action, electionId, elections, setElections, setSuccess, setError, successMessage) => {
    try {
      setUpdatingElection(electionId);
      setError('');
      setSuccess('');

      const updatedElection = await action(electionId);
      updateElectionState(elections, setElections, electionId, updatedElection);
      setSuccess(successMessage);
    } catch (error) {
      console.error(`Error executing election action:`, error);
      setError(`Failed to perform action on election`);
    } finally {
      setUpdatingElection(null);
    }
  };

  const handleStartElection = (electionId, elections, setElections, setSuccess, setError) => {
    return executeElectionAction(
      startElection, 
      electionId, 
      elections, 
      setElections, 
      setSuccess, 
      setError, 
      'Election started successfully!'
    );
  };

  const handlePauseElection = (electionId, elections, setElections, setSuccess, setError) => {
    return executeElectionAction(
      pauseElection, 
      electionId, 
      elections, 
      setElections, 
      setSuccess, 
      setError, 
      'Election paused successfully!'
    );
  };

  const handleStopElection = (electionId, elections, setElections, setSuccess, setError) => {
    return executeElectionAction(
      stopElection, 
      electionId, 
      elections, 
      setElections, 
      setSuccess, 
      setError, 
      'Election stopped successfully!'
    );
  };

  const handleResumeElection = (electionId, elections, setElections, setSuccess, setError) => {
    return executeElectionAction(
      resumeElection, 
      electionId, 
      elections, 
      setElections, 
      setSuccess, 
      setError, 
      'Election resumed successfully!'
    );
  };

  const handleEndElection = (electionId, elections, setElections, setSuccess, setError) => {
    return executeElectionAction(
      endElection, 
      electionId, 
      elections, 
      setElections, 
      setSuccess, 
      setError, 
      'Election ended successfully!'
    );
  };

  const handleDeleteElection = async (electionId, elections, setElections, setSuccess, setError) => {
    try {
      setUpdatingElection(electionId);
      setError('');
      setSuccess('');

      await deleteElection(electionId);
      setElections(elections.filter(election => election.id !== electionId));
      setSuccess('Election deleted successfully!');
    } catch (error) {
      console.error('Error deleting election:', error);
      setError('Failed to delete election');
    } finally {
      setUpdatingElection(null);
    }
  };

  const handleCreateElection = async (formData, tempPositions, tempCandidates, elections, setElections, setSuccess, setError) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // First, create any new positions
      const createdPositions = [];
      for (const position of tempPositions) {
        if (position.isNew) {
          try {
            const newPosition = await createPosition(position);
            createdPositions.push(newPosition.id);
          } catch (error) {
            console.error('Error creating position:', error);
            throw new Error(`Failed to create position: ${position.name}`);
          }
        } else {
          createdPositions.push(position.id);
        }
      }

      // Now create candidates for each position
      const candidateIds = [];
      for (const candidate of tempCandidates) {
        if (candidate.isNew) {
          try {
            const newCandidate = await createCandidate(candidate);
            candidateIds.push(newCandidate.id);
          } catch (error) {
            console.error('Error creating candidate:', error);
            throw new Error(`Failed to create candidate: ${candidate.name}`);
          }
        } else {
          candidateIds.push(candidate.id);
        }
      }

      // Combine existing and new positions
      const allPositionIds = [
        ...formData.positionIds, // existing positions
        ...createdPositions      // newly created positions
      ];

      // Combine existing and new candidates
      const allCandidateIds = [
        ...formData.selectedCandidateIds, // existing candidates
        ...candidateIds                   // newly created candidates
      ];

      // Create the election
      const electionData = {
        ...formData,
        positionIds: allPositionIds,
        candidateIds: allCandidateIds
      };

      const newElection = await createElection(electionData);
      setElections(prev => [...prev, newElection]);
      setSuccess('Election created successfully!');
      return newElection;
    } catch (error) {
      console.error('Error creating election:', error);
      setError(error.message || 'Failed to create election');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateElection = async (editingElection, formData, elections, setElections, setSuccess, setError) => {
    if (!editingElection) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const updatedElection = await updateElection(editingElection.id, formData);
      updateElectionState(elections, setElections, editingElection.id, updatedElection);
      setSuccess('Election updated successfully!');
      return updatedElection;
    } catch (error) {
      console.error('Error updating election:', error);
      setError('Failed to update election');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (election, setFormData, setLoadingPositions, setError) => {
    try {
      setLoadingPositions(true);
      
      // Fetch positions for this election
      const electionPositions = await getElectionPositions(election.id);
      
      setFormData({
        title: election.title,
        description: election.description,
        startDateTime: election.startDateTime ? election.startDateTime.slice(0, 16) : '',
        endDateTime: election.endDateTime ? election.endDateTime.slice(0, 16) : '',
        positionIds: electionPositions.map(pos => pos.id)
      });
      
      return election;
    } catch (error) {
      console.error('Error fetching election positions:', error);
      setError('Failed to load election details');
      throw error;
    } finally {
      setLoadingPositions(false);
    }
  };

  return {
    updatingElection,
    loading,
    handleStartElection,
    handlePauseElection,
    handleStopElection,
    handleResumeElection,
    handleEndElection,
    handleDeleteElection,
    handleCreateElection,
    handleUpdateElection,
    handleEditClick
  };
};