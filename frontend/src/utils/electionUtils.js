// Election utility functions
// Extracted from Elections.jsx to reduce file size and improve maintainability

/**
 * Get status color for election status
 * @param {string} status - Election status
 * @returns {string} CSS color class
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'draft': return 'secondary';
    case 'scheduled': return 'info';
    case 'active': return 'success';
    case 'paused': return 'warning';
    case 'stopped': return 'danger';
    case 'completed': return 'dark';
    default: return 'secondary';
  }
};

/**
 * Get status icon for election status
 * @param {string} status - Election status
 * @returns {string} FontAwesome icon class
 */
export const getStatusIcon = (status) => {
  switch (status) {
    case 'draft': return 'fas fa-edit';
    case 'scheduled': return 'fas fa-clock';
    case 'active': return 'fas fa-play-circle';
    case 'paused': return 'fas fa-pause-circle';
    case 'stopped': return 'fas fa-stop-circle';
    case 'completed': return 'fas fa-check-circle';
    default: return 'fas fa-question-circle';
  }
};

/**
 * Format date time for display
 * @param {string} dateTime - ISO date string
 * @returns {string} Formatted date time
 */
export const formatDateTime = (dateTime) => {
  if (!dateTime) return 'Not set';
  const date = new Date(dateTime);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Validate election form data
 * @param {Object} formData - Election form data
 * @returns {Object} Validation result with isValid and errors
 */
export const validateElectionForm = (formData) => {
  const errors = [];
  
  if (!formData.title?.trim()) {
    errors.push('Election title is required');
  }
  
  if (!formData.description?.trim()) {
    errors.push('Election description is required');
  }
  
  if (!formData.startTime) {
    errors.push('Start time is required');
  }
  
  if (!formData.endTime) {
    errors.push('End time is required');
  }
  
  if (formData.startTime && formData.endTime) {
    const startDate = new Date(formData.startTime);
    const endDate = new Date(formData.endTime);
    
    if (startDate >= endDate) {
      errors.push('End time must be after start time');
    }
    
    if (startDate <= new Date()) {
      errors.push('Start time must be in the future');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get candidates for a specific position
 * @param {Array} candidates - All candidates
 * @param {string} positionId - Position ID
 * @returns {Array} Filtered candidates
 */
export const getCandidatesForPosition = (candidates, positionId) => {
  return candidates.filter(candidate => candidate.positionId === positionId);
};

/**
 * Filter candidates based on search term
 * @param {Array} candidates - All candidates
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered candidates
 */
export const getFilteredCandidates = (candidates, searchTerm) => {
  if (!searchTerm) return candidates;
  
  const term = searchTerm.toLowerCase();
  return candidates.filter(candidate =>
    candidate.name?.toLowerCase().includes(term) ||
    candidate.positionName?.toLowerCase().includes(term) ||
    candidate.departmentName?.toLowerCase().includes(term)
  );
};

/**
 * Get available status actions for an election
 * @param {Object} election - Election object
 * @returns {Array} Available actions
 */
export const getStatusActions = (election) => {
  const actions = [];
  
  switch (election.status) {
    case 'draft':
    case 'scheduled':
      actions.push({
        action: 'start',
        label: 'Start Election',
        icon: 'fas fa-play',
        color: 'success'
      });
      break;
      
    case 'active':
      actions.push({
        action: 'pause',
        label: 'Pause Election',
        icon: 'fas fa-pause',
        color: 'warning'
      });
      actions.push({
        action: 'stop',
        label: 'Stop Election',
        icon: 'fas fa-stop',
        color: 'danger'
      });
      break;
      
    case 'paused':
      actions.push({
        action: 'resume',
        label: 'Resume Election',
        icon: 'fas fa-play',
        color: 'success'
      });
      actions.push({
        action: 'stop',
        label: 'Stop Election',
        icon: 'fas fa-stop',
        color: 'danger'
      });
      break;
      
    case 'stopped':
      actions.push({
        action: 'resume',
        label: 'Resume Election',
        icon: 'fas fa-play',
        color: 'success'
      });
      actions.push({
        action: 'end',
        label: 'End Election',
        icon: 'fas fa-check',
        color: 'dark'
      });
      break;
  }
  
  return actions;
};