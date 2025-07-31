// Form utility functions
// Common form validation and handling utilities

/**
 * Generic form field validation
 * @param {string} value - Field value
 * @param {Object} rules - Validation rules
 * @returns {Array} Array of error messages
 */
export const validateField = (value, rules = {}) => {
  const errors = [];
  
  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push(rules.requiredMessage || 'This field is required');
  }
  
  if (value && rules.minLength && value.length < rules.minLength) {
    errors.push(`Must be at least ${rules.minLength} characters long`);
  }
  
  if (value && rules.maxLength && value.length > rules.maxLength) {
    errors.push(`Must be no more than ${rules.maxLength} characters long`);
  }
  
  if (value && rules.pattern && !rules.pattern.test(value)) {
    errors.push(rules.patternMessage || 'Invalid format');
  }
  
  if (value && rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    errors.push('Please enter a valid email address');
  }
  
  return errors;
};

/**
 * Validate multiple form fields
 * @param {Object} formData - Form data object
 * @param {Object} validationRules - Validation rules for each field
 * @returns {Object} Validation result with isValid and fieldErrors
 */
export const validateForm = (formData, validationRules) => {
  const fieldErrors = {};
  let isValid = true;
  
  Object.keys(validationRules).forEach(fieldName => {
    const fieldValue = formData[fieldName];
    const fieldRules = validationRules[fieldName];
    const errors = validateField(fieldValue, fieldRules);
    
    if (errors.length > 0) {
      fieldErrors[fieldName] = errors;
      isValid = false;
    }
  });
  
  return {
    isValid,
    fieldErrors,
    errors: Object.values(fieldErrors).flat()
  };
};

/**
 * Handle form input changes with validation
 * @param {Function} setFormData - State setter for form data
 * @param {Function} setErrors - State setter for errors (optional)
 * @param {Object} validationRules - Validation rules (optional)
 * @returns {Function} Input change handler
 */
export const createInputChangeHandler = (setFormData, setErrors = null, validationRules = {}) => {
  return (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors for this field if validation is provided
    if (setErrors && validationRules[field]) {
      const fieldErrors = validateField(value, validationRules[field]);
      setErrors(prev => ({
        ...prev,
        [field]: fieldErrors
      }));
    }
  };
};

/**
 * Reset form to initial state
 * @param {Object} initialState - Initial form state
 * @param {Function} setFormData - State setter for form data
 * @param {Function} setErrors - State setter for errors (optional)
 */
export const resetForm = (initialState, setFormData, setErrors = null) => {
  setFormData(initialState);
  if (setErrors) {
    setErrors({});
  }
};

/**
 * Check if form has unsaved changes
 * @param {Object} currentData - Current form data
 * @param {Object} originalData - Original form data
 * @returns {boolean} True if form has changes
 */
export const hasFormChanges = (currentData, originalData) => {
  return JSON.stringify(currentData) !== JSON.stringify(originalData);
};

/**
 * Format form data for API submission
 * @param {Object} formData - Raw form data
 * @param {Array} excludeFields - Fields to exclude from submission
 * @returns {Object} Formatted form data
 */
export const formatFormData = (formData, excludeFields = []) => {
  const formatted = { ...formData };
  
  // Remove excluded fields
  excludeFields.forEach(field => {
    delete formatted[field];
  });
  
  // Trim string values
  Object.keys(formatted).forEach(key => {
    if (typeof formatted[key] === 'string') {
      formatted[key] = formatted[key].trim();
    }
  });
  
  return formatted;
};