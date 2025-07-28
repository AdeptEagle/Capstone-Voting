import React, { useState, useEffect } from 'react';
import { getVoters, createVoter, updateVoter, deleteVoter, getDepartments, getCoursesByDepartment } from '../services/api';

const Voters = () => {
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVoter, setEditingVoter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    hasVoted: false,
    departmentId: '',
    courseId: ''
  });

  useEffect(() => {
    fetchVoters();
    fetchDepartments();
  }, []);

  useEffect(() => {
    filterAndSortVoters();
  }, [voters, searchTerm, sortConfig]);

  const filterAndSortVoters = () => {
    let filtered = voters;

    // Apply search filter
    if (searchTerm) {
      filtered = voters.filter(voter =>
        voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (voter.departmentName && voter.departmentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (voter.courseName && voter.courseName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties
        if (sortConfig.key === 'departmentName') {
          aValue = a.departmentName || '';
          bValue = b.departmentName || '';
        } else if (sortConfig.key === 'courseName') {
          aValue = a.courseName || '';
          bValue = b.courseName || '';
        }

        // Handle boolean values
        if (sortConfig.key === 'hasVoted') {
          aValue = a.hasVoted ? 1 : 0;
          bValue = b.hasVoted ? 1 : 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredVoters(filtered);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <i className="fas fa-sort text-muted"></i>;
    }
    return sortConfig.direction === 'asc' 
      ? <i className="fas fa-sort-up text-primary"></i>
      : <i className="fas fa-sort-down text-primary"></i>;
  };

  const fetchDepartments = async () => {
    try {
      const depts = await getDepartments();
      setDepartments(depts);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchCourses = async (departmentId) => {
    setLoadingCourses(true);
    try {
      const departmentCourses = await getCoursesByDepartment(departmentId);
      setCourses(departmentCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchVoters = async () => {
    try {
      setLoading(true);
      const data = await getVoters();
      setVoters(data);
      setError('');
    } catch (error) {
      console.error('Error fetching voters:', error);
      setError('Failed to load voters');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (voter = null) => {
    if (voter) {
      setEditingVoter(voter);
      setFormData({
        name: voter.name,
        email: voter.email,
        studentId: voter.studentId,
        hasVoted: voter.hasVoted,
        departmentId: voter.departmentId || '',
        courseId: voter.courseId || ''
      });
      // Load courses for the voter's department
      if (voter.departmentId) {
        fetchCourses(voter.departmentId);
      }
    } else {
      setEditingVoter(null);
      setFormData({
        name: '',
        email: '',
        studentId: '',
        hasVoted: false,
        departmentId: '',
        courseId: ''
      });
      setCourses([]);
    }
    setShowModal(true);
    setSuccess('');
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVoter(null);
    setFormData({
      name: '',
      email: '',
      studentId: '',
      hasVoted: false,
      departmentId: '',
      courseId: ''
    });
    setCourses([]);
    setSuccess('');
    setError('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // If department changes, reset course and fetch new courses
    if (name === 'departmentId') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        courseId: '' // Reset course when department changes
      }));
      
      if (value) {
        fetchCourses(value);
      } else {
        setCourses([]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVoter) {
        await updateVoter(editingVoter.id, formData);
        setSuccess('Voter updated successfully!');
      } else {
        const response = await createVoter(formData);
        if (response.defaultPassword) {
          setSuccess(`Voter created successfully! Default password is: ${response.defaultPassword}`);
        } else {
          setSuccess('Voter created successfully!');
        }
      }
      fetchVoters();
      // Don't close modal immediately to show the success message
      setTimeout(() => {
        handleCloseModal();
      }, 3000);
    } catch (error) {
      console.error('Error saving voter:', error);
      setError('Failed to save voter');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this voter?')) {
      try {
        await deleteVoter(id);
        fetchVoters();
        setSuccess('Voter deleted successfully!');
      } catch (error) {
        console.error('Error deleting voter:', error);
        setError('Failed to delete voter');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="voters-container">
      {/* Unified Professional Header */}
      <div className="dashboard-header-pro">
        <div className="dashboard-header-row">
          <div>
            <h1 className="dashboard-title-pro">Manage Voters</h1>
            <p className="dashboard-subtitle-pro">Register and manage voter accounts with academic departments and courses.</p>
          </div>
          <div className="dashboard-header-actions">
            <button className="btn btn-custom-blue" onClick={() => handleShowModal()}>
              Add Voter
            </button>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Search and Filter Section */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search voters by name, email, student ID, department, or course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-6 text-end">
              <small className="text-muted">
                Showing {filteredVoters.length} of {voters.length} voters
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-header-custom">
                <tr>
                  <th>#</th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('name')}
                    className="sortable-header"
                  >
                    Name {getSortIcon('name')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('email')}
                    className="sortable-header"
                  >
                    Email {getSortIcon('email')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('studentId')}
                    className="sortable-header"
                  >
                    Student ID {getSortIcon('studentId')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('departmentName')}
                    className="sortable-header"
                  >
                    Department {getSortIcon('departmentName')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('courseName')}
                    className="sortable-header"
                  >
                    Course {getSortIcon('courseName')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('hasVoted')}
                    className="sortable-header"
                  >
                    Voting Status {getSortIcon('hasVoted')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVoters.length > 0 ? (
                  filteredVoters.map((voter, index) => (
                    <tr key={voter.id}>
                      <td>{index + 1}</td>
                      <td>{voter.name}</td>
                      <td>{voter.email}</td>
                      <td>{voter.studentId}</td>
                      <td>
                        {voter.departmentName ? (
                          <span className="badge bg-primary">
                            {voter.departmentName}
                          </span>
                        ) : (
                          <span className="text-muted">No department</span>
                        )}
                      </td>
                      <td>
                        {voter.courseName ? (
                          <span className="badge bg-info">
                            <strong>{voter.courseId}</strong> - {voter.courseName}
                          </span>
                        ) : (
                          <span className="text-muted">No course</span>
                        )}
                      </td>
                      <td>
                        {voter.hasVoted ? (
                          <span className="badge bg-success">Voted</span>
                        ) : (
                          <span className="badge bg-warning text-dark">Not Voted</span>
                        )}
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleShowModal(voter)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(voter.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">No voters found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingVoter ? 'Edit Voter' : 'Add Voter'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {!editingVoter && (
                    <div className="alert alert-info mb-3">
                      <strong>Note:</strong> Voters created without a password will have their Student ID as the default password.
                    </div>
                  )}
                  {success && <div className="alert alert-success">{success}</div>}
                  {error && <div className="alert alert-danger">{error}</div>}
                  
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Student ID</label>
                    <input
                      type="text"
                      className="form-control"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-university me-2"></i>
                      Department (Optional)
                    </label>
                    <select
                      className="form-control"
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleChange}
                    >
                      <option value="">Select a department</option>
                      {departments.map(department => (
                        <option key={department.id} value={department.id}>
                          {department.name} ({department.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-graduation-cap me-2"></i>
                      Course (Optional)
                    </label>
                    <select
                      className="form-control"
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleChange}
                      disabled={!formData.departmentId || loadingCourses}
                    >
                      <option value="">
                        {!formData.departmentId 
                          ? 'Select department first' 
                          : loadingCourses 
                            ? 'Loading courses...' 
                            : 'Select a course'
                        }
                      </option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="hasVoted"
                        checked={formData.hasVoted}
                        onChange={handleChange}
                        id="hasVoted"
                      />
                      <label className="form-check-label" htmlFor="hasVoted">
                        Has voted
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-custom-blue">
                    {editingVoter ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Voters; 