import React, { useState, useEffect } from 'react';
import { 
  getVoters,
  getAvailableVoters,
  getDepartments,
  getCourses,
  getCoursesByDepartment,
  createDepartment,
  createCourse,
  updateDepartment,
  updateCourse,
  deleteDepartment,
  deleteCourse
} from '../services/api.js';
import { checkCurrentUser } from '../services/auth.js';
import './VoterGroups.css';

const DepartmentManagement = () => {
  const user = checkCurrentUser();
  const [voters, setVoters] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [availableVoters, setAvailableVoters] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('departments');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    type: 'department',
    departmentId: '',
    courseId: ''
  });
  const [departmentFormData, setDepartmentFormData] = useState({
    name: '',
    id: ''
  });
  const [courseFormData, setCourseFormData] = useState({
    name: '',
    id: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [votersData, departmentsData, coursesData] = await Promise.all([
        getVoters(),
        getDepartments(),
        getCourses()
      ]);
      setVoters(votersData);
      setDepartments(departmentsData);
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = async (departmentId) => {
    setFormData({ ...formData, departmentId, courseId: '' });
    if (departmentId) {
      try {
        const departmentCourses = await getCoursesByDepartment(departmentId);
        setCourses(departmentCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    } else {
      // If no department selected, show all courses
      const allCourses = await getCourses();
      setCourses(allCourses);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingGroup) {
        // await updateVoterGroup(editingGroup.id, formData); // Removed as per edit hint
      } else {
        // await createVoterGroup(formData); // Removed as per edit hint
      }
      setMessage(editingGroup ? 'Department group updated successfully!' : 'Department group created successfully!');
      setShowModal(false);
      setEditingGroup(null);
      setFormData({ name: '', description: '', type: 'department', departmentId: '', courseId: '' });
      await fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving department group:', error);
      setMessage('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    
    try {
      await createDepartment(departmentFormData);
      setMessage('Department created successfully!');
      setDepartmentFormData({ name: '', id: '' });
      setShowModal(false);
      await fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error creating department:', error);
      setMessage('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();
    
    try {
      await updateDepartment(selectedDepartment.id, departmentFormData);
      setMessage('Department updated successfully!');
      setDepartmentFormData({ name: '', id: '' });
      setShowEditModal(false);
      setSelectedDepartment(null);
      await fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating department:', error);
      setMessage('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await createCourse({
        ...courseFormData,
        id: courseFormData.id, // Use the custom ID from form
        departmentId: selectedDepartment.id,
        created_by: user.id
      });
      setMessage('Course created successfully!');
      setCourseFormData({ name: '', id: '' });
      setShowCourseModal(false);
      await fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error creating course:', error);
      setMessage('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      await updateCourse(editingCourse.id, courseFormData);
      setMessage('Course updated successfully!');
      setCourseFormData({ name: '', id: '' });
      setShowCourseModal(false);
      setEditingCourse(null);
      await fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating course:', error);
      setMessage('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (window.confirm('Are you sure you want to delete this department? This will also delete all associated courses.')) {
      try {
        await deleteDepartment(id);
        setMessage('Department deleted successfully!');
        await fetchData();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting department:', error);
        setMessage('Error: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id);
        setMessage('Course deleted successfully!');
        await fetchData();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting course:', error);
        setMessage('Error: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    setFormData({
      id: group.id,
      name: group.name,
      description: group.description || '',
      type: group.type,
      departmentId: group.departmentId || '',
      courseId: group.courseId || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department group?')) {
      try {
        // await deleteVoterGroup(id); // Removed as per edit hint
        fetchData();
      } catch (error) {
        console.error('Error deleting department group:', error);
      }
    }
  };

  const openModal = () => {
    setEditingGroup(null);
    setFormData({ id: '', name: '', description: '', type: 'department', departmentId: '', courseId: '' });
    setShowModal(true);
  };

  const openEditModal = (department) => {
    setSelectedDepartment(department);
    setDepartmentFormData({
      name: department.name,
      id: department.id
    });
    setShowEditModal(true);
  };

  const openCourseModal = (department = null, course = null) => {
    setSelectedDepartment(department);
    if (course) {
      setEditingCourse(course);
      setCourseFormData({
        name: course.name,
        id: course.id
      });
    } else {
      setEditingCourse(null);
      setCourseFormData({ name: '', id: '' });
    }
    setShowCourseModal(true);
  };

  const handleViewMembers = async (group) => {
    console.log('handleViewMembers called with group:', group);
    try {
      console.log('Fetching members for group:', group.id);
      // const members = await getVoterGroupMembers(group.id); // Removed as per edit hint
      console.log('Members fetched:', groupMembers); // Placeholder for now
      setGroupMembers(groupMembers); // Placeholder for now
      setSelectedGroup(group);
      
      console.log('Fetching available voters...');
      const available = await getAvailableVoters();
      console.log('Available voters:', available);
      setAvailableVoters(available);
      
      console.log('Setting showMembersModal to true');
      setShowMembersModal(true);
    } catch (error) {
      console.error('Error fetching group members:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleAddMember = async (voterId) => {
    try {
      // await addMemberToGroup(selectedGroup.id, voterId); // Removed as per edit hint
      handleViewMembers(selectedGroup); // Refresh members
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (voterId) => {
    try {
      // await removeMemberFromGroup(selectedGroup.id, voterId); // Removed as per edit hint
      handleViewMembers(selectedGroup); // Refresh members
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      department: 'primary',
      class: 'success',
      year: 'warning',
      custom: 'secondary'
    };
    return colors[type] || 'secondary';
  };

  const getCoursesForDepartment = (departmentId) => {
    return courses.filter(course => course.departmentId === departmentId);
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="department-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading department management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="department-management-container">
      {/* Success/Error Messages */}
      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
          <i className={`fas ${message.includes('Error') ? 'fa-exclamation-circle' : 'fa-check-circle'} me-2`}></i>
          {message}
        </div>
      )}
      
      {/* Modern Header */}
      <div className="department-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="header-title">
              <i className="fas fa-university me-3"></i>
              Department Management
            </h1>
            <p className="header-subtitle">
              Organize academic departments, courses, and manage voter groups efficiently
            </p>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary btn-lg" onClick={openModal}>
              <i className="fas fa-plus me-2"></i>
              Add Department
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-input-group">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="search-clear"
                onClick={() => setSearchTerm('')}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          <div className="search-stats">
            <span className="stat-item">
              <i className="fas fa-university me-1"></i>
              {departments.length} Departments
            </span>
            <span className="stat-item">
              <i className="fas fa-graduation-cap me-1"></i>
              {courses.length} Courses
            </span>
            <span className="stat-item">
              <i className="fas fa-users me-1"></i>
              {voters.length} Voters
            </span>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="departments-grid">
        {filteredDepartments.length > 0 ? (
          filteredDepartments.map(department => {
          const departmentCourses = getCoursesForDepartment(department.id);
          return (
              <div key={department.id} className="department-card">
                <div className="department-card-header">
                <div className="department-info">
                    <div className="department-icon">
                      <i className="fas fa-university"></i>
                    </div>
                    <div className="department-details">
                      <h3 className="department-name">{department.name}</h3>
                      <span className="department-id">{department.id}</span>
                    </div>
                </div>
                  <div className="department-actions">
                <button 
                      className="btn btn-sm btn-success"
                    onClick={() => openCourseModal(department)}
                    title="Add Course"
                >
                    <i className="fas fa-plus"></i>
                </button>
                <button 
                      className="btn btn-sm btn-primary"
                    onClick={() => openEditModal(department)}
                    title="Edit Department"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button 
                      className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteDepartment(department.id)}
                    title="Delete Department"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
              
                <div className="department-stats">
                  <div className="stat">
                    <i className="fas fa-graduation-cap"></i>
                    <span>{departmentCourses.length} Courses</span>
                  </div>
                  <div className="stat">
                    <i className="fas fa-users"></i>
                    <span>{department.voterCount || 0} Voters</span>
                  </div>
              </div>

              <div className="courses-section">
                  <div className="courses-header">
                <h4 className="courses-title">
                  <i className="fas fa-book me-2"></i>
                  Courses
                </h4>
                    <span className="courses-count">{departmentCourses.length}</span>
                  </div>
                  
                {departmentCourses.length > 0 ? (
                  <div className="courses-list">
                    {departmentCourses.map(course => (
                        <div key={course.id} className="course-card">
                        <div className="course-info">
                            <div className="course-id">{course.id}</div>
                            <div className="course-name">{course.name}</div>
                        </div>
                        <div className="course-actions">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openCourseModal(department, course)}
                            title="Edit Course"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
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
                    <div className="no-courses">
                      <i className="fas fa-book-open"></i>
                      <p>No courses in this department</p>
                      <button 
                        className="btn btn-sm btn-outline-success"
                        onClick={() => openCourseModal(department)}
                      >
                        <i className="fas fa-plus me-1"></i>
                        Add First Course
                      </button>
                    </div>
                )}
              </div>
            </div>
          );
          })
        ) : (
          <div className="no-departments">
            <div className="no-departments-content">
              <i className="fas fa-university"></i>
              <h3>No Departments Found</h3>
              <p>
                {searchTerm 
                  ? `No departments match "${searchTerm}"` 
                  : 'Get started by creating your first department'
                }
              </p>
              {!searchTerm && (
                <button className="btn btn-primary" onClick={openModal}>
                  <i className="fas fa-plus me-2"></i>
                  Create First Department
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Department Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header department-modal">
                <h5 className="modal-title">
                  <i className="fas fa-university"></i>
                  Create Department
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateDepartment}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Department Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={departmentFormData.name}
                      onChange={(e) => setDepartmentFormData({...departmentFormData, name: e.target.value})}
                      placeholder="e.g., College of Computer Studies"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={departmentFormData.id}
                      onChange={(e) => setDepartmentFormData({...departmentFormData, id: e.target.value.toUpperCase()})}
                      placeholder="e.g., CCS"
                      maxLength="10"
                      pattern="[A-Za-z0-9]+"
                      required
                    />
                    <small className="form-text text-muted">
                      Short identifier for the department (max 10 characters)
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>
                    Create Department
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditModal && selectedDepartment && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header department-modal">
                <h5 className="modal-title">
                  <i className="fas fa-edit"></i>
                  Edit Department
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleUpdateDepartment}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Department Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={departmentFormData.name}
                      onChange={(e) => setDepartmentFormData({...departmentFormData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={departmentFormData.id}
                      disabled
                    />
                    <small className="form-text text-muted">
                      Department ID cannot be changed
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save me-2"></i>
                    Update Department
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Course Modal */}
      {showCourseModal && selectedDepartment && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header course-modal">
                <h5 className="modal-title">
                  <i className="fas fa-graduation-cap"></i>
                  {editingCourse ? 'Edit Course' : 'Create Course'} - {selectedDepartment.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCourseModal(false)}
                ></button>
              </div>
              <form onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Course ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={courseFormData.id}
                      onChange={(e) => setCourseFormData({...courseFormData, id: e.target.value.toUpperCase()})}
                      placeholder="e.g., BSIT, BSME, BSCE"
                      maxLength="10"
                      pattern="[A-Za-z0-9-]+"
                      required
                    />
                    <small className="form-text text-muted">
                      Enter a unique course identifier (e.g., BSIT for BS in Information Technology)
                    </small>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Course Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={courseFormData.name}
                      onChange={(e) => setCourseFormData({...courseFormData, name: e.target.value})}
                      placeholder="e.g., BS in Information Technology"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCourseModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    <i className="fas fa-graduation-cap me-2"></i>
                    {editingCourse ? 'Update Course' : 'Create Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Members Modal */}
      {showMembersModal && selectedGroup && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-users me-2"></i>
                  Manage Members - {selectedGroup.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowMembersModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="members-container">
                  <div className="members-section">
                    <h4>Current Members ({groupMembers.length})</h4>
                    <div className="members-list">
                      {groupMembers.map(member => (
                        <div key={member.id} className="member-item">
                          <span>{member.name} ({member.studentId})</span>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                      {groupMembers.length === 0 && (
                        <p className="no-members">No members in this group</p>
                      )}
                    </div>
                  </div>
                  <div className="members-section">
                    <h4>Available Voters ({availableVoters.length})</h4>
                    <div className="members-list">
                      {availableVoters.map(voter => (
                        <div key={voter.id} className="member-item">
                          <span>{voter.name} ({voter.studentId})</span>
                          <button 
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleAddMember(voter.id)}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      ))}
                      {availableVoters.length === 0 && (
                        <p className="no-members">All voters are already in this group</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowMembersModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement; 