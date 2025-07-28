import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '../../services/api';
import { checkCurrentUser, isSuperAdmin } from '../../services/auth';
import './ManageAdmins.css';

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({ id: '', username: '', email: '', password: '', role: 'admin' });
  const [error, setError] = useState('');
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is superadmin
    const currentUser = checkCurrentUser();
    if (!currentUser.isAuthenticated) {
      setAuthError('Please log in to access this page');
      setLoading(false);
      return;
    }
    
    if (!isSuperAdmin()) {
      setAuthError('Access denied. Superadmin privileges required.');
      setLoading(false);
      return;
    }
    
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const admins = await getAdmins();
      console.log('Fetched admins:', admins);
      setAdmins(admins);
      setError('');
    } catch (error) {
      console.error('Error fetching admins:', error);
      setError('Failed to load admin accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAdmin) {
        await updateAdmin(editingAdmin.id, formData);
      } else {
        await createAdmin(formData);
      }
      setShowModal(false);
      setEditingAdmin(null);
      setFormData({ id: '', username: '', password: '', role: 'admin' });
      fetchAdmins();
    } catch (error) {
      console.error('Error saving admin:', error);
      setError('Failed to save admin account');
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({ id: admin.id, username: admin.username, email: admin.email || '', password: '', role: admin.role });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin account?')) {
      try {
        await deleteAdmin(id);
        fetchAdmins();
      } catch (error) {
        console.error('Error deleting admin:', error);
        setError('Failed to delete admin account');
      }
    }
  };

  const openModal = () => {
    setEditingAdmin(null);
    setFormData({ id: '', username: '', email: '', password: '', role: 'admin' });
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

  if (authError) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="text-center">
          <div className="alert alert-danger">
            <h4>Access Denied</h4>
            <p>{authError}</p>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-admins-container">
      {/* Unified Professional Header */}
      <div className="dashboard-header-pro">
        <div className="dashboard-header-row">
          <div>
            <h1 className="dashboard-title-pro">Manage Admin Accounts</h1>
            <p className="dashboard-subtitle-pro">Create, update, and remove admin users.</p>
          </div>
          <div className="dashboard-header-actions">
            <button className="btn btn-custom-blue" onClick={openModal}>
              Add Admin
            </button>
            <button 
              className="btn btn-outline-secondary ms-2" 
              onClick={fetchAdmins}
              disabled={loading}
            >
              <i className="fas fa-sync-alt me-1"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>



      {error && <div className="alert alert-danger">{error}</div>}

      {/* Debug: Show loading state and data */}
      {loading && (
        <div className="alert alert-info">
          <i className="fas fa-spinner fa-spin me-2"></i>
          Loading admin data...
        </div>
      )}

      {!loading && admins.length === 0 && (
        <div className="alert alert-warning">
          <i className="fas fa-exclamation-triangle me-2"></i>
          No admin accounts found. You can create the first admin account below.
        </div>
      )}

      {/* Show current user info */}
      <div className="alert alert-info">
        <strong>Current User:</strong> {checkCurrentUser().user?.username || 'Unknown'} 
        <span className="badge bg-primary ms-2">{checkCurrentUser().role || 'No role'}</span>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-header-custom">
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <td>{admin.id}</td>
                    <td>{admin.username}</td>
                    <td>{admin.email || 'N/A'}</td>
                    <td>
                      <span className={`badge ${admin.role === 'superadmin' ? 'bg-danger' : 'bg-primary'}`}>
                        {admin.role}
                      </span>
                    </td>
                    <td>{new Date(admin.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(admin)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(admin.id)}
                        disabled={admin.role === 'superadmin'}
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
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {!editingAdmin && (
                    <div className="mb-3">
                      <label className="form-label">ID</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.id}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        required
                        placeholder="e.g. admin-001"
                      />
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="admin@votingsystem.com"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingAdmin}
                      placeholder={editingAdmin ? "Leave blank to keep current password" : ""}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                    >
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
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
                  <button type="submit" className="btn btn-primary">
                    {editingAdmin ? 'Update' : 'Create'}
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

export default ManageAdmins; 