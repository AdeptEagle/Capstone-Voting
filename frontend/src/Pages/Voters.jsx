import React, { useState, useEffect } from 'react';
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
    {
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



      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-header-custom">
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
                    <td colSpan="6" className="text-center">No voters found</td>
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
          <div className="modal-dialog">
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