import { useState, useCallback } from 'react';

/**
 * Custom hook for persistent sorting that maintains sort order across operations
 * @param {string} storageKey - Key for localStorage persistence
 * @param {object} defaultSort - Default sort configuration { key: null, direction: 'asc' }
 * @returns {object} - Sort state and handlers
 */
export const usePersistentSort = (storageKey, defaultSort = { key: null, direction: 'asc' }) => {
  // Initialize sort config from localStorage or default
  const getInitialSort = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : defaultSort;
    } catch (error) {
      console.warn('Failed to parse stored sort config:', error);
      return defaultSort;
    }
  };

  const [sortConfig, setSortConfig] = useState(getInitialSort);

  // Save sort config to localStorage whenever it changes
  const updateSortConfig = useCallback((newConfig) => {
    setSortConfig(newConfig);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newConfig));
    } catch (error) {
      console.warn('Failed to save sort config to localStorage:', error);
    }
  }, [storageKey]);

  // Handle sort column click
  const handleSort = useCallback((key) => {
    let direction = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    const newConfig = { key, direction };
    updateSortConfig(newConfig);
  }, [sortConfig, updateSortConfig]);

  // Get sort icon class for table headers
  const getSortIcon = useCallback((key) => {
    if (sortConfig.key !== key) {
      return 'fas fa-sort text-muted';
    }
    
    return sortConfig.direction === 'asc' 
      ? 'fas fa-sort-up text-primary'
      : 'fas fa-sort-down text-primary';
  }, [sortConfig]);

  // Apply sorting to data array
  const applySorting = useCallback((data) => {
    if (!sortConfig.key || !data) return data;

    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;

      // Convert to strings for comparison if needed
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      let comparison = 0;
      if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [sortConfig]);

  // Reset sort to default
  const resetSort = useCallback(() => {
    updateSortConfig(defaultSort);
  }, [defaultSort, updateSortConfig]);

  // Clear stored sort config
  const clearStoredSort = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setSortConfig(defaultSort);
    } catch (error) {
      console.warn('Failed to clear stored sort config:', error);
    }
  }, [storageKey, defaultSort]);

  return {
    sortConfig,
    handleSort,
    getSortIcon,
    applySorting,
    resetSort,
    clearStoredSort,
    updateSortConfig
  };
};