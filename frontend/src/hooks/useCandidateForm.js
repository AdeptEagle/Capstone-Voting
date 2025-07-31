import { useState, useCallback } from 'react';
import { getInitialFormData, populateFormData, validateCandidateForm } from '../utils/candidateUtils';

export const useCandidateForm = () => {
  const [formData, setFormData] = useState(getInitialFormData());
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [errors, setErrors] = useState({});

  const resetForm = useCallback(() => {
    setFormData(getInitialFormData());
    setPhotoFile(null);
    setPhotoPreview('');
    setErrors({});
  }, []);

  const populateForm = useCallback((candidate) => {
    setFormData(populateFormData(candidate));
    setPhotoFile(null);
    setPhotoPreview(candidate.photoUrl || '');
    setErrors({});
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleRemovePhoto = useCallback(() => {
    setPhotoFile(null);
    setPhotoPreview('');
    setFormData(prev => ({
      ...prev,
      photoUrl: ''
    }));
  }, []);

  const validateForm = useCallback(() => {
    const validation = validateCandidateForm(formData);
    setErrors(validation.errors);
    return validation.isValid;
  }, [formData]);

  const clearCourseSelection = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      courseId: ''
    }));
  }, []);

  return {
    formData,
    setFormData,
    photoFile,
    photoPreview,
    errors,
    resetForm,
    populateForm,
    handleChange,
    handlePhotoChange,
    handleRemovePhoto,
    validateForm,
    clearCourseSelection
  };
};