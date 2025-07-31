import { useState, useCallback } from 'react';

export const useElectionForm = () => {
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

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      positionIds: [],
      newPositions: [],
      newCandidates: [],
      selectedCandidateIds: []
    });
    setCurrentStep(1);
    setTempPositions([]);
    setTempCandidates([]);
  };

  const addNewPosition = () => {
    const newPosition = {
      id: '',
      name: '',
      voteLimit: 1,
      displayOrder: tempPositions.length + 1,
      isNew: true
    };
    setTempPositions([...tempPositions, newPosition]);
  };

  const updateTempPosition = useCallback((index, field, value) => {
    setTempPositions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const removeTempPosition = (index) => {
    const positionToRemove = tempPositions[index];
    setTempPositions(prev => prev.filter((_, i) => i !== index));
    
    // Remove candidates associated with this position
    setTempCandidates(prev => prev.filter(candidate => candidate.positionId !== positionToRemove.id));
  };

  const addCandidateToPosition = (positionId) => {
    const newCandidate = {
      id: `temp-${Date.now()}-${Math.random()}`,
      name: '',
      positionId: positionId,
      departmentId: '',
      photo: null,
      platform: '',
      isNew: true
    };
    setTempCandidates([...tempCandidates, newCandidate]);
  };

  const updateTempCandidate = useCallback((index, field, value) => {
    setTempCandidates(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const removeTempCandidate = (index) => {
    setTempCandidates(prev => prev.filter((_, i) => i !== index));
  };

  const handlePhotoChange = (candidateIndex, file) => {
    updateTempCandidate(candidateIndex, 'photo', file);
  };

  const handleCandidateSelection = (candidateId, isSelected) => {
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        selectedCandidateIds: [...prev.selectedCandidateIds, candidateId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedCandidateIds: prev.selectedCandidateIds.filter(id => id !== candidateId)
      }));
    }
  };

  const addAllCandidates = (filteredCandidates) => {
    const allCandidateIds = filteredCandidates.map(c => c.id);
    setFormData(prev => ({
      ...prev,
      selectedCandidateIds: [...new Set([...prev.selectedCandidateIds, ...allCandidateIds])]
    }));
  };

  const removeAllCandidates = () => {
    setFormData(prev => ({
      ...prev,
      selectedCandidateIds: []
    }));
  };

  const getCandidatesForPosition = (positionId) => {
    return tempCandidates.filter(candidate => candidate.positionId === positionId);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.title && formData.description && formData.startTime && formData.endTime;
      case 2:
        return (formData.positionIds.length > 0) || (tempPositions.length > 0 && tempPositions.every(p => p.id && p.name));
      case 3:
        return true; // Candidates are optional
      case 4:
        return true; // Review step
      default:
        return false;
    }
  };

  return {
    formData,
    setFormData,
    currentStep,
    setCurrentStep,
    tempPositions,
    setTempPositions,
    tempCandidates,
    setTempCandidates,
    resetForm,
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
    prevStep,
    validateStep
  };
};