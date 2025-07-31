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
    if (window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      try {
        setLoading(true);
        await deleteDepartment(departmentId);
        setDepartments(departments.filter(dept => dept.id !== departmentId));
        setCourses(courses.filter(course => course.departmentId !== departmentId));
        setSuccess('Department deleted successfully!');
      } catch (error) {
        setError('Error deleting department: ' + error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    }
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