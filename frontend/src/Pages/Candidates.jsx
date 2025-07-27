import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Card } from 'react-bootstrap';
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

  // User view: candidate cards with view more modal
  if (role === 'user') {
    // Check if user can view candidates (has active election)
    if (!canViewCandidates) {
      return <ElectionStatusMessage type="candidates" />;
    }

    return (
      <div className="candidates-user-view">
        <h1 className="candidates-page-title">Meet the Candidates</h1>
        <p className="candidates-page-subtitle">Learn about each candidate and their platforms</p>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="candidate-card-grid">
          {candidates.length > 0 ? (
            candidates.map(candidate => (
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
            ))
          ) : (
            <div className="no-candidates">
              <i className="fas fa-users fa-3x mb-3"></i>
              <h3>No Candidates Yet</h3>
              <p>Candidates will appear here once they are added to the system.</p>
            </div>
          )}
        </div>
        
        <Modal show={!!viewCandidate} onHide={() => setViewCandidate(null)} size="lg">
          <Modal.Header closeButton className="candidate-modal-header">
            <Modal.Title>
              <div className="modal-candidate-info">
                {viewCandidate?.photoUrl && (
                  <img src={viewCandidate.photoUrl} alt={viewCandidate.name} className="modal-candidate-photo" />
                )}
                <div>
                  <h4>{viewCandidate?.name}</h4>
                  <p className="modal-position">{viewCandidate?.positionName}</p>
                </div>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="candidate-modal-body">
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
          </Modal.Body>
          <Modal.Footer className="candidate-modal-footer">
            <Button variant="secondary" onClick={() => setViewCandidate(null)}>
              <i className="fas fa-times me-2"></i>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
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

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div></div>
        <div></div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
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
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleShowModal(candidate)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDelete(candidate.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No candidates found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCandidate ? 'Edit Candidate' : 'Add Candidate'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Position</Form.Label>
              <Form.Select
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
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Photo (profile picture)</Form.Label>
              <Form.Control
                type="file"
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
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description about the candidate"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingCandidate ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Candidates; 