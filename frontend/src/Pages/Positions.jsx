import React, { useState, useEffect } from 'react';
import { getPositions, createPosition, updatePosition, deletePosition } from '../services/api';

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [formData, setFormData] = useState({ id: '', name: '', voteLimit: 1 });

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const data = await getPositions();
      setPositions(data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPosition) {
        await updatePosition(editingPosition.id, {
          name: formData.name,
          voteLimit: Number(formData.voteLimit)
        });
      } else {
        await createPosition({
          id: formData.id,
          name: formData.name,
          voteLimit: Number(formData.voteLimit)
        });
      }
      setShowModal(false);
      setEditingPosition(null);
      setFormData({ id: '', name: '', voteLimit: 1 });
      fetchPositions();
    } catch (error) {
      console.error('Error saving position:', error);
    }
  };

  const handleEdit = (position) => {
    setEditingPosition(position);
    setFormData({ id: position.id, name: position.name, voteLimit: position.voteLimit });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this position?')) {
      try {
        await deletePosition(id);
        fetchPositions();
      } catch (error) {
        console.error('Error deleting position:', error);
      }
    }
  };

  const openModal = () => {
    setEditingPosition(null);
    setFormData({ id: '', name: '', voteLimit: 1 });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="positions-container">
      {/* Unified Professional Header */}
      <div className="dashboard-header-pro">
        <div className="dashboard-header-row">
          <div>
            <h1 className="dashboard-title-pro">Manage Positions</h1>
            <p className="dashboard-subtitle-pro">Create and manage election positions.</p>
          </div>
          <div className="dashboard-header-actions">
            <button className="btn btn-custom-blue" onClick={openModal}>
              Add Position
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-header-custom">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Vote Limit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => (
                  <tr key={position.id}>
                    <td>{position.id}</td>
                    <td>{position.name}</td>
                    <td>{position.voteLimit}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(position)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(position.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
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
                  {editingPosition ? 'Edit Position' : 'Add New Position'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {!editingPosition && (
                    <div className="mb-3">
                      <label className="form-label">ID</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.id}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        required
                        placeholder="e.g. PRES, VP, SEC"
                      />
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Vote Limit</label>
                    <input
                      type="number"
                      className="form-control"
                      min={1}
                      value={formData.voteLimit}
                      onChange={(e) => setFormData({ ...formData, voteLimit: e.target.value })}
                      required
                    />
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
                  <button type="submit" className="btn btn-custom-blue">
                    {editingPosition ? 'Update' : 'Create'}
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

export default Positions; 