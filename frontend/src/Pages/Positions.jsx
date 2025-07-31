import React, { useState, useEffect } from 'react';
import { getPositions, createPosition, updatePosition, deletePosition, deleteMultiplePositions } from '../services/api';
import PositionDeleteModal from '../components/Positions/PositionDeleteModal';
import PositionFormModal from '../components/Positions/PositionFormModal';
import PositionAlerts from '../components/Positions/PositionAlerts';

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [deletingPosition, setDeletingPosition] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [formData, setFormData] = useState({ id: '', name: '', voteLimit: 1, displayOrder: 0 });
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPositions();
  }, []);

  useEffect(() => {
    filterAndSortPositions();
  }, [positions, searchTerm, sortConfig]);

  useEffect(() => {
    // Update selectAll state when filtered data or selection changes
    if (filteredPositions.length === 0) {
      setSelectAll(false);
    } else {
      const allFilteredSelected = filteredPositions.every(position => selectedPositions.includes(position.id));
      setSelectAll(allFilteredSelected && selectedPositions.length > 0);
    }
  }, [filteredPositions, selectedPositions]);

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const filterAndSortPositions = () => {
    let filtered = positions;

    // Apply search filter
    if (searchTerm) {
      filtered = positions.filter(position =>
        position.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredPositions(filtered);
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

  const fetchPositions = async () => {
    try {
      const data = await getPositions();
      setPositions(data);
    } catch (error) {
      console.error('Error fetching positions:', error);
      setError('Failed to load positions. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      if (editingPosition) {
        await updatePosition(editingPosition.id, {
          name: formData.name,
          voteLimit: Number(formData.voteLimit),
          displayOrder: Number(formData.displayOrder)
        });
        setSuccess(`Position "${formData.name}" updated successfully!`);
      } else {
        await createPosition({
          id: formData.id,
          name: formData.name,
          voteLimit: Number(formData.voteLimit),
          displayOrder: Number(formData.displayOrder)
        });
        setSuccess(`Position "${formData.name}" created successfully!`);
      }
      
      setShowModal(false);
      setEditingPosition(null);
      setFormData({ id: '', name: '', voteLimit: 1, displayOrder: 0 });
      await fetchPositions();
    } catch (error) {
      console.error('Error saving position:', error);
      setError(
        error.response?.data?.error || 
        error.message || 
        `Failed to ${editingPosition ? 'update' : 'create'} position. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (position) => {
    setEditingPosition(position);
    setFormData({ 
      id: position.id, 
      name: position.name, 
      voteLimit: position.voteLimit,
      displayOrder: position.displayOrder || 0
    });
    setShowModal(true);
  };

  const handleDelete = (position) => {
    setDeletingPosition(position);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPosition) return;
    
    setIsDeleting(true);
    setError('');
    
    try {
      if (Array.isArray(deletingPosition)) {
        await deleteMultiplePositions(deletingPosition);
        setSuccess(`${deletingPosition.length} position(s) deleted successfully!`);
        setSelectedPositions([]);
        setSelectAll(false);
      } else {
        await deletePosition(deletingPosition.id);
        setSuccess(`Position "${deletingPosition.name}" deleted successfully!`);
      }
      
      setShowDeleteModal(false);
      setDeletingPosition(null);
      await fetchPositions();
    } catch (error) {
      console.error('Error deleting position:', error);
      setError(
        error.response?.data?.error || 
        error.message || 
        'Failed to delete position(s). Please try again.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingPosition(null);
  };

  const handleMultipleDelete = () => {
    if (selectedPositions.length === 0) {
      setError('Please select positions to delete');
      return;
    }
    
    setDeletingPosition(selectedPositions);
    setShowDeleteModal(true);
  };

  const handleSelectPosition = (id) => {
    setSelectedPositions(prev => 
      prev.includes(id) 
        ? prev.filter(posId => posId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPositions([]);
      setSelectAll(false);
    } else {
      setSelectedPositions(filteredPositions.map(pos => pos.id));
      setSelectAll(true);
    }
  };

  const openModal = () => {
    setEditingPosition(null);
    setFormData({ id: '', name: '', voteLimit: 1, displayOrder: 0 });
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
            <button className="btn btn-custom-blue" onClick={() => {
              setFormData({ id: '', name: '', voteLimit: 1, displayOrder: 0 });
              setEditingPosition(null);
              setShowModal(true);
            }}>
              Add Position
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      <PositionAlerts
        success={success}
        error={error}
        onClearSuccess={() => setSuccess('')}
        onClearError={() => setError('')}
      />

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
                  placeholder="Search positions by name or ID..."
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
                Showing {filteredPositions.length} of {positions.length} positions
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {selectedPositions.length > 0 && (
            <div className="mb-3 p-3 bg-warning bg-opacity-10 border border-warning rounded">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-warning">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {selectedPositions.length} position(s) selected
                </span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleMultipleDelete}
                >
                  <i className="fas fa-trash me-1"></i>
                  Delete Selected ({selectedPositions.length})
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
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('id')}
                    className="sortable-header"
                  >
                    ID {getSortIcon('id')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('name')}
                    className="sortable-header"
                  >
                    Name {getSortIcon('name')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('voteLimit')}
                    className="sortable-header"
                  >
                    Vote Limit {getSortIcon('voteLimit')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('displayOrder')}
                    className="sortable-header"
                  >
                    Display Order {getSortIcon('displayOrder')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPositions.map((position) => (
                  <tr key={position.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedPositions.includes(position.id)}
                        onChange={() => handleSelectPosition(position.id)}
                      />
                    </td>
                    <td>{position.id}</td>
                    <td>{position.name}</td>
                    <td>{position.voteLimit}</td>
                    <td>{position.displayOrder || 0}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(position)}
                        title="Edit Position"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(position)}
                        title="Delete Position"
                      >
                        <i className="fas fa-trash"></i>
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
      {/* Enhanced Position Form Modal */}
      <PositionFormModal
        show={showModal}
        editingPosition={editingPosition}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => {
          setShowModal(false);
          setEditingPosition(null);
          setFormData({ id: '', name: '', voteLimit: 1, displayOrder: 0 });
          setError('');
        }}
        isLoading={isSubmitting}
        error={error}
        existingPositions={positions}
      />

      {/* Enhanced Delete Confirmation Modal */}
      <PositionDeleteModal
        show={showDeleteModal}
        position={deletingPosition}
        positions={positions}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Positions; 