import React, { useState, useEffect } from 'react';
import { getCandidates } from '../../services/api';
import CandidateCard from '../../components/Candidates/CandidateCard';
import CandidateViewModal from '../../components/Candidates/CandidateViewModal';
import './UserCandidates.css';

const UserCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await getCandidates();
        console.log('UserCandidates - Received data:', data);
        console.log('UserCandidates - First candidate photoUrl:', data[0]?.photoUrl);
        setCandidates(data);
        setLoading(false);
      } catch (err) {
        console.error('UserCandidates - Error:', err);
        setError('Failed to load candidates');
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const handleViewPlatform = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleCloseModal = () => {
    setSelectedCandidate(null);
  };

  if (loading) return <div className="loading">Loading candidates...</div>;
  if (error) return <div className="error">{error}</div>;

  console.log('UserCandidates - Rendering candidates:', candidates.length);

  return (
    <div className="user-candidates-container">
      <h2>Current Candidates</h2>
      <div className="candidates-grid">
        {candidates.map((candidate, index) => {
          console.log(`UserCandidates - Candidate ${index}:`, candidate.name, 'photoUrl:', candidate.photoUrl);
          return (
            <CandidateCard
              key={candidate.id}
              candidate={{ ...candidate, number: index + 1 }}
              onView={handleViewPlatform}
            />
          );
        })}
      </div>

      {selectedCandidate && (
        <CandidateViewModal
          candidate={selectedCandidate}
          onClose={handleCloseModal}
          showActions={false}
        />
      )}
    </div>
  );
};

export default UserCandidates;