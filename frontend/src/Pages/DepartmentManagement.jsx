import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getDepartments,
  getCourses,
  getVoters,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  createCourse,
  updateCourse,
  deleteCourse
} from '../services/api.js';
import { checkCurrentUser } from '../services/auth.js';
import './DepartmentManagement.css';

const DepartmentManagement = () => {
  const user = checkCurrentUser();
  
  // State management
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  
  // Selected items
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  
  // Form data
  const [departmentFormData, setDepartmentFormData] = useState({
    id: '',
    name: ''
  });
  
  const [courseFormData, setCourseFormData] = useState({
    id: '',
    name: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [departmentsData, coursesData, votersData] = await Promise.all([
        getDepartments(),
        getCourses(),
        getVoters()
      ]);
      
      setDepartments(departmentsData);
      setCourses(coursesData);
      setVoters(votersData);
    } catch (error) {
      setMessage('Error loading data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter departments based on search term
  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get courses for a specific department
  const getCoursesForDepartment = (departmentId) => {
    return courses.filter(course => course.departmentId === departmentId);
  };

  // Modal handlers
  const openModal = () => {
    setDepartmentFormData({ id: '', name: '' });
    setShowModal(true);
  };

  const openEditModal = (department) => {
    setSelectedDepartment(department);
    setDepartmentFormData({
      id: department.id,
      name: department.name
    });
    setShowEditModal(true);
  };

  const openCourseModal = (department, course = null) => {
    setSelectedDepartment(department);
    if (course) {
      setEditingCourse(course);
      setCourseFormData({
        id: course.id,
        name: course.name
      });
    } else {
      setEditingCourse(null);
      setCourseFormData({ id: '', name: '' });
    }
    setShowCourseModal(true);
  };

  // Form handlers
  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      await createDepartment(departmentFormData);
      setMessage('Department created successfully!');
      setShowModal(false);
      fetchData();
    } catch (error) {
      setMessage('Error creating department: ' + error.message);
    }
  };

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();
    try {
      await updateDepartment(selectedDepartment.id, departmentFormData);
      setMessage('Department updated successfully!');
      setShowEditModal(false);
      fetchData();
    } catch (error) {
      setMessage('Error updating department: ' + error.message);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await createCourse({
        ...courseFormData,
        departmentId: selectedDepartment.id
      });
      setMessage('Course created successfully!');
      setShowCourseModal(false);
      fetchData();
    } catch (error) {
      setMessage('Error creating course: ' + error.message);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      await updateCourse(editingCourse.id, courseFormData);
      setMessage('Course updated successfully!');
      setShowCourseModal(false);
      fetchData();
    } catch (error) {
      setMessage('Error updating course: ' + error.message);
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department? This will also delete all associated courses.')) {
      try {
        await deleteDepartment(departmentId);
        setMessage('Department deleted successfully!');
        fetchData();
      } catch (error) {
        setMessage('Error deleting department: ' + error.message);
      }
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(courseId);
        setMessage('Course deleted successfully!');
        fetchData();
      } catch (error) {
        setMessage('Error deleting course: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="department-loading">
        <div className="department-spinner">
          <div className="spinner-ring"></div>
          <p>Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="department-management-container">
      {/* Success/Error Messages */}
      {message && (
        <div className={`department-alert ${message.includes('Error') ? 'department-alert-error' : 'department-alert-success'}`}>
          <i className={`fas ${message.includes('Error') ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
          <span>{message}</span>
          <button className="department-alert-close" onClick={() => setMessage('')}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      {/* Modern Header */}
      <div className="department-header">
        <div className="department-header-content">
          <div className="department-header-text">
            <h1 className="department-title">
              <i className="fas fa-university"></i>
              Department Management
            </h1>
            <p className="department-subtitle">
              Organize academic departments, courses, and manage voter groups efficiently
            </p>
          </div>
          <div className="department-header-actions">
            <button className="department-btn department-btn-primary" onClick={openModal}>
              <i className="fas fa-plus"></i>
              Add Department
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="department-search-section">
        <div className="department-search-container">
          <div className="department-search-group">
            <i className="fas fa-search department-search-icon"></i>
            <input
              type="text"
              className="department-search-input"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="department-search-clear"
                onClick={() => setSearchTerm('')}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          <div className="department-stats">
            <div className="department-stat-item">
              <i className="fas fa-university"></i>
              <span>{departments.length} Departments</span>
            </div>
            <div className="department-stat-item">
              <i className="fas fa-graduation-cap"></i>
              <span>{courses.length} Courses</span>
            </div>
            <div className="department-stat-item">
              <i className="fas fa-users"></i>
              <span>{voters.length} Voters</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Departments Grid */}
      <div className="department-grid">
        {filteredDepartments.length > 0 ? (
          filteredDepartments.map(department => {
            const departmentCourses = getCoursesForDepartment(department.id);
            return (
              <div key={department.id} className="department-card">
                <div className="department-card-header">
                  <div className="department-card-info">
                    <div className="department-card-icon">
                      <i className="fas fa-university"></i>
                    </div>
                    <div className="department-card-details">
                      <h3 className="department-card-name">{department.name}</h3>
                      <span className="department-card-id">{department.id}</span>
                    </div>
                  </div>
                  <div className="department-card-actions">
                    <button 
                      className="department-btn department-btn-success department-btn-sm"
                      onClick={() => openCourseModal(department)}
                      title="Add Course"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                    <button 
                      className="department-btn department-btn-primary department-btn-sm"
                      onClick={() => openEditModal(department)}
                      title="Edit Department"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="department-btn department-btn-danger department-btn-sm"
                      onClick={() => handleDeleteDepartment(department.id)}
                      title="Delete Department"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                  
                <div className="department-card-stats">
                  <div className="department-stat">
                    <i className="fas fa-graduation-cap"></i>
                    <span>{departmentCourses.length} Courses</span>
                  </div>
                  <div className="department-stat">
                    <i className="fas fa-users"></i>
                    <span>{department.voterCount || 0} Voters</span>
                  </div>
                </div>

                <div className="department-courses-section">
                  <div className="department-courses-header">
                    <h4 className="department-courses-title">
                      <i className="fas fa-book"></i>
                      Courses
                    </h4>
                    <span className="department-courses-count">{departmentCourses.length}</span>
                  </div>
                    
                  {departmentCourses.length > 0 ? (
                    <div className="department-courses-list">
                      {departmentCourses.map(course => (
                        <div key={course.id} className="department-course-item">
                          <div className="department-course-info">
                            <div className="department-course-id">{course.id}</div>
                            <div className="department-course-name">{course.name}</div>
                          </div>
                          <div className="department-course-actions">
                            <button 
                              className="department-btn department-btn-outline department-btn-sm"
                              onClick={() => openCourseModal(department, course)}
                              title="Edit Course"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="department-btn department-btn-outline-danger department-btn-sm"
                              onClick={() => handleDeleteCourse(course.id)}
                              title="Delete Course"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="department-no-courses">
                      <i className="fas fa-book-open"></i>
                      <p>No courses in this department</p>
                      <button 
                        className="department-btn department-btn-outline-success department-btn-sm"
                        onClick={() => openCourseModal(department)}
                      >
                        <i className="fas fa-plus"></i>
                        Add First Course
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="department-empty">
            <div className="department-empty-content">
              <i className="fas fa-university"></i>
              <h3>No Departments Found</h3>
              <p>
                {searchTerm 
                  ? `No departments match "${searchTerm}". Try adjusting your search terms.`
                  : 'Get started by creating your first department to organize your academic structure.'
                }
              </p>
              {!searchTerm && (
                <button className="department-btn department-btn-primary" onClick={openModal}>
                  <i className="fas fa-plus"></i>
                  Create First Department
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Department Modal */}
      {showModal && (
        <div className="department-modal-overlay">
          <div className="department-modal">
            <div className="department-modal-header">
              <h5 className="department-modal-title">
                <i className="fas fa-university"></i>
                Create Department
              </h5>
              <button
                type="button"
                className="department-modal-close"
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateDepartment}>
              <div className="department-modal-body">
                <div className="department-form-group">
                  <label className="department-form-label">Department Name</label>
                  <input
                    type="text"
                    className="department-form-input"
                    value={departmentFormData.name}
                    onChange={(e) => setDepartmentFormData({...departmentFormData, name: e.target.value})}
                    placeholder="e.g., College of Computer Studies"
                    required
                  />
                </div>
                <div className="department-form-group">
                  <label className="department-form-label">Department ID</label>
                  <input
                    type="text"
                    className="department-form-input"
                    value={departmentFormData.id}
                    onChange={(e) => setDepartmentFormData({...departmentFormData, id: e.target.value.toUpperCase()})}
                    placeholder="e.g., CCS"
                    maxLength="10"
                    pattern="[A-Za-z0-9]+"
                    required
                  />
                  <small className="department-form-help">
                    Short identifier for the department (max 10 characters)
                  </small>
                </div>
              </div>
              <div className="department-modal-footer">
                <button
                  type="button"
                  className="department-btn department-btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="department-btn department-btn-primary">
                  <i className="fas fa-plus"></i>
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
     
      {/* Edit Department Modal */}
      {showEditModal && selectedDepartment && (
        <div className="department-modal-overlay">
          <div className="department-modal">
            <div className="department-modal-header">
              <h5 className="department-modal-title">
                <i className="fas fa-edit"></i>
                Edit Department
              </h5>
              <button
                type="button"
                className="department-modal-close"
                onClick={() => setShowEditModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleUpdateDepartment}>
              <div className="department-modal-body">
                <div className="department-form-group">
                  <label className="department-form-label">Department Name</label>
                  <input
                    type="text"
                    className="department-form-input"
                    value={departmentFormData.name}
                    onChange={(e) => setDepartmentFormData({...departmentFormData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="department-form-group">
                  <label className="department-form-label">Department ID</label>
                  <input
                    type="text"
                    className="department-form-input"
                    value={departmentFormData.id}
                    disabled
                  />
                  <small className="department-form-help">
                    Department ID cannot be changed
                  </small>
                </div>
              </div>
              <div className="department-modal-footer">
                <button
                  type="button"
                  className="department-btn department-btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="department-btn department-btn-primary">
                  <i className="fas fa-save"></i>
                  Update Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
     
      {/* Course Modal */}
      {showCourseModal && selectedDepartment && (
        <div className="department-modal-overlay">
          <div className="department-modal">
            <div className="department-modal-header">
              <h5 className="department-modal-title">
                <i className="fas fa-graduation-cap"></i>
                {editingCourse ? 'Edit Course' : 'Create Course'} - {selectedDepartment.name}
              </h5>
              <button
                type="button"
                className="department-modal-close"
                onClick={() => setShowCourseModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}>
              <div className="department-modal-body">
                <div className="department-form-group">
                  <label className="department-form-label">Course ID</label>
                  <input
                    type="text"
                    className="department-form-input"
                    value={courseFormData.id}
                    onChange={(e) => setCourseFormData({...courseFormData, id: e.target.value.toUpperCase()})}
                    placeholder="e.g., BSIT, BSME, BSCE"
                    maxLength="10"
                    pattern="[A-Za-z0-9-]+"
                    required
                  />
                  <small className="department-form-help">
                    Enter a unique course identifier (e.g., BSIT for BS in Information Technology)
                  </small>
                </div>
                <div className="department-form-group">
                  <label className="department-form-label">Course Name</label>
                  <input
                    type="text"
                    className="department-form-input"
                    value={courseFormData.name}
                    onChange={(e) => setCourseFormData({...courseFormData, name: e.target.value})}
                    placeholder="e.g., BS in Information Technology"
                    required
                  />
                </div>
              </div>
              <div className="department-modal-footer">
                <button
                  type="button"
                  className="department-btn department-btn-secondary"
                  onClick={() => setShowCourseModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="department-btn department-btn-success">
                  <i className="fas fa-graduation-cap"></i>
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement; 