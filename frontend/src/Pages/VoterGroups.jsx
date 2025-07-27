import React, { useState, useEffect } from 'react';
import { 
  getVoterGroups, 
  createVoterGroup, 
  updateVoterGroup, 
  deleteVoterGroup,
  getVoterGroupMembers,
  addMemberToGroup,
  removeMemberFromGroup,
  getVoters,
  getAvailableVoters
} from '../services/api.js';
import './VoterGroups.css';

const VoterGroups = () => {
  const [voterGroups, setVoterGroups] = useState([]);
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [availableVoters, setAvailableVoters] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'custom'
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [groupsData, votersData] = await Promise.all([
        getVoterGroups(),
        getVoters()
      ]);
      setVoterGroups(groupsData);
      setVoters(votersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingGroup) {
        await updateVoterGroup(editingGroup.id, formData);
      } else {
        await createVoterGroup(formData);
      }
      setMessage(editingGroup ? 'Voter group updated successfully!' : 'Voter group created successfully!');
      setShowModal(false);
      setEditingGroup(null);
      setFormData({ name: '', description: '', type: 'custom' });
      await fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving voter group:', error);
      setMessage('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
      type: group.type
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this voter group?')) {
      try {
        await deleteVoterGroup(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting voter group:', error);
      }
    }
  };

  const openModal = () => {
    setEditingGroup(null);
    setFormData({ name: '', description: '', type: 'custom' });
    setShowModal(true);
  };

  const handleViewMembers = async (group) => {
    console.log('handleViewMembers called with group:', group);
    try {
      console.log('Fetching members for group:', group.id);
      const members = await getVoterGroupMembers(group.id);
      console.log('Members fetched:', members);
      setGroupMembers(members);
      setSelectedGroup(group);
      
      console.log('Fetching available voters...');
      const available = await getAvailableVoters();
      console.log('Available voters:', available);
      setAvailableVoters(available);
      
      console.log('Setting showMembersModal to true');
      setShowMembersModal(true);
    } catch (error) {
      console.error('Error fetching group members:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleAddMember = async (voterId) => {
    try {
      await addMemberToGroup(selectedGroup.id, voterId);
      handleViewMembers(selectedGroup); // Refresh members
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (voterId) => {
    try {
      await removeMemberFromGroup(selectedGroup.id, voterId);
      handleViewMembers(selectedGroup); // Refresh members
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      department: 'primary',
      class: 'success',
      year: 'warning',
      custom: 'secondary'
    };
    return colors[type] || 'secondary';
  };

  if (loading) {
    return <div className="loading">Loading voter groups...</div>;
  }

  return (
    <div className="voter-groups-container">
      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}
      <div className="voter-groups-header">
        <h2>Voter Groups Management</h2>
        <button className="btn btn-primary" onClick={openModal}>
          <i className="fas fa-plus me-2"></i>
          Create New Group
        </button>
      </div>


      <div className="voter-groups-grid">
        {voterGroups.map(group => (
          <div key={group.id} className="voter-group-card">
            <div className="voter-group-header">
              <span className={`badge bg-${getTypeColor(group.type)}`}>
                {group.type}
              </span>
              <div className="voter-group-actions">
                <button 
                  className="btn btn-sm btn-outline-info"
                  onClick={() => handleViewMembers(group)}
                  title="View Members"
                >
                  <i className="fas fa-users"></i>
                </button>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleEdit(group)}
                  title="Edit"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(group.id)}
                  title="Delete"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <h4 className="voter-group-name">{group.name}</h4>
            {group.description && (
              <p className="voter-group-description">{group.description}</p>
            )}
            <div className="voter-group-meta">
              <span className="member-count">
                <i className="fas fa-users me-1"></i>
                {group.memberCount || 0} members
              </span>
              <span className="created-by">
                Created by: {group.createdByUsername}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingGroup ? 'Edit Voter Group' : 'Create New Voter Group'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows="3"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Type *</label>
                    <select
                      className="form-control"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      required
                    >
                      <option value="department">Department</option>
                      <option value="class">Class</option>
                      <option value="year">Year</option>
                      <option value="custom">Custom</option>
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
                    {editingGroup ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Members Modal */}
      {showMembersModal && selectedGroup && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Manage Members - {selectedGroup.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowMembersModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="members-container">
                  <div className="members-section">
                    <h4>Current Members ({groupMembers.length})</h4>
                    <div className="members-list">
                      {groupMembers.map(member => (
                        <div key={member.id} className="member-item">
                          <span>{member.name} ({member.studentId})</span>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                      {groupMembers.length === 0 && (
                        <p className="no-members">No members in this group</p>
                      )}
                    </div>
                  </div>
                  <div className="members-section">
                    <h4>Available Voters ({availableVoters.length})</h4>
                    <div className="members-list">
                      {availableVoters.map(voter => (
                        <div key={voter.id} className="member-item">
                          <span>{voter.name} ({voter.studentId})</span>
                          <button 
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleAddMember(voter.id)}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      ))}
                      {availableVoters.length === 0 && (
                        <p className="no-members">All voters are already in this group</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowMembersModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoterGroups; 