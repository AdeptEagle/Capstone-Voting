import { useState } from 'react';
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
  createCourse,
  updateCourse,
  deleteCourse
} from '../services/api';

export const useDepartmentActions = () => {
  const [loading, setLoading] = useState(false);

  const handleCreateDepartment = async (formData, departments, setDepartments, setSuccess, setError) => {
    try {
      setLoading(true);
      const newDepartment = await createDepartment(formData);
      setDepartments([...departments, newDepartment]);
      setSuccess('Department created successfully!');
      return newDepartment;
    } catch (error) {
      setError('Error creating department: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDepartment = async (departmentId, formData, departments, setDepartments, setSuccess, setError) => {
    try {
      setLoading(true);
      const updatedDepartment = await updateDepartment(departmentId, formData);
      setDepartments(departments.map(dept => 
        dept.id === departmentId ? updatedDepartment : dept
      ));
      setSuccess('Department updated successfully!');
      return updatedDepartment;
    } catch (error) {
      setError('Error updating department: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDepartment = async (departmentId, departments, setDepartments, courses, setCourses, setSuccess, setError) => {
    // Find the department to show its name in confirmation
    const department = departments.find(dept => dept.id === departmentId);
    const departmentName = department ? department.name : departmentId;
    const associatedCourses = courses.filter(course => course.departmentId === departmentId);
    
    const confirmMessage = associatedCourses.length > 0 
      ? `Are you sure you want to delete "${departmentName}" department?\n\nThis will also delete ${associatedCourses.length} associated course(s):\n${associatedCourses.map(c => `• ${c.name}`).join('\n')}\n\nThis action cannot be undone.`
      : `Are you sure you want to delete "${departmentName}" department?\n\nThis action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        setLoading(true);
        setError(''); // Clear any existing errors
        
        console.log(`🗑️ Deleting department: ${departmentName} (${departmentId})`);
        
        // Call API to delete department (should cascade delete courses)
        await deleteDepartment(departmentId);
        
        console.log(`✅ Department deleted successfully: ${departmentName}`);
        
        // Update local state to remove the department and its courses
        setDepartments(departments.filter(dept => dept.id !== departmentId));
        setCourses(courses.filter(course => course.departmentId !== departmentId));
        
        setSuccess(`Department "${departmentName}" and all associated courses deleted successfully!`);
        
        return true; // Indicate successful deletion
      } catch (error) {
        console.error('❌ Error deleting department:', error);
        
        let errorMessage = 'Failed to delete department';
        
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.status === 409) {
          errorMessage = 'Cannot delete department - it may have associated voters or be used in active elections';
        } else if (error.response?.status === 403) {
          errorMessage = 'You do not have permission to delete this department';
        } else if (error.response?.status === 404) {
          errorMessage = 'Department not found - it may have already been deleted';
        } else if (!navigator.onLine) {
          errorMessage = 'No internet connection. Please check your connection and try again';
        }
        
        setError(`${errorMessage}: ${departmentName}`);
        throw error;
      } finally {
        setLoading(false);
      }
    }
    
    return false; // Indicate cancellation or failure
  };

  const handleCreateCourse = async (formData, courses, setCourses, setSuccess, setError) => {
    try {
      setLoading(true);
      const newCourse = await createCourse(formData);
      setCourses([...courses, newCourse]);
      setSuccess('Course created successfully!');
      return newCourse;
    } catch (error) {
      setError('Error creating course: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (courseId, formData, courses, setCourses, setSuccess, setError) => {
    try {
      setLoading(true);
      const updatedCourse = await updateCourse(courseId, formData);
      setCourses(courses.map(course => 
        course.id === courseId ? updatedCourse : course
      ));
      setSuccess('Course updated successfully!');
      return updatedCourse;
    } catch (error) {
      setError('Error updating course: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId, courses, setCourses, setSuccess, setError) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        setLoading(true);
        await deleteCourse(courseId);
        setCourses(courses.filter(course => course.id !== courseId));
        setSuccess('Course deleted successfully!');
      } catch (error) {
        setError('Error deleting course: ' + error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    loading,
    handleCreateDepartment,
    handleUpdateDepartment,
    handleDeleteDepartment,
    handleCreateCourse,
    handleUpdateCourse,
    handleDeleteCourse
  };
};