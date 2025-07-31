import React, { useState, useEffect } from 'react';
import { getVoters, createVoter, updateVoter, deleteVoter, deleteMultipleVoters, getDepartments, getCoursesByDepartment } from '../services/api';
import BulkDeleteModal from '../components/Common/BulkDeleteModal';
import { usePersistentSort } from '../hooks/usePersistentSort';

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
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  
  // Use persistent sorting
  const {
    sortConfig,
    handleSort,
    getSortIcon,
    applySorting
  } = usePersistentSort('voters-sort', { key: 'name', direction: 'asc' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    hasVoted: false,
    departmentId: '',
    courseId: ''
  });
  const [selectedVoters, setSelectedVoters] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchVoters();
    fetchDepartments();
  }, []);

  useEffect(() => {
    filterAndSortVoters();
  }, [voters, searchTerm, sortConfig]);

  useEffect(() => {
    // Update selectAll state when filtered data or selection changes
    if (filteredVoters.length === 0) {
      setSelectAll(false);
    } else {
      const allFilteredSelected = filteredVoters.every(voter => selectedVoters.includes(voter.id));
      setSelectAll(allFilteredSelected && selectedVoters.length > 0);
    }
  }, [filteredVoters, selectedVoters]);

  const filterAndSortVoters = () => {
    let filtered = voters;

    // Apply search filter
    if (searchTerm) {
      filtered = voters.filter(voter =>
        voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (voter.departmentId && voter.departmentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (voter.courseId && voter.courseId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties
        if (sortConfig.key === 'departmentId') {
          aValue = a.departmentId || '';
          bValue = b.departmentId || '';
        } else if (sortConfig.key === 'courseId') {
          aValue = a.courseId || '';
          bValue = b.courseId || '';
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

  // handleSort and getSortIcon are now provided by usePersistentSort hook

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
    setError('');
    
    // Student ID format validation for both new and edited voters
    const idPattern = /^\d{4}-\d{5}$/;
    if (!idPattern.test(formData.studentId)) {
      setError('Student ID must be in the format YYYY-NNNNN (e.g., 2024-00001)');
      return;
    }
    
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingVoter, setDeletingVoter] = useState(null);

  const handleDelete = async (id) => {
    const voter = voters.find(v => v.id === id);
    setDeletingVoter(voter);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingVoter) return;
    
    try {
      await deleteVoter(deletingVoter.id);
      fetchVoters();
      setSuccess('Voter deleted successfully!');
      setShowDeleteModal(false);
      setDeletingVoter(null);
    } catch (error) {
      console.error('Error deleting voter:', error);
      setError('Failed to delete voter');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingVoter(null);
  };

  const handleMultipleDelete = () => {
    if (selectedVoters.length === 0) {
      setError('Please select voters to delete');
      return;
    }
    setShowBulkDeleteModal(true);
  };

  const confirmBulkDelete = async () => {
    try {
      setIsBulkDeleting(true);
      setError('');
      
      const votersToDelete = voters.filter(voter => selectedVoters.includes(voter.id));
      const deleteCount = selectedVoters.length;
      
      await deleteMultipleVoters(selectedVoters);
      
      setSelectedVoters([]);
      setSelectAll(false);
      setShowBulkDeleteModal(false);
      
      await fetchVoters();
      setSuccess(`${deleteCount} voter(s) deleted successfully!`);
    } catch (error) {
      console.error('Error deleting multiple voters:', error);
      
      let errorMessage = 'Failed to delete voters';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to delete these voters';
      } else if (error.response?.status === 409) {
        errorMessage = 'Some voters cannot be deleted - they may have voted in active elections';
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your connection and try again';
      }
      
      setError(`${errorMessage}. ${selectedVoters.length} voter(s) were selected for deletion.`);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const cancelBulkDelete = () => {
    setShowBulkDeleteModal(false);
  };

  const handleSelectVoter = (id) => {
    setSelectedVoters(prev => 
      prev.includes(id) 
        ? prev.filter(voterId => voterId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedVoters([]);
      setSelectAll(false);
    } else {
      setSelectedVoters(filteredVoters.map(voter => voter.id));
      setSelectAll(true);
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
          {selectedVoters.length > 0 && (
            <div className="mb-3 p-3 bg-warning bg-opacity-10 border border-warning rounded">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-warning">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {selectedVoters.length} voter(s) selected
                </span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleMultipleDelete}
                >
                  <i className="fas fa-trash me-1"></i>
                  Delete Selected ({selectedVoters.length})
                </button>
              </div>
            </div>
          )}
          
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-header-custom">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>#</th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('name')}
                    className="sortable-header"
                  >
                    Name <i className={getSortIcon('name')}></i>
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('email')}
                    className="sortable-header"
                  >
                    Email <i className={getSortIcon('email')}></i>
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('studentId')}
                    className="sortable-header"
                  >
                    Student ID <i className={getSortIcon('studentId')}></i>
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('departmentId')}
                    className="sortable-header"
                  >
                    Department <i className={getSortIcon('departmentId')}></i>
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('courseId')}
                    className="sortable-header"
                  >
                    Course <i className={getSortIcon('courseId')}></i>
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('hasVoted')}
                    className="sortable-header"
                  >
                    Voting Status <i className={getSortIcon('hasVoted')}></i>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVoters.length > 0 ? (
                  filteredVoters.map((voter, index) => (
                    <tr key={voter.id}>
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedVoters.includes(voter.id)}
                          onChange={() => handleSelectVoter(voter.id)}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{voter.name}</td>
                      <td>{voter.email}</td>
                      <td>{voter.studentId}</td>
                      <td>
                        {voter.departmentId ? (
                          <span className="badge bg-primary">
                            {voter.departmentId}
                          </span>
                        ) : (
                          <span className="text-muted">No department</span>
                        )}
                      </td>
                      <td>
                        {voter.courseId ? (
                          <span className="badge bg-info">
                            {voter.courseId}
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
                          title="Edit Voter"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(voter.id)}
                          title="Delete Voter"
                        >
                          <i className="fas fa-trash"></i>
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

      {/* Enhanced Bulk Delete Modal */}
      <BulkDeleteModal
        show={showBulkDeleteModal}
        items={voters.filter(voter => selectedVoters.includes(voter.id))}
        itemType="voter"
        onConfirm={confirmBulkDelete}
        onCancel={cancelBulkDelete}
        isDeleting={isBulkDeleting}
        getItemDisplayName={(voter) => `${voter.name} (${voter.email})`}
      />

      {/* Individual Delete Modal */}
      {showDeleteModal && deletingVoter && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-backdrop fade show"></div>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-exclamation-triangle text-danger me-2"></i>
                  Confirm Delete Voter
                </h5>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this voter?</p>
                <div className="bg-light p-3 rounded">
                  <strong>{deletingVoter.name}</strong><br/>
                  <small className="text-muted">{deletingVoter.email}</small>
                </div>
                <div className="alert alert-warning mt-3">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  This action cannot be undone.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                  Delete Voter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Voters; 