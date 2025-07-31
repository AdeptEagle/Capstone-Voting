// Candidate utility functions
export const filterCandidates = (candidates, searchTerm) => {
  if (!searchTerm) return candidates;
  
  const term = searchTerm.toLowerCase();
  return candidates.filter(candidate => 
    candidate.name?.toLowerCase().includes(term) ||
    candidate.positionName?.toLowerCase().includes(term) ||
    candidate.departmentId?.toLowerCase().includes(term) ||
    candidate.courseId?.toLowerCase().includes(term)
  );
};

export const sortCandidates = (candidates, sortField, sortOrder, positions = []) => {
  return [...candidates].sort((a, b) => {
    if (sortField === 'positionName') {
      // Sort by position displayOrder (or ID if no displayOrder)
      const aPos = positions.find(p => p.id === a.positionId);
      const bPos = positions.find(p => p.id === b.positionId);
      const aOrder = aPos?.displayOrder ?? aPos?.id ?? '';
      const bOrder = bPos?.displayOrder ?? bPos?.id ?? '';
      if (aOrder < bOrder) return sortOrder === 'asc' ? -1 : 1;
      if (aOrder > bOrder) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    } else {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';
      aValue = typeof aValue === 'string' ? aValue.toLowerCase() : aValue;
      bValue = typeof bValue === 'string' ? bValue.toLowerCase() : bValue;
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }
  });
};

export const filterAndSortCandidates = (candidates, searchTerm, sortField, sortOrder, positions = []) => {
  const filtered = filterCandidates(candidates, searchTerm);
  return sortCandidates(filtered, sortField, sortOrder, positions);
};

export const groupCandidatesByPosition = (candidates) => {
  return candidates.reduce((groups, candidate) => {
    const positionName = candidate.positionName || 'No Position';
    if (!groups[positionName]) {
      groups[positionName] = [];
    }
    groups[positionName].push(candidate);
    return groups;
  }, {});
};

export const validateCandidateForm = (formData) => {
  const errors = {};
  
  if (!formData.name?.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!formData.positionId) {
    errors.positionId = 'Position is required';
  }
  
  if (!formData.departmentId) {
    errors.departmentId = 'Department is required';
  }
  
  if (!formData.courseId) {
    errors.courseId = 'Course is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const formatCandidateData = (formData, photoUrl = null) => {
  return {
    name: formData.name.trim(),
    positionId: formData.positionId,
    departmentId: formData.departmentId,
    courseId: formData.courseId,
    photoUrl: photoUrl || formData.photoUrl || '',
    description: formData.description?.trim() || ''
  };
};

export const getInitialFormData = () => {
  return {
    name: '',
    positionId: '',
    departmentId: '',
    courseId: '',
    photoUrl: '',
    description: ''
  };
};

export const populateFormData = (candidate) => {
  return {
    name: candidate.name || '',
    positionId: candidate.positionId || '',
    departmentId: candidate.departmentId || '',
    courseId: candidate.courseId || '',
    photoUrl: candidate.photoUrl || '',
    description: candidate.description || ''
  };
};