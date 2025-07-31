// Election state management utilities

export const createInitialElectionState = () => ({
  elections: [],
  positions: [],
  existingCandidates: [],
  departments: [],
  loading: true,
  loadingPositions: false,
  loadingCandidates: false,
  error: '',
  success: ''
});

export const updateElectionsList = (elections, electionId, updatedElection) => {
  return elections.map(election => 
    election.id === electionId ? updatedElection : election
  );
};

export const removeElectionFromList = (elections, electionId) => {
  return elections.filter(election => election.id !== electionId);
};

export const addElectionToList = (elections, newElection) => {
  return [...elections, newElection];
};

export const clearMessages = (setError, setSuccess) => {
  setError('');
  setSuccess('');
};

export const handleApiError = (error, setError, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);
  setError(error.message || defaultMessage);
};

export const handleApiSuccess = (setSuccess, message) => {
  setSuccess(message);
};

// Election validation utilities
export const validateElectionForm = (formData) => {
  const errors = {};
  
  if (!formData.title?.trim()) {
    errors.title = 'Election title is required';
  }
  
  if (!formData.description?.trim()) {
    errors.description = 'Election description is required';
  }
  
  if (!formData.startDateTime) {
    errors.startDateTime = 'Start date and time is required';
  }
  
  if (!formData.endDateTime) {
    errors.endDateTime = 'End date and time is required';
  }
  
  if (formData.startDateTime && formData.endDateTime) {
    const startDate = new Date(formData.startDateTime);
    const endDate = new Date(formData.endDateTime);
    
    if (startDate >= endDate) {
      errors.endDateTime = 'End date must be after start date';
    }
  }
  
  if (!formData.positionIds || formData.positionIds.length === 0) {
    errors.positionIds = 'At least one position must be selected';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Election filtering and sorting utilities
export const filterElectionsByStatus = (elections, status) => {
  if (!status) return elections;
  return elections.filter(election => election.status === status);
};

export const sortElectionsByDate = (elections, order = 'desc') => {
  return [...elections].sort((a, b) => {
    const dateA = new Date(a.startDateTime || a.createdAt);
    const dateB = new Date(b.startDateTime || b.createdAt);
    
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

export const getElectionStats = (elections) => {
  const stats = {
    total: elections.length,
    active: 0,
    completed: 0,
    upcoming: 0,
    paused: 0
  };
  
  elections.forEach(election => {
    switch (election.status) {
      case 'active':
        stats.active++;
        break;
      case 'completed':
        stats.completed++;
        break;
      case 'upcoming':
        stats.upcoming++;
        break;
      case 'paused':
        stats.paused++;
        break;
      default:
        break;
    }
  });
  
  return stats;
};