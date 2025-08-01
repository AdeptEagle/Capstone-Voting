import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { getCandidates, createCandidate, updateCandidate, deleteCandidate, deleteMultipleCandidates, getPositions, getDepartments, getCoursesByDepartment } from '../services/api';
import { checkCurrentUser } from '../services/auth';
import { useElection } from '../contexts/ElectionContext';
import ElectionStatusMessage from '../components/ElectionStatusMessage';
import './Candidates.css';

// Import new components and utilities
import CandidateCard from '../components/Candidates/CandidateCard';
import CandidateForm from '../components/Candidates/CandidateForm';
import CandidateViewModal from '../components/Candidates/CandidateViewModal';
import { useCandidateForm } from '../hooks/useCandidateForm';
import { usePersistentSort } from '../hooks/usePersistentSort';
import { filterCandidates, filterAndSortCandidates, groupCandidatesByPosition, formatCandidateData } from '../utils/candidateUtils';
import BulkDeleteModal from '../components/Common/BulkDeleteModal';
import { uploadToCloudinary } from '../services/cloudinaryService';
import { CandidateImage } from '../utils/image';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewCandidate, setViewCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  
  // Use persistent sorting
  const {
    sortConfig,
    handleSort,
    getSortIcon,
    applySorting
  } = usePersistentSort('candidates-sort', { key: 'name', direction: 'asc' });

  const role = checkCurrentUser().role;
  const isAdmin = role === 'admin' || role === 'superadmin';
  const { canViewCandidates, hasActiveElection, triggerImmediateRefresh } = useElection();

  // Use custom hook for form management
  const {
    formData,
    photoFile,
    photoPreview,
    resetForm,
    populateForm,
    handleChange,
    handlePhotoChange,
    handleRemovePhoto,
    validateForm
  } = useCandidateForm();

  useEffect(() => {
    // Trigger immediate election status refresh
    triggerImmediateRefresh();
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = filterCandidates(candidates, searchTerm);
    const sorted = applySorting(filtered);
    setFilteredCandidates(sorted);
  }, [candidates, searchTerm, sortConfig, applySorting]);

  useEffect(() => {
    // Update selectAll state when filtered data or selection changes
    if (filteredCandidates.length === 0) {
      setSelectAll(false);
    } else {
      const allFilteredSelected = filteredCandidates.every(candidate => selectedCandidates.includes(candidate.id));
      setSelectAll(allFilteredSelected && selectedCandidates.length > 0);
    }
  }, [filteredCandidates, selectedCandidates]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [candidatesData, positionsData, departmentsData] = await Promise.all([
        getCandidates(),
        getPositions(),
        getDepartments()
      ]);

      // Transform candidates data to include position names
      const candidatesWithPositions = candidatesData.map(candidate => ({
        ...candidate,
        positionName: positionsData.find(p => p.id === candidate.positionId)?.name || 'No Position'
      }));

      setCandidates(candidatesWithPositions);
      setPositions(positionsData);
      setDepartments(departmentsData);
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
      setError('Failed to load courses');
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleShowModal = (candidate = null) => {
    if (candidate) {
      setEditingCandidate(candidate);
      populateForm(candidate);
      if (candidate.departmentId) {
        fetchCourses(candidate.departmentId);
      }
    } else {
      setEditingCandidate(null);
      resetForm();
      setCourses([]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCandidate(null);
    resetForm();
    setCourses([]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fill in all required fields correctly');
      return;
    }

    try {
      setLoading(true);
      setError('');

      let photoUrl = formData.photoUrl;
      if (photoFile) {
        try {
          photoUrl = await uploadToCloudinary(photoFile);
        } catch (uploadError) {
          console.error('❌ Cloudinary upload failed:', uploadError);
          setError(`Photo upload failed: ${uploadError.message}. Please try again or continue without photo.`);
          return;
        }
      }

      const candidateData = formatCandidateData(formData, photoUrl);

      if (editingCandidate) {
        await updateCandidate(editingCandidate.id, candidateData);
      } else {
        await createCandidate(candidateData);
      }

      await fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving candidate:', error);
      
      // Enhanced error handling with specific messages
      let errorMessage = 'Failed to save candidate';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 409) {
        errorMessage = 'A candidate with this name already exists for this position';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid candidate data. Please check all fields and try again';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again or contact support';
      } else if (error.message) {
        errorMessage = error.message;
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your connection and try again';
      }
      
      // Add context about what was being done
      const action = editingCandidate ? 'update' : 'create';
      setError(`Failed to ${action} candidate: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this candidate? This action cannot be undone.')) {
      try {
        await deleteCandidate(id);
        await fetchData();
      } catch (error) {
        console.error('Error deleting candidate:', error);
        
        let errorMessage = 'Failed to delete candidate';
        
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.status === 403) {
          errorMessage = 'You do not have permission to delete this candidate';
        } else if (error.response?.status === 409) {
          errorMessage = 'Cannot delete candidate - they may be associated with an active election';
        } else if (error.response?.status === 404) {
          errorMessage = 'Candidate not found - they may have already been deleted';
        } else if (!navigator.onLine) {
          errorMessage = 'No internet connection. Please check your connection and try again';
        }
        
        setError(errorMessage);
      }
    }
  };

  const handleMultipleDelete = () => {
    if (selectedCandidates.length === 0) {
      setError('Please select candidates to delete');
      return;
    }
    setShowBulkDeleteModal(true);
  };

  const confirmBulkDelete = async () => {
    try {
      setIsBulkDeleting(true);
      setError('');
      
      const candidatesToDelete = candidates.filter(candidate => selectedCandidates.includes(candidate.id));
      const deleteCount = selectedCandidates.length;
      
      await deleteMultipleCandidates(selectedCandidates);
      
      setSelectedCandidates([]);
      setSelectAll(false);
      setShowBulkDeleteModal(false);
      
      await fetchData();
      setSuccess(`${deleteCount} candidate(s) deleted successfully!`);
    } catch (error) {
      console.error('Error deleting candidates:', error);
      
      let errorMessage = 'Failed to delete selected candidates';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to delete these candidates';
      } else if (error.response?.status === 409) {
        errorMessage = 'Some candidates cannot be deleted - they may be associated with active elections';
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your connection and try again';
      }
      
      setError(`${errorMessage}. ${selectedCandidates.length} candidate(s) were selected for deletion.`);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const cancelBulkDelete = () => {
    setShowBulkDeleteModal(false);
  };

  const handleSelectCandidate = (id, isSelected) => {
    if (isSelected) {
      setSelectedCandidates([...selectedCandidates, id]);
    } else {
      setSelectedCandidates(selectedCandidates.filter(candidateId => candidateId !== id));
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map(candidate => candidate.id));
    }
    setSelectAll(!selectAll);
  };

  // handleSort is now provided by usePersistentSort hook

  // renderSortIcon replaced by getSortIcon from usePersistentSort hook

  // Only admins can access the candidate management page
  if (!isAdmin) {
    return (
      <div className="candidates-container">
        <div className="alert alert-warning text-center">
          <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
          <h4>Access Restricted</h4>
          <p>Only administrators can manage candidates. Regular users should use the "View Candidates" page.</p>
        </div>
      </div>
    );
  }

  if (!canViewCandidates) {
    return <ElectionStatusMessage />;
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const candidatesByPosition = groupCandidatesByPosition(filteredCandidates);

  return (
    <div className="candidates-container">
      {/* Header */}
      <div className="dashboard-header-pro">
        <div className="dashboard-header-row">
          <div>
            <h1 className="dashboard-title-pro">Candidate Management</h1>
            <p className="dashboard-subtitle-pro">Manage election candidates and their information</p>
          </div>
          <div className="dashboard-header-actions">
            {isAdmin && (
              <Button
                variant="primary"
                onClick={() => handleShowModal()}
                disabled={hasActiveElection}
                title={hasActiveElection ? "Cannot add candidates during active election" : ""}
              >
                <i className="fas fa-plus me-2"></i>Add Candidate
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Controls */}
      <div className="candidates-controls mb-4">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                className="form-control"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex justify-content-end gap-2">
              {isAdmin && selectedCandidates.length > 0 && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleMultipleDelete}
                  disabled={hasActiveElection}
                >
                  <i className="fas fa-trash me-1"></i>
                  Delete Selected ({selectedCandidates.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="candidates-table-container">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                {isAdmin && (
                  <th>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      disabled={filteredCandidates.length === 0}
                    />
                  </th>
                )}
                <th>Photo</th>
                <th 
                  className="sortable-header"
                  onClick={() => handleSort('name')}
                >
                  Name <i className={getSortIcon('name')}></i>
                </th>
                <th 
                  className="sortable-header"
                  onClick={() => handleSort('positionName')}
                >
                  Position <i className={getSortIcon('positionName')}></i>
                </th>
                <th 
                  className="sortable-header"
                  onClick={() => handleSort('departmentId')}
                >
                  Department <i className={getSortIcon('departmentId')}></i>
                </th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map(candidate => (
                <tr key={candidate.id}>
                  {isAdmin && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={(e) => handleSelectCandidate(candidate.id, e.target.checked)}
                      />
                    </td>
                  )}
                  <td>
                    <div className="candidate-photo-small">
                      <CandidateImage
                        photoUrl={candidate.photoUrl}
                        alt={candidate.name}
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px' }}
                        size="small"
                      />
                    </div>
                  </td>
                  <td>
                    <span 
                      className="candidate-name-link"
                      onClick={() => setViewCandidate(candidate)}
                    >
                      {candidate.name}
                    </span>
                  </td>
                  <td>{candidate.positionName}</td>
                  <td>{candidate.departmentId}</td>
                  <td>{candidate.courseId}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setViewCandidate(candidate)}
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleShowModal(candidate)}
                            disabled={hasActiveElection}
                            title="Edit Candidate"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(candidate.id)}
                            disabled={hasActiveElection}
                            title="Delete Candidate"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-5">
            <i className="fas fa-users fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">No candidates found</h5>
            <p className="text-muted">
              {searchTerm 
                ? 'Try adjusting your search criteria' 
                : 'Add your first candidate to get started'
              }
            </p>
          </div>
        )}
      </div>

      {/* Card View (Alternative Layout) */}
      <div className="candidates-card-view d-none">
        <div className="row">
          {Object.entries(candidatesByPosition).map(([positionName, positionCandidates]) => (
            <div key={positionName} className="col-12 mb-4">
              <h4 className="position-title">
                <i className="fas fa-certificate me-2"></i>
                {positionName} ({positionCandidates.length})
              </h4>
              <div className="row">
                {positionCandidates.map(candidate => (
                  <div key={candidate.id} className="col-md-6 col-lg-4 mb-3">
                    <CandidateCard
                      candidate={candidate}
                      onView={setViewCandidate}
                      onEdit={handleShowModal}
                      onDelete={handleDelete}
                      onSelect={handleSelectCandidate}
                      isSelected={selectedCandidates.includes(candidate.id)}
                      showSelection={true}
                      showActions={!hasActiveElection}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Candidate Modal */}
      <CandidateViewModal
        candidate={viewCandidate}
        show={!!viewCandidate}
        onClose={() => setViewCandidate(null)}
        onEdit={handleShowModal}
        showActions={!hasActiveElection}
      />

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
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <CandidateForm
                    formData={formData}
                    onChange={handleChange}
                    onPhotoChange={handlePhotoChange}
                    onRemovePhoto={handleRemovePhoto}
                    photoFile={photoFile}
                    positions={positions}
                    departments={departments}
                    courses={courses}
                    loadingCourses={loadingCourses}
                    photoPreview={photoPreview}
                    onDepartmentChange={fetchCourses}
                    isEditing={!!editingCandidate}
                  />
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

      {/* Enhanced Bulk Delete Modal */}
      <BulkDeleteModal
        show={showBulkDeleteModal}
        items={candidates.filter(candidate => selectedCandidates.includes(candidate.id))}
        itemType="candidate"
        onConfirm={confirmBulkDelete}
        onCancel={cancelBulkDelete}
        isDeleting={isBulkDeleting}
        getItemDisplayName={(candidate) => `${candidate.name} (${positions.find(p => p.id === candidate.positionId)?.name || 'Unknown Position'})`}
      />
    </div>
  );
};

export default Candidates;