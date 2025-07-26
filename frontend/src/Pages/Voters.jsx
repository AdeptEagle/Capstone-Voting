import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Card, Badge } from 'react-bootstrap';
import { getVoters, createVoter, updateVoter, deleteVoter } from '../services/api';

const Voters = () => {
  const [voters, setVoters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVoter, setEditingVoter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    hasVoted: false
  });

  useEffect(() => {
    fetchVoters();
  }, []);

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
        hasVoted: voter.hasVoted
      });
    } else {
      setEditingVoter(null);
      setFormData({
        name: '',
        email: '',
        studentId: '',
        hasVoted: false
      });
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
      hasVoted: false
    });
    setSuccess('');
    setError('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
            <p className="dashboard-subtitle-pro">Register and manage voter accounts.</p>
          </div>
          <div className="dashboard-header-actions">
            <button className="btn btn-custom-blue" onClick={() => handleShowModal()}>
              Add Voter
            </button>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div></div>
        <div></div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Student ID</th>
                <th>Voting Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {voters.length > 0 ? (
                voters.map((voter, index) => (
                  <tr key={voter.id}>
                    <td>{index + 1}</td>
                    <td>{voter.name}</td>
                    <td>{voter.email}</td>
                    <td>{voter.studentId}</td>
                    <td>
                      {voter.hasVoted ? (
                        <Badge bg="success">Voted</Badge>
                      ) : (
                        <Badge bg="warning" text="dark">Not Voted</Badge>
                      )}
                    </td>
                    <td>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleShowModal(voter)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDelete(voter.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No voters found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingVoter ? 'Edit Voter' : 'Add Voter'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {!editingVoter && (
              <Alert variant="info" className="mb-3">
                <strong>Note:</strong> Voters created without a password will have their Student ID as the default password.
              </Alert>
            )}
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
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
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Student ID</Form.Label>
              <Form.Control
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="hasVoted"
                checked={formData.hasVoted}
                onChange={handleChange}
                label="Has voted"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingVoter ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Voters; 