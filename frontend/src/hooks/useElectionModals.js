import { useState } from 'react';

export const useElectionModals = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingElection, setDeletingElection] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [editingElection, setEditingElection] = useState(null);

  const openCreateModal = (resetForm) => {
    resetForm();
    setShowCreateModal(true);
  };

  const closeCreateModal = (resetForm) => {
    setShowCreateModal(false);
    resetForm();
  };

  const openEditModal = (election) => {
    setEditingElection(election);
    setShowEditModal(true);
  };

  const closeEditModal = (resetForm) => {
    setShowEditModal(false);
    setEditingElection(null);
    resetForm();
  };

  const openDeleteModal = (election) => {
    setDeletingElection(election);
    setDeleteConfirmation('');
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingElection(null);
    setDeleteConfirmation('');
  };

  const confirmDelete = (onConfirm) => {
    if (!deletingElection || deleteConfirmation.toLowerCase() !== 'delete') {
      return false;
    }
    onConfirm();
    return true;
  };

  return {
    // State
    showCreateModal,
    showEditModal,
    showDeleteModal,
    deletingElection,
    deleteConfirmation,
    editingElection,
    
    // Setters
    setDeleteConfirmation,
    
    // Actions
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete
  };
};