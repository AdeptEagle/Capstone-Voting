import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { getCandidates, createCandidate, updateCandidate, deleteCandidate, getPositions } from '../services/api';
import { checkCurrentUser } from '../services/auth';
import { useElection } from '../contexts/ElectionContext';
import ElectionStatusMessage from '../components/ElectionStatusMessage';
import './Candidates.css';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [positions, setPositions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    positionId: '',
    photoUrl: '',
    description: ''
  });
  const [viewCandidate, setViewCandidate] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

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
      const [candidatesData, positionsData] = await Promise.all([
        getCandidates(),
        getPositions()
      ]);
      console.log('Fetched candidates data:', candidatesData);
      console.log('Fetched positions data:', positionsData);
      setCandidates(candidatesData);
      setPositions(positionsData);
      setError('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (candidate = null) => {
    if (candidate) {
      setEditingCandidate(candidate);
      setFormData({
        name: candidate.name,
        positionId: candidate.positionId,
        photoUrl: candidate.photoUrl || '',
        description: candidate.description || ''
      });
      setPhotoPreview(candidate.photoUrl || '');
      setPhotoFile(null);
    } else {
      setEditingCandidate(null);
      setFormData({
        name: '',
        positionId: '',
        photoUrl: '',
        description: ''
      });
      setPhotoPreview('');
      setPhotoFile(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCandidate(null);
    setFormData({
      name: '',
      positionId: '',
      photoUrl: '',
      description: ''
    });
    setPhotoPreview('');
    setPhotoFile(null);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
    try {
      let dataToSend;
      if (photoFile) {
        dataToSend = new FormData();
        dataToSend.append('name', formData.name);
        dataToSend.append('positionId', formData.positionId);
        dataToSend.append('description', formData.description);
        dataToSend.append('photo', photoFile);
      } else {
        dataToSend = { ...formData };
        // If editing and no new photo selected, preserve the existing photo URL
        if (editingCandidate && !photoFile) {
          dataToSend.photoUrl = editingCandidate.photoUrl;
        }
      }
      if (editingCandidate) {
        await updateCandidate(editingCandidate.id, dataToSend, photoFile ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
      } else {
        await createCandidate(dataToSend, photoFile ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error('Error saving candidate:', error);
      setError('Failed to save candidate');
    }
  };

  const handleDelete = async (id) => {
    {
      try {
        await deleteCandidate(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting candidate:', error);
        setError('Failed to delete candidate');
      }
    }
  };

  // User view: candidate cards grouped by position
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
        <h1 className="candidates-page-title">Meet the Candidates</h1>
        <p className="candidates-page-subtitle">Learn about each candidate and their platforms</p>
        {error && <Alert variant="danger">{error}</Alert>}
        
        {candidates.length > 0 ? (
          Object.entries(candidatesByPosition).map(([position, positionCandidates]) => (
            <div key={position} className="position-section">
              <h2 className="position-title">{position}</h2>
              <div className="candidate-card-grid">
                {positionCandidates.map(candidate => (
                  <div className="candidate-card facebook-style" key={candidate.id}>
                    <div className="candidate-card-header">
                      {candidate.photoUrl ? (
                        <img src={candidate.photoUrl} alt={candidate.name} className="candidate-photo" />
                      ) : (
                        <div className="candidate-photo-placeholder">
                          <i className="fas fa-user"></i>
                        </div>
                      )}
                      <div className="candidate-info">
                        <h3 className="candidate-name">{candidate.name}</h3>
                        <p className="candidate-position">{candidate.positionName}</p>
                      </div>
                    </div>
                    <div className="candidate-card-body">
                      <p className="candidate-brief">
                        {candidate.description ? 
                          candidate.description.substring(0, 100) + (candidate.description.length > 100 ? '...' : '') :
                          'Learn more about this candidate and their vision for the position.'
                        }
                      </p>
                    </div>
                    <div className="candidate-card-footer">
                      <Button 
                        variant="primary" 
                        className="view-more-btn"
                        onClick={() => setViewCandidate(candidate)}
                      >
                        <i className="fas fa-eye me-2"></i>
                        View Platform
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="no-candidates">
            <i className="fas fa-users fa-3x mb-3"></i>
            <h3>No Candidates Yet</h3>
            <p>Candidates will appear here once they are added to the system.</p>
          </div>
        )}
        
        {/* View Candidate Modal */}
        {viewCandidate && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="modal-candidate-info">
                    {viewCandidate?.photoUrl && (
                      <img src={viewCandidate.photoUrl} alt={viewCandidate.name} className="modal-candidate-photo" />
                    )}
                    <div>
                      <h4>{viewCandidate?.name}</h4>
                      <p className="modal-position">{viewCandidate?.positionName}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setViewCandidate(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="candidate-platform">
                    <h5><i className="fas fa-bullhorn me-2"></i>Platform & Vision</h5>
                    <div className="platform-content">
                      {viewCandidate?.description ? (
                        <p>{viewCandidate.description}</p>
                      ) : (
                        <div className="no-platform">
                          <i className="fas fa-info-circle"></i>
                          <p>No platform information available yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="candidate-details">
                    <div className="detail-item">
                      <i className="fas fa-id-card"></i>
                      <span><strong>Position:</strong> {viewCandidate?.positionName}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-user"></i>
                      <span><strong>Candidate:</strong> {viewCandidate?.name}</span>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setViewCandidate(null)}>
                    <i className="fas fa-times me-2"></i>
                    Close
                  </button>
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
    <div className="candidates-container">
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

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-header-custom">
                <tr>
                  <th>#</th>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.length > 0 ? (
                  candidates.map((candidate, index) => (
                    <tr key={candidate.id}>
                      <td>{index + 1}</td>
                      <td>
                        {candidate.photoUrl ? (
                          <img 
                            src={candidate.photoUrl} 
                            alt={candidate.name}
                            className="candidate-table-photo"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        {!candidate.photoUrl && (
                          <div className="candidate-table-photo-placeholder">
                            <i className="fas fa-user"></i>
                          </div>
                        )}
                      </td>
                      <td>{candidate.name}</td>
                      <td>{candidate.positionName}</td>
                      <td>{candidate.description || '-'}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleShowModal(candidate)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger me-2"
                          onClick={() => handleDelete(candidate.id)}
                        >
                          Delete
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-info"
                          onClick={() => setViewCandidate(candidate)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No candidates found</td>
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