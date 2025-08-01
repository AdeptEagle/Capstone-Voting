import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { checkCurrentUser } from '../services/auth';
import { getElectionCountdown } from '../services/api';

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
  const [countdown, setCountdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchElectionData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all elections to check for ended ones
      const allElectionsResponse = await api.get('/elections');
      const electionsData = Array.isArray(allElectionsResponse.data) ? allElectionsResponse.data : [];
      setAllElections(electionsData);
      
      // Fetch current election (for admin monitoring, includes paused/stopped elections)
      try {
        const currentResponse = await api.get('/elections/current');
        console.log('Current election response:', currentResponse.data);
        const currentElection = currentResponse.data || null;
        setActiveElection(currentElection);
        
        // Fetch countdown data if there's an active election
        if (currentElection && currentElection.id && currentElection.endTime) {
          try {
            const countdownData = await getElectionCountdown(currentElection.id);
            setCountdown(countdownData);
          } catch (countdownError) {
            console.log('Error fetching countdown:', countdownError.message);
            setCountdown(null);
          }
        } else {
          setCountdown(null);
        }
      } catch (currentError) {
        // No current election found, which is fine
        console.log('No current election found:', currentError.message);
        setActiveElection(null);
        setCountdown(null);
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
    
    // Refresh election status every 30 seconds for more responsive updates
    const interval = setInterval(fetchElectionData, 30000);
    
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
    allElectionsStatuses: Array.isArray(allElections) ? allElections.map(e => e.status) : []
  });

  const value = {
    activeElection,
    allElections,
    countdown,
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
    // Admins can view candidates regardless of election status (for monitoring)
    canViewCandidates: isAdmin || (!!activeElection && activeElection.status === 'active'),
    // Timer/countdown related
    hasTimer: countdown !== null && !countdown?.expired,
    timeRemaining: countdown?.timeRemaining || null,
    isElectionExpired: countdown?.expired || false
  };

  return (
    <ElectionContext.Provider value={value}>
      {children}
    </ElectionContext.Provider>
  );
}; 