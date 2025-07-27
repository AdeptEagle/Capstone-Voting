import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { checkCurrentUser } from '../services/auth';

const ElectionContext = createContext();

export const useElection = () => {
  const context = useContext(ElectionContext);
  if (!context) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
};

export const ElectionProvider = ({ children }) => {
  const [activeElection, setActiveElection] = useState(null);
  const [allElections, setAllElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchElectionData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all elections to check for ended ones
      const allElectionsResponse = await api.get('/api/elections');
      setAllElections(allElectionsResponse.data || []);
      
      // Fetch active election
      try {
        const activeResponse = await api.get('/api/elections/active');
        console.log('Active election response:', activeResponse.data);
        setActiveElection(activeResponse.data);
      } catch (activeError) {
        // No active election found, which is fine
        console.log('No active election found:', activeError.message);
        setActiveElection(null);
      }
    } catch (error) {
      console.error('Error fetching election data:', error);
      setError('Failed to fetch election status');
    } finally {
      setLoading(false);
    }
  };

  const refreshElection = () => {
    fetchElectionData();
  };

  const triggerImmediateRefresh = () => {
    fetchElectionData();
  };

  useEffect(() => {
    fetchElectionData();
    
    // Refresh election status every 10 seconds for more responsive updates
    const interval = setInterval(fetchElectionData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Get user role for permission checks
      const userRole = checkCurrentUser().role;
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';

  // Debug logging for canViewResults logic
  console.log('ElectionContext debug:', {
    userRole,
    isAdmin,
    activeElection: !!activeElection,
    activeElectionStatus: activeElection?.status,
    hasAnyElection: allElections.length > 0,
    allElectionsStatuses: allElections.map(e => e.status)
  });

  const value = {
    activeElection,
    allElections,
    loading,
    error,
    refreshElection,
    triggerImmediateRefresh,
    hasActiveElection: !!activeElection,
    hasAnyElection: allElections.length > 0,
    hasEndedElection: allElections.some(election => election.status === 'ended'),
    canVote: !!activeElection && activeElection.status === 'active',
    // Admins can always view results, regular users need active/ended election
    canViewResults: isAdmin || (!!activeElection && (activeElection.status === 'active' || activeElection.status === 'ended')),
    canViewCandidates: !!activeElection && activeElection.status === 'active'
  };

  return (
    <ElectionContext.Provider value={value}>
      {children}
    </ElectionContext.Provider>
  );
}; 