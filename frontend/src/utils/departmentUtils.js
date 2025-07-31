// Department and course utility functions

export const filterDepartments = (departments, searchTerm) => {
  if (!searchTerm) return departments;
  
  const term = searchTerm.toLowerCase();
  return departments.filter(dept =>
    dept.name.toLowerCase().includes(term) ||
    dept.id.toLowerCase().includes(term)
  );
};

export const getCoursesForDepartment = (courses, departmentId) => {
  return courses.filter(course => course.departmentId === departmentId);
};

export const getVoterCountForDepartment = (voters, departmentId) => {
  return voters.filter(voter => voter.departmentId === departmentId).length;
};

export const getDepartmentStats = (departments, courses, voters) => {
  return {
    totalDepartments: departments.length,
    totalCourses: courses.length,
    totalVoters: voters.length,
    avgCoursesPerDepartment: departments.length > 0 
      ? Math.round((courses.length / departments.length) * 100) / 100 
      : 0,
    avgVotersPerDepartment: departments.length > 0 
      ? Math.round((voters.length / departments.length) * 100) / 100 
      : 0
  };
};

export const validateDepartmentForm = (formData) => {
  const errors = {};
  
  if (!formData.id?.trim()) {
    errors.id = 'Department ID is required';
  } else if (formData.id.length > 10) {
    errors.id = 'Department ID must be 10 characters or less';
  }
  
  if (!formData.name?.trim()) {
    errors.name = 'Department name is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateCourseForm = (formData) => {
  const errors = {};
  
  if (!formData.id?.trim()) {
    errors.id = 'Course ID is required';
  } else if (formData.id.length > 10) {
    errors.id = 'Course ID must be 10 characters or less';
  }
  
  if (!formData.name?.trim()) {
    errors.name = 'Course name is required';
  }
  
  if (!formData.departmentId?.trim()) {
    errors.departmentId = 'Department must be selected';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const formatDepartmentId = (id) => {
  return id.toUpperCase().replace(/[^A-Z0-9-]/g, '');
};

export const formatCourseId = (id) => {
  return id.toUpperCase().replace(/[^A-Z0-9-]/g, '');
};