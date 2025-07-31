import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { getCandidates, createCandidate, updateCandidate, deleteCandidate, deleteMultipleCandidates, getPositions, getDepartments, getCoursesByDepartment, assignCandidateToElection } from '../services/api';
import { checkCurrentUser } from '../services/auth';
import { useElection } from '../contexts/ElectionContext';
import ElectionStatusMessage from '../components/ElectionStatusMessage';
import { uploadImageToBlob } from '../services/blobUpload';
import './Candidates.css';
import { getImageUrl } from '../utils/image';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    positionId: '',
    departmentId: '',
    courseId: '',
    photoUrl: '',
    description: ''
  });
  const [viewCandidate, setViewCandidate] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const role = checkCurrentUser().role;
  const { canViewCandidates, hasActiveElection, triggerImmediateRefresh } = useElection();

  useEffect(() => {
    // Trigger immediate election status refresh
    triggerImmediateRefresh();
    
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [candidatesData, positionsData, departmentsData] = await Promise.all([
        getCandidates(),
        getPositions(),
        getDepartments()
      ]);
      console.log('Fetched candidates data:', candidatesData);
      console.log('Fetched positions data:', positionsData);
      console.log('Fetched departments data:', departmentsData);
      
      // Debug individual candidates
      candidatesData.forEach(candidate => {
        console.log(`Candidate ${candidate.name}:`, {
          departmentId: candidate.departmentId,
          departmentName: candidate.departmentName,
          courseId: candidate.courseId,
          courseName: candidate.courseName
        });
      });
      
      setCandidates(candidatesData);
      setPositions(positionsData);
      setDepartments(departmentsData);
      setError('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async (departmentId) => {
    if (!departmentId) {
      setCourses([]);
      return;
    }
    
    try {
      setLoadingCourses(true);
      const coursesData = await getCoursesByDepartment(departmentId);
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleShowModal = (candidate = null) => {
    // Close view modal if it's open
    setViewCandidate(null);
    
    if (candidate) {
      setEditingCandidate(candidate);
      setFormData({
        name: candidate.name,
        positionId: candidate.positionId,
        departmentId: candidate.departmentId || '',
        courseId: candidate.courseId || '',
        photoUrl: candidate.photoUrl || '',
        description: candidate.description || ''
      });
      setPhotoPreview(candidate.photoUrl || '');
      setPhotoFile(null);
      
      // Fetch courses if department is selected
      if (candidate.departmentId) {
        fetchCourses(candidate.departmentId);
      }
    } else {
      setEditingCandidate(null);
      setFormData({
        name: '',
        positionId: '',
        departmentId: '',
        courseId: '',
        photoUrl: '',
        description: ''
      });
      setPhotoPreview('');
      setPhotoFile(null);
      setCourses([]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCandidate(null);
    setFormData({
      name: '',
      positionId: '',
      departmentId: '',
      courseId: '',
      photoUrl: '',
      description: ''
    });
    setPhotoPreview('');
    setPhotoFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'departmentId') {
      // Reset courseId when department changes
      setFormData(prev => ({
        ...prev,
        [name]: value,
        courseId: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.departmentId) {
      setError('Please select a department');
      return;
    }
    
    if (!formData.courseId) {
      setError('Please select a course');
      return;
    }
    
    try {
      let dataToSend = { ...formData };
      
      // Handle photo file conversion to base64
      if (photoFile) {
        const photoUrl = await uploadImageToBlob(photoFile);
        dataToSend.photoUrl = photoUrl;
        // Remove photoBase64 if we have a new file
        delete dataToSend.photoBase64;
      } else if (editingCandidate && !photoFile) {
        // If editing and no new photo selected, preserve the existing photo URL
        dataToSend.photoUrl = editingCandidate.photoUrl;
      }
      
      console.log('Submitting candidate data:', dataToSend);
      
      if (editingCandidate) {
        console.log('Updating candidate:', editingCandidate.id);
        await updateCandidate(editingCandidate.id, dataToSend);
      } else {
        console.log('Creating new candidate');
        await createCandidate(dataToSend);
      }
      
      console.log('Candidate saved successfully, refreshing data...');
      handleCloseModal();
      await fetchData();
    } catch (error) {
      console.error('Error saving candidate:', error);
      setError('Failed to save candidate');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await deleteCandidate(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting candidate:', error);
        setError('Failed to delete candidate');
      }
    }
  };

  const handleMultipleDelete = async () => {
    if (selectedCandidates.length === 0) {
      alert('Please select candidates to delete');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete ${selectedCandidates.length} candidate(s)?`)) {
      try {
        await deleteMultipleCandidates(selectedCandidates);
        setSelectedCandidates([]);
        setSelectAll(false);
        fetchData();
      } catch (error) {
        console.error('Error deleting multiple candidates:', error);
        setError('Failed to delete candidates');
      }
    }
  };

  const handleSelectCandidate = (id) => {
    setSelectedCandidates(prev => 
      prev.includes(id) 
        ? prev.filter(candidateId => candidateId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCandidates([]);
      setSelectAll(false);
    } else {
      setSelectedCandidates(filteredCandidates.map(candidate => candidate.id));
      setSelectAll(true);
    }
  };

  // Helper to get correct candidate photo URL


  // Filter and sort candidates
  const filteredCandidates = candidates
    .filter(candidate => {
      const term = searchTerm.toLowerCase();
      return (
        candidate.name?.toLowerCase().includes(term) ||
        candidate.positionName?.toLowerCase().includes(term) ||
        candidate.departmentName?.toLowerCase().includes(term) ||
        candidate.courseId?.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
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

  // Helper to render sort icon
  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return (
      <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'} ms-1`}></i>
    );
  };

  // User view: modern candidate cards grouped by position
  if (role === 'user') {
    // Check if user can view candidates (has active election)
    if (!canViewCandidates) {
      return <ElectionStatusMessage type="candidates" />;
    }

    // Group candidates by position
    const candidatesByPosition = candidates.reduce((groups, candidate) => {
      const position = candidate.positionName || 'Unknown Position';
      if (!groups[position]) {
        groups[position] = [];
      }
      groups[position].push(candidate);
      return groups;
    }, {});

    return (
      <div className="candidates-user-view">
        {/* Professional Header */}
        <div className="dashboard-header-pro">
          <div className="dashboard-header-row">
            <div>
              <h1 className="dashboard-title-pro">Meet the Candidates</h1>
              <p className="dashboard-subtitle-pro">Explore each candidate's platform, vision, and qualifications for their respective positions.</p>
            </div>
          </div>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        
        {candidates.length > 0 ? (
          Object.entries(candidatesByPosition).map(([position, positionCandidates]) => (
            <div key={position} className="position-section">
              <div className="position-header">
                <h2 className="position-title">{position}</h2>
                <span className="candidate-count">{positionCandidates.length} candidate{positionCandidates.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="candidate-card-grid">
                {positionCandidates.map((candidate, index) => (
                  <div className="candidate-card-modern" key={candidate.id}>
                    <div className="candidate-card-header">
                      <div className="candidate-rank-badge">
                        <span className="rank-number">{index + 1}</span>
                      </div>
                      <div className="candidate-photo-container">
                        {candidate.photoUrl ? (
                          <img src={getImageUrl(candidate.photoUrl)} alt={candidate.name} className="candidate-photo" />
                        ) : (
                          <div className="candidate-photo-placeholder">
                            <i className="fas fa-user"></i>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="candidate-card-body">
                      <div className="candidate-info">
                        <h3 className="candidate-name">
                          {candidate.name}
                          <span className="verified"><i className="fas fa-check-circle"></i></span>
                        </h3>
                        <p className="candidate-position">{candidate.positionName}</p>
                        {(candidate.departmentName || candidate.courseName) && (
                          <p className="candidate-department">
                            <i className="fas fa-university me-1"></i>
                            {candidate.departmentName}
                            {candidate.courseId && (
                              <span className="candidate-course">
                                <i className="fas fa-graduation-cap me-1"></i>
                                {candidate.courseId}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      <div className="candidate-brief">
                        <p>
                          {candidate.description ? 
                            candidate.description.substring(0, 120) + (candidate.description.length > 120 ? '...' : '') :
                            'Learn more about this candidate and their vision for the position.'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="candidate-card-footer">
                      <button 
                        className="expand-btn"
                        onClick={() => setViewCandidate(candidate)}
                      >
                        View Platform
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="no-candidates">
            <div className="no-candidates-content">
              <i className="fas fa-users"></i>
              <h3>No Candidates Yet</h3>
              <p>Candidates will appear here once they are added to the system.</p>
            </div>
          </div>
        )}
        
        {/* Enhanced View Candidate Modal */}
        {viewCandidate && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="modal-candidate-info">
                    <div className="modal-candidate-photo-container">
                      {viewCandidate?.photoUrl ? (
                        <img src={getImageUrl(viewCandidate.photoUrl)} alt={viewCandidate.name} className="modal-candidate-photo" />
                      ) : (
                        <div className="modal-candidate-photo-placeholder">
                          <i className="fas fa-user"></i>
                        </div>
                      )}
                    </div>
                    <div className="modal-candidate-details">
                      <h4 className="modal-candidate-name">{viewCandidate?.name}</h4>
                      <p className="modal-position">{viewCandidate?.positionName}</p>
                      <div className="candidate-status">
                        <span className="badge bg-success">
                          <i className="fas fa-check-circle me-1"></i>
                          Verified Candidate
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setViewCandidate(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    {/* Main Content */}
                    <div className="col-lg-8">
                      {/* Platform & Vision Section */}
                      <div className="candidate-platform mb-4">
                        <div className="platform-header">
                          <i className="fas fa-bullhorn"></i>
                          <h5>Platform & Vision</h5>
                        </div>
                        <div className="platform-content">
                          {viewCandidate?.description ? (
                            <div className="platform-text">
                              {viewCandidate.description.split('\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                              ))}
                            </div>
                          ) : (
                            <div className="no-platform">
                              <i className="fas fa-info-circle"></i>
                              <p>No platform information available yet.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Key Priorities Section */}
                      <div className="candidate-priorities mb-4">
                        <div className="priorities-header">
                          <i className="fas fa-target"></i>
                          <h5>Key Priorities</h5>
                        </div>
                        <div className="priorities-content">
                          <div className="priority-item">
                            <i className="fas fa-star text-warning"></i>
                            <span>Transparency and Accountability</span>
                          </div>
                          <div className="priority-item">
                            <i className="fas fa-star text-warning"></i>
                            <span>Community Engagement</span>
                          </div>
                          <div className="priority-item">
                            <i className="fas fa-star text-warning"></i>
                            <span>Innovation and Progress</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-lg-4">
                      {/* Candidate Details */}
                      <div className="candidate-details-card mb-4">
                        <div className="card">
                          <div className="card-header">
                            <h6><i className="fas fa-user-circle me-2"></i>Candidate Details</h6>
                          </div>
                          <div className="card-body">
                            <div className="detail-item">
                              <i className="fas fa-id-card"></i>
                              <span><strong>Position:</strong> {viewCandidate?.positionName}</span>
                            </div>
                            <div className="detail-item">
                              <i className="fas fa-user"></i>
                              <span><strong>Name:</strong> {viewCandidate?.name}</span>
                            </div>
                            {(viewCandidate?.departmentName || viewCandidate?.courseName) && (
                              <div className="detail-item">
                                <i className="fas fa-university"></i>
                                <span><strong>Department:</strong> {viewCandidate?.departmentName || 'Not specified'}</span>
                              </div>
                            )}
                            {viewCandidate?.courseId && (
                              <div className="detail-item">
                                <i className="fas fa-graduation-cap"></i>
                                <span><strong>Course:</strong> {viewCandidate?.courseId}</span>
                              </div>
                            )}
                            <div className="detail-item">
                              <i className="fas fa-calendar-alt"></i>
                              <span><strong>Registration Date:</strong> {new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="detail-item">
                              <i className="fas fa-check-circle"></i>
                              <span><strong>Status:</strong> <span className="text-success">Active</span></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Campaign Statistics */}
                      <div className="campaign-stats-card mb-4">
                        <div className="card">
                          <div className="card-header">
                            <h6><i className="fas fa-chart-bar me-2"></i>Campaign Statistics</h6>
                          </div>
                          <div className="card-body">
                            <div className="stat-item">
                              <div className="stat-number">0</div>
                              <div className="stat-label">Total Votes</div>
                            </div>
                            <div className="stat-item">
                              <div className="stat-number">0%</div>
                              <div className="stat-label">Vote Share</div>
                            </div>
                            <div className="stat-item">
                              <div className="stat-number">0</div>
                              <div className="stat-label">Endorsements</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions - Only for Admins */}
                      {(role === 'admin' || role === 'superadmin') && (
                        <div className="quick-actions-card">
                          <div className="card">
                            <div className="card-header">
                              <h6><i className="fas fa-bolt me-2"></i>Quick Actions</h6>
                            </div>
                            <div className="card-body">
                              <button 
                                className="btn btn-outline-primary btn-sm w-100 mb-2"
                                onClick={() => {
                                  setViewCandidate(null);
                                  handleShowModal(viewCandidate);
                                }}
                              >
                                <i className="fas fa-edit me-2"></i>Edit Candidate
                              </button>
                              <button className="btn btn-outline-info btn-sm w-100 mb-2">
                                <i className="fas fa-share me-2"></i>Share Profile
                              </button>
                              <button className="btn btn-outline-success btn-sm w-100">
                                <i className="fas fa-download me-2"></i>Export Details
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <div className="d-flex justify-content-between w-100">
                    {/* Admin Actions - Only for Admins */}
                    {(role === 'admin' || role === 'superadmin') && (
                      <div className="modal-actions">
                        <button 
                          className="btn btn-outline-primary me-2"
                          onClick={() => {
                            setViewCandidate(null);
                            handleShowModal(viewCandidate);
                          }}
                        >
                          <i className="fas fa-edit me-2"></i>Edit
                        </button>
                        <button className="btn btn-outline-info me-2">
                          <i className="fas fa-share me-2"></i>Share
                        </button>
                      </div>
                    )}
                    <button className="btn btn-secondary" onClick={() => setViewCandidate(null)}>
                      <i className="fas fa-times me-2"></i>Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Admin/Superadmin view (full CRUD)
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
    <div className="candidates-management-container">
      {/* Unified Professional Header */}
      <div className="dashboard-header-pro">
        <div className="dashboard-header-row">
          <div>
            <h1 className="dashboard-title-pro">Manage Candidates</h1>
            <p className="dashboard-subtitle-pro">Add, edit, and view all election candidates.</p>
          </div>
          <div className="dashboard-header-actions">
            <button className="btn btn-custom-blue" onClick={() => handleShowModal()}>
              Add Candidate
            </button>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {selectedCandidates.length > 0 && (
        <div className="mb-3 p-3 bg-warning bg-opacity-10 border border-warning rounded">
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-warning">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {selectedCandidates.length} candidate(s) selected
            </span>
            <button
              className="btn btn-danger btn-sm"
              onClick={handleMultipleDelete}
            >
              <i className="fas fa-trash me-1"></i>
              Delete Selected ({selectedCandidates.length})
            </button>
          </div>
        </div>
      )}

      <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: 300 }}
          placeholder="Search by name, department, course, or position..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
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
              <th>Photo</th>
              <th
                className={sortField === 'name' ? 'sortable active-sort' : 'sortable'}
                style={{ cursor: 'pointer' }}
                onClick={() => setSortField('name') || setSortOrder(sortField === 'name' && sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                Name {renderSortIcon('name')}
              </th>
              <th
                className={sortField === 'positionName' ? 'sortable active-sort' : 'sortable'}
                style={{ cursor: 'pointer' }}
                onClick={() => setSortField('positionName') || setSortOrder(sortField === 'positionName' && sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                Position {renderSortIcon('positionName')}
              </th>
              <th
                className={sortField === 'departmentName' ? 'sortable active-sort' : 'sortable'}
                style={{ cursor: 'pointer' }}
                onClick={() => setSortField('departmentName') || setSortOrder(sortField === 'departmentName' && sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                Department {renderSortIcon('departmentName')}
              </th>
              <th
                className={sortField === 'courseId' ? 'sortable active-sort' : 'sortable'}
                style={{ cursor: 'pointer' }}
                onClick={() => setSortField('courseId') || setSortOrder(sortField === 'courseId' && sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                Course {renderSortIcon('courseId')}
              </th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate, index) => (
                <tr key={candidate.id}>
                  <td>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedCandidates.includes(candidate.id)}
                      onChange={() => handleSelectCandidate(candidate.id)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>
                    {candidate.photoUrl ? (
                      <img 
                        src={getImageUrl(candidate.photoUrl)} 
                        alt={candidate.name}
                        className="candidate-table-photo"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="candidate-table-photo-placeholder">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                  </td>
                  <td>{candidate.name}</td>
                  <td>{candidate.positionName}</td>
                  <td>{candidate.departmentName || '-'}</td>
                  <td>{candidate.courseId || '-'}</td>
                  <td>{candidate.description || '-'}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleShowModal(candidate)}
                      title="Edit Candidate"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger me-2"
                      onClick={() => handleDelete(candidate.id)}
                      title="Delete Candidate"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-info"
                      onClick={() => setViewCandidate(candidate)}
                      title="View Candidate"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No candidates found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced View Candidate Modal */}
      {viewCandidate && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-candidate-info">
                  <div className="modal-candidate-photo-container">
                    {viewCandidate?.photoUrl ? (
                      <img src={getImageUrl(viewCandidate.photoUrl)} alt={viewCandidate.name} className="modal-candidate-photo" />
                    ) : (
                      <div className="modal-candidate-photo-placeholder">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                  </div>
                  <div className="modal-candidate-details">
                    <h4 className="modal-candidate-name">{viewCandidate?.name}</h4>
                    <p className="modal-position">{viewCandidate?.positionName}</p>
                    <div className="candidate-status">
                      <span className="badge bg-success">
                        <i className="fas fa-check-circle me-1"></i>
                        Verified Candidate
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setViewCandidate(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {/* Main Content */}
                  <div className="col-lg-8">
                    {/* Platform & Vision Section */}
                    <div className="candidate-platform mb-4">
                      <div className="platform-header">
                        <i className="fas fa-bullhorn"></i>
                        <h5>Platform & Vision</h5>
                      </div>
                      <div className="platform-content">
                        {viewCandidate?.description ? (
                          <div className="platform-text">
                            {viewCandidate.description.split('\n').map((paragraph, index) => (
                              <p key={index}>{paragraph}</p>
                            ))}
                          </div>
                        ) : (
                          <div className="no-platform">
                            <i className="fas fa-info-circle"></i>
                            <p>No platform information available yet.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Key Priorities Section */}
                    <div className="candidate-priorities mb-4">
                      <div className="priorities-header">
                        <i className="fas fa-target"></i>
                        <h5>Key Priorities</h5>
                      </div>
                      <div className="priorities-content">
                        <div className="priority-item">
                          <i className="fas fa-star text-warning"></i>
                          <span>Transparency and Accountability</span>
                        </div>
                        <div className="priority-item">
                          <i className="fas fa-star text-warning"></i>
                          <span>Community Engagement</span>
                        </div>
                        <div className="priority-item">
                          <i className="fas fa-star text-warning"></i>
                          <span>Innovation and Progress</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="col-lg-4">
                    {/* Candidate Details */}
                    <div className="candidate-details-card mb-4">
                      <div className="card">
                        <div className="card-header">
                          <h6><i className="fas fa-user-circle me-2"></i>Candidate Details</h6>
                        </div>
                        <div className="card-body">
                          <div className="detail-item">
                            <i className="fas fa-id-card"></i>
                            <span><strong>Position:</strong> {viewCandidate?.positionName}</span>
                          </div>
                          <div className="detail-item">
                            <i className="fas fa-user"></i>
                            <span><strong>Name:</strong> {viewCandidate?.name}</span>
                          </div>
                          {(viewCandidate?.departmentName || viewCandidate?.courseName) && (
                            <div className="detail-item">
                              <i className="fas fa-university"></i>
                              <span><strong>Department:</strong> {viewCandidate?.departmentName || 'Not specified'}</span>
                            </div>
                          )}
                          {viewCandidate?.courseId && (
                            <div className="detail-item">
                              <i className="fas fa-graduation-cap"></i>
                              <span><strong>Course:</strong> {viewCandidate?.courseId}</span>
                            </div>
                          )}
                          <div className="detail-item">
                            <i className="fas fa-calendar-alt"></i>
                            <span><strong>Registration Date:</strong> {new Date().toLocaleDateString()}</span>
                          </div>
                          <div className="detail-item">
                            <i className="fas fa-check-circle"></i>
                            <span><strong>Status:</strong> <span className="text-success">Active</span></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Campaign Statistics */}
                    <div className="campaign-stats-card mb-4">
                      <div className="card">
                        <div className="card-header">
                          <h6><i className="fas fa-chart-bar me-2"></i>Campaign Statistics</h6>
                        </div>
                        <div className="card-body">
                          <div className="stat-item">
                            <div className="stat-number">0</div>
                            <div className="stat-label">Total Votes</div>
                          </div>
                          <div className="stat-item">
                            <div className="stat-number">0%</div>
                            <div className="stat-label">Vote Share</div>
                          </div>
                          <div className="stat-item">
                            <div className="stat-number">0</div>
                            <div className="stat-label">Endorsements</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions-card">
                      <div className="card">
                        <div className="card-header">
                          <h6><i className="fas fa-bolt me-2"></i>Quick Actions</h6>
                        </div>
                        <div className="card-body">
                          <button className="btn btn-outline-primary btn-sm w-100 mb-2" onClick={() => handleShowModal(viewCandidate)}>
                            <i className="fas fa-edit me-2"></i>Edit Candidate
                          </button>
                          <button className="btn btn-outline-info btn-sm w-100 mb-2">
                            <i className="fas fa-share me-2"></i>Share Profile
                          </button>
                          <button className="btn btn-outline-success btn-sm w-100">
                            <i className="fas fa-download me-2"></i>Export Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <div className="d-flex justify-content-between w-100">
                  <div className="modal-actions">
                    <button className="btn btn-outline-primary me-2" onClick={() => handleShowModal(viewCandidate)}>
                      <i className="fas fa-edit me-2"></i>Edit
                    </button>
                    <button className="btn btn-outline-info me-2">
                      <i className="fas fa-share me-2"></i>Share
                    </button>
                  </div>
                  <button className="btn btn-secondary" onClick={() => setViewCandidate(null)}>
                    <i className="fas fa-times me-2"></i>Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCandidate ? 'Edit Candidate' : 'Add Candidate'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
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
                    <label className="form-label">Position</label>
                    <select
                      className="form-select"
                      name="positionId"
                      value={formData.positionId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a position</option>
                      {positions.map(position => (
                        <option key={position.id} value={position.id}>
                          {position.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Department *</label>
                    <select
                      className="form-select"
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={(e) => {
                        handleChange(e);
                        fetchCourses(e.target.value);
                      }}
                      required
                    >
                      <option value="">Select a department</option>
                      {departments.map(department => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                    <small className="text-muted">Choose the department this candidate represents (required)</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Course *</label>
                    <select
                      className="form-select"
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleChange}
                      disabled={!formData.departmentId || loadingCourses}
                      required
                    >
                      <option value="">Select a course</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.id} - {course.name}
                        </option>
                      ))}
                    </select>
                    <small className="text-muted">
                      {loadingCourses ? 'Loading courses...' : 
                       formData.departmentId ? 'Choose the course this candidate represents (required)' : 
                       'Select a department first to choose a course'}
                    </small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Photo (profile picture)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                    {photoPreview && (
                      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <img
                          src={photoPreview}
                          alt="Preview"
                          style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description (optional)</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Brief description about the candidate"
                    ></textarea>
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
                    {editingCandidate ? 'Update' : 'Create'}
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

export default Candidates; 