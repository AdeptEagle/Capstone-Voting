import React, { useState, useEffect, useMemo } from 'react';
import { getResults, getPositions, getCandidates, getVoters, getElectionPositions } from '../services/api';
import { checkCurrentUser } from '../services/auth';
import { useElection } from '../contexts/ElectionContext';
import ElectionStatusMessage from '../components/ElectionStatusMessage';
import './Results.css';

// --- Helper Functions ---
const formatTime = (timeInSeconds) => {
  if (timeInSeconds < 0) return '00:00:00';
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return [hours, minutes, seconds].map(v => v.toString().padStart(2, '0')).join(':');
};

// Print function for admin users
const printResults = (electionStats, positions, candidates, resultsData) => {
  try {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('Please allow pop-ups for this site to print results.');
      return;
    }
    
    const { totalVotes, voterTurnout, candidatePerformance } = electionStats;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Election Results Report</title>
        <style>
          body { 
            margin: 0; 
            padding: 20px; 
            font-family: Arial, sans-serif; 
            background: white;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #333; 
            padding-bottom: 20px; 
          }
          .header h1 { 
            color: #2c3e50; 
            margin: 0; 
            font-size: 28px; 
          }
          .header p { 
            color: #7f8c8d; 
            margin: 5px 0; 
            font-size: 14px; 
          }
          .stats { 
            display: flex; 
            justify-content: space-around; 
            margin: 20px 0; 
            padding: 15px; 
            background: #f8f9fa; 
            border-radius: 8px; 
          }
          .stat-item { 
            text-align: center; 
          }
          .stat-value { 
            font-size: 24px; 
            font-weight: bold; 
            color: #2c3e50; 
          }
          .stat-label { 
            font-size: 12px; 
            color: #7f8c8d; 
            margin-top: 5px; 
          }
          .position-section { 
            margin: 30px 0; 
            page-break-inside: avoid; 
          }
          .position-title { 
            font-size: 20px; 
            font-weight: bold; 
            color: #2c3e50; 
            margin-bottom: 15px; 
            border-bottom: 1px solid #ddd; 
            padding-bottom: 10px; 
          }
          .candidate-row { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 10px 0; 
            border-bottom: 1px solid #eee; 
          }
          .candidate-info { 
            flex: 1; 
          }
          .candidate-name { 
            font-weight: bold; 
            color: #2c3e50; 
          }
          .vote-count { 
            font-weight: bold; 
            color: #27ae60; 
            font-size: 18px; 
          }
          .rank { 
            background: #3498db; 
            color: white; 
            padding: 2px 8px; 
            border-radius: 12px; 
            font-size: 12px; 
            margin-right: 10px; 
          }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            font-size: 12px; 
            color: #7f8c8d; 
            border-top: 1px solid #ddd; 
            padding-top: 20px; 
          }
          @media print {
            body { margin: 0; padding: 20px; }
            @page { margin: 1in; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Election Results Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>Official Results - For Administrative Use</p>
        </div>
        
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">${totalVotes}</div>
            <div class="stat-label">Total Votes Cast</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${voterTurnout}%</div>
            <div class="stat-label">Voter Turnout</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${positions.length}</div>
            <div class="stat-label">Positions</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${candidates.length}</div>
            <div class="stat-label">Candidates</div>
          </div>
        </div>
        
        ${positions.map(position => {
          const positionCandidates = candidatePerformance.filter(c => c.position === position.name);
          return `
            <div class="position-section">
              <div class="position-title">${position.name}</div>
              ${positionCandidates.map(candidate => `
                <div class="candidate-row">
                  <div class="candidate-info">
                    <span class="rank">#${candidate.rank}</span>
                    <span class="candidate-name">${candidate.name}</span>
                  </div>
                  <div class="vote-count">${candidate.voteCount} votes</div>
                </div>
              `).join('')}
            </div>
          `;
        }).join('')}
        
        <div class="footer">
          <p>This is an official election results report. Please keep for your records.</p>
          <p>Report generated by Voting System - ${new Date().toLocaleDateString()}</p>
        </div>
        
        <script>
          // Wait for content to load, then print
          window.onload = function() {
            setTimeout(function() {
              window.print();
              // Close window after printing (with delay to allow print dialog)
              setTimeout(function() {
                window.close();
              }, 1000);
            }, 500);
          };
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
  } catch (error) {
    console.error('Print error:', error);
    alert('Error generating print report. Please try again.');
  }
};

// --- Child Components ---
const SummaryCard = ({ icon, title, value, tooltipText }) => {
  const cardContent = (
    <div className="summary-card">
      <div className="d-flex align-items-center h-100">
        <div className="stat-icon me-3">{icon}</div>
        <div>
          <div className="small text-muted fw-semibold">{title}</div>
          <h5 className="fw-bold mb-0 text-primary">{value}</h5>
        </div>
      </div>
    </div>
  );

  if (tooltipText) {
    return (
      <div title={tooltipText}>
        {cardContent}
      </div>
    );
  }
  return cardContent;
};

const VotesPerPositionChart = ({ data }) => {
  const maxVotes = useMemo(() => Math.max(...data.map(c => c.voteCount), 0), [data]);
  const chartMax = Math.ceil(maxVotes / 50) * 50 || 50;
  const axisLabels = Array.from({ length: chartMax / 50 + 1 }, (_, i) => i * 50);

  return (
    <div className="chart-card">
      <h5 className="fw-bold m-0 border-bottom pb-3 mb-3 text-primary">
        Candidates Performance by Position
      </h5>
      {data.length === 0 ? (
        <div className="alert alert-info mt-3 text-center small">No candidates found.</div>
      ) : (
        <div className="pt-2">
          {data.map((candidate) => (
            <div key={candidate.id} className="d-flex align-items-center mb-3">
              <div className="text-end me-3" style={{ width: '180px' }}>
                {/* Removed candidate-rank */}
                <p className="mb-0 text-muted small fw-semibold">{candidate.name}</p>
                <small className="text-muted">{candidate.position}</small>
              </div>
              <div className="flex-grow-1">
                <div className="progress-bar-custom">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(candidate.voteCount / chartMax) * 100}%` }}
                  >
                    {candidate.voteCount} votes
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="border-top pt-2 d-flex justify-content-between">
            {axisLabels.map(label => (
              <span key={label} className="text-muted small">{label}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TopCandidatesList = ({ data }) => (
  <div className="chart-card">
    <h5 className="fw-bold mb-3 text-primary">Top Candidates</h5>
    {data.length === 0 ? (
      <div className="alert alert-info text-center small">No votes have been cast yet.</div>
    ) : (
      data.map((candidate) => (
        <div key={candidate.id} className="d-flex justify-content-between align-items-center mb-2 p-3 rounded top-candidate-item">
          <div className="d-flex align-items-center">
            <div className="me-3 fs-5 text-primary">•</div>
            <div>
              <div className="fw-bold small text-dark">{candidate.name}</div>
              <small className="text-muted">{candidate.position}</small>
            </div>
          </div>
          <strong className="fs-6 text-primary">{candidate.voteCount}</strong>
        </div>
      ))
    )}
  </div>
);



const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

// --- Main Content: Candidates by Position ---
const CandidatesByPosition = ({ positions, candidates, resultsData, electionPositions }) => {
  // Group candidates by position for the current election
  const candidatesByPosition = useMemo(() => {
    const electionPositionIds = electionPositions.map(ep => ep.id); // Changed from ep.positionId to ep.id
    const electionPositionsList = positions.filter(pos => electionPositionIds.includes(pos.id));
    
    return electionPositionsList.map(pos => {
      const candidatesForPos = candidates
        .filter(c => c.positionId === pos.id)
        .map(candidate => {
          const result = resultsData.find(r => r.candidateId === candidate.id && r.positionId === pos.id);
          return {
            ...candidate,
            voteCount: result ? result.voteCount : 0
          };
        })
        .sort((a, b) => b.voteCount - a.voteCount);
      return { position: pos, candidates: candidatesForPos };
    });
  }, [positions, candidates, resultsData, electionPositions]);

  return (
    <div className="candidates-by-position">
      {candidatesByPosition.map(({ position, candidates }) => {
        // Auto-adjust chart max based on number of candidates and their votes
        const maxVotes = Math.max(...candidates.map(c => c.voteCount), 0);
        const chartMax = Math.max(maxVotes, candidates.length); // At least show 1 vote per candidate
        
        return (
          <div key={position.id} className="position-card mb-3">
            <h5 className="fw-bold mb-2 text-primary">{position.name}</h5>
            {candidates.length === 0 ? (
              <div className="alert alert-info text-center small">No candidates for this position.</div>
            ) : (
              <div className="candidates-list">
                {candidates.map(candidate => (
                  <div key={candidate.id} className="candidate-item">
                    <div className="candidate-name">{candidate.name}</div>
                    <div className="candidate-progress">
                      <div className="progress-bar-custom">
                        <div 
                          className="progress-fill"
                          style={{ width: `${(candidate.voteCount / chartMax) * 100}%` }}
                        >
                          {candidate.voteCount} votes
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// --- Sidebar: Top Candidates Per Position ---
const TopCandidatesPerPosition = ({ positions, candidates, resultsData, electionPositions, topN = 3 }) => {
  const topByPosition = useMemo(() => {
    const electionPositionIds = electionPositions.map(ep => ep.id); // Changed from ep.positionId to ep.id
    const electionPositionsList = positions.filter(pos => electionPositionIds.includes(pos.id));
    
    return electionPositionsList.map(pos => {
      const candidatesForPos = candidates
        .filter(c => c.positionId === pos.id)
        .map(candidate => {
          const result = resultsData.find(r => r.candidateId === candidate.id && r.positionId === pos.id);
          return {
            ...candidate,
            voteCount: result ? result.voteCount : 0
          };
        })
        .sort((a, b) => b.voteCount - a.voteCount)
        .slice(0, topN);
      return { position: pos, candidates: candidatesForPos };
    });
  }, [positions, candidates, resultsData, electionPositions, topN]);

  return (
    <>
      {topByPosition.map(({ position, candidates }) => (
        <div key={position.id} className="chart-card mb-3">
          <h6 className="fw-bold mb-2 text-primary">Top {topN} - {position.name}</h6>
          {candidates.length === 0 ? (
            <div className="alert alert-info text-center small">No candidates for this position.</div>
          ) : (
            candidates.map(candidate => (
              <div key={candidate.id} className="d-flex justify-content-between align-items-center mb-2 p-2 rounded top-candidate-item">
                <div className="fw-bold small text-dark">{candidate.name}</div>
                <strong className="fs-6 text-primary">{candidate.voteCount}</strong>
              </div>
            ))
          )}
        </div>
      ))}
    </>
  );
};

// --- Main Page Component ---
const Results = () => {
  const [loading, setLoading] = useState(true);
  const [resultsData, setResultsData] = useState([]);
  const [additionalData, setAdditionalData] = useState({
    positions: [],
    candidates: [],
    voters: [],
    electionPositions: []
  });
  const { canViewResults, hasAnyElection, triggerImmediateRefresh, activeElection } = useElection();

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (!activeElection) {
          if (isMounted) {
            setResultsData([]);
            setAdditionalData({ positions: [], candidates: [], voters: [], electionPositions: [] });
            setLoading(false);
          }
          return;
        }

        // Use the dedicated results API
        const [results, positions, candidates, voters, electionPositions] = await Promise.all([
          getResults(),
          getPositions(),
          getCandidates(),
          getVoters(),
          getElectionPositions(activeElection.id)
        ]);
        
        if (isMounted) {
          setResultsData(results);
          setAdditionalData({ positions, candidates, voters, electionPositions });
        }
      } catch (error) {
        console.error('Error fetching results data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [activeElection?.id]); // Only depend on activeElection.id, not the entire object

  const electionStats = useMemo(() => {
    const { positions, candidates, voters, electionPositions } = additionalData;
    
    // Only consider positions that are part of the current election
    const electionPositionIds = electionPositions.map(ep => ep.id); // Changed from ep.positionId to ep.id
    const electionPositionsList = positions.filter(pos => electionPositionIds.includes(pos.id));
    
    // Only consider candidates for positions in the current election
    const electionCandidates = candidates.filter(candidate => 
      electionPositionIds.includes(candidate.positionId)
    );
    
    // Use the results data from the API
    const electionResults = resultsData.filter(result => 
      electionPositionIds.includes(result.positionId)
    );
    
    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Election Position IDs:', electionPositionIds);
      console.log('All Results Data:', resultsData);
      console.log('Filtered Election Results:', electionResults);
    }
    
    const totalVotes = electionResults.reduce((sum, result) => sum + result.voteCount, 0);
    const votersVotedCount = new Set(electionResults.map(r => r.voterId)).size;
    const voterTurnout = voters.length > 0 ? ((votersVotedCount / voters.length) * 100).toFixed(0) : '0';

    // Calculate votes per position for the current election
    const votesPerPosition = electionPositionsList.map(pos => {
      const positionResults = electionResults.filter(result => result.positionId === pos.id);
      const positionVoteCount = positionResults.reduce((sum, result) => sum + result.voteCount, 0);
      
      return {
        name: pos.name,
        count: positionVoteCount,
      };
    }).sort((a, b) => b.count - a.count);

    // Calculate candidate performance with rankings for the current election
    const candidatePerformance = electionResults.map(result => {
      const candidate = electionCandidates.find(c => c.id === result.candidateId);
      const position = electionPositionsList.find(p => p.id === result.positionId);
      
      return {
        id: result.candidateId,
        name: result.candidateName || candidate?.name || 'Unknown Candidate',
        position: position?.name || 'Unknown Position',
        voteCount: result.voteCount,
        positionId: result.positionId
      };
    }).sort((a, b) => b.voteCount - a.voteCount);

    // Add rankings within each position
    const candidatePerformanceWithRanking = candidatePerformance.map((candidate, index) => {
      // Find rank within the same position
      const samePositionCandidates = candidatePerformance.filter(c => c.positionId === candidate.positionId);
      const rankInPosition = samePositionCandidates.findIndex(c => c.id === candidate.id) + 1;
      
      return {
        ...candidate,
        rank: rankInPosition,
        overallRank: index + 1
      };
    });

    // Top candidates for sidebar (overall top 5)
    const topCandidates = candidatePerformanceWithRanking.slice(0, 5);

    return { 
      totalVotes, 
      voterTurnout, 
      votesPerPosition, 
      candidatePerformance: candidatePerformanceWithRanking,
      topCandidates 
    };
  }, [resultsData, additionalData]);

  // Meaningful timer based on election status
  const [timeDisplay, setTimeDisplay] = useState('');
  const [timeTitle, setTimeTitle] = useState('Time Left');
  
  useEffect(() => {
    let isMounted = true;
    
    const updateTimeDisplay = () => {
      if (!isMounted || !activeElection) {
        if (isMounted) {
          setTimeDisplay('No Active Election');
          setTimeTitle('Election Status');
        }
        return;
      }

      const now = new Date();
      const electionStart = new Date(activeElection.startTime);
      const electionEnd = new Date(activeElection.endTime);

      if (activeElection.status === 'active') {
        // Election is active - show time remaining
        if (isMounted) {
          setTimeTitle('Time Remaining');
          const timeRemaining = electionEnd - now;
          if (timeRemaining > 0) {
            setTimeDisplay(formatTime(timeRemaining / 1000));
          } else {
            setTimeDisplay('Election Ended');
          }
        }
      } else if (activeElection.status === 'ended') {
        // Election has ended - show time since end
        if (isMounted) {
          setTimeTitle('Time Since End');
          const timeSinceEnd = now - electionEnd;
          const hoursSinceEnd = Math.floor(timeSinceEnd / (1000 * 60 * 60));
          const daysSinceEnd = Math.floor(hoursSinceEnd / 24);
          
          if (daysSinceEnd > 0) {
            setTimeDisplay(`${daysSinceEnd} day${daysSinceEnd > 1 ? 's' : ''} ago`);
          } else if (hoursSinceEnd > 0) {
            setTimeDisplay(`${hoursSinceEnd} hour${hoursSinceEnd > 1 ? 's' : ''} ago`);
          } else {
            setTimeDisplay('Recently ended');
          }
        }
      } else if (activeElection.status === 'pending') {
        // Election hasn't started - show time until start
        if (isMounted) {
          setTimeTitle('Time Until Start');
          const timeUntilStart = electionStart - now;
          if (timeUntilStart > 0) {
            setTimeDisplay(`Starts in ${formatTime(timeUntilStart / 1000)}`);
          } else {
            setTimeDisplay('Starting soon');
          }
        }
      } else {
        if (isMounted) {
          setTimeTitle('Election Status');
          setTimeDisplay('Election Paused');
        }
      }
    };

    updateTimeDisplay();
    const timerInterval = setInterval(updateTimeDisplay, 1000);
    
    return () => {
      isMounted = false;
      clearInterval(timerInterval);
    };
  }, [activeElection?.id, activeElection?.status, activeElection?.startTime, activeElection?.endTime]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('Results component render:', {
      canViewResults,
      hasAnyElection,
      activeElectionId: activeElection?.id,
      dataLoaded: !loading,
      resultsDataLength: resultsData.length,
      additionalDataLength: Object.keys(additionalData).length
    });
  }

  // Check if user can view results (has elections)
  if (!canViewResults) {
    return <ElectionStatusMessage type="results" />;
  }

  // Check if there's no active election to show results for
  if (!activeElection) {
    return (
      <div className="dashboard-content px-3 pb-3">
        <div className="alert alert-info text-center">
          <i className="fas fa-info-circle fa-2x mb-3"></i>
          <h4>No Active Election</h4>
          <p>There is currently no active election to display results for.</p>
          <p className="mb-0">Results will be available once an election is created and started.</p>
        </div>
      </div>
    );
  }

  const { totalVotes, voterTurnout } = electionStats;
  const { positions, candidates, electionPositions } = additionalData;
  const userRole = checkCurrentUser().role;
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';

  return (
    <>
      {/* Unified Professional Header */}
      <div className="dashboard-header-pro">
        <div className="dashboard-header-row">
          <div>
            <h1 className="dashboard-title-pro">
              Election Results Dashboard
              {activeElection && (
                <span className="text-muted ms-2">- {activeElection.title}</span>
              )}
            </h1>
            <p className="dashboard-subtitle-pro">
              {activeElection 
                ? `Real-time results for "${activeElection.title}" - showing candidate performance for positions in this election.`
                : 'No active election to display results for.'
              }
            </p>
          </div>
          {isAdmin && activeElection && (
            <div className="dashboard-header-actions">
              <button 
                className="btn btn-custom-blue"
                onClick={() => printResults(electionStats, positions, candidates, resultsData)}
              >
                <i className="fas fa-print me-2"></i>
                Print Results
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-content px-3 pb-3">
        <div className="row h-100">
          {/* Main Content Column */}
          <div className="col-lg-8 mb-3 mb-lg-0 h-100 scrollable-col">
            <CandidatesByPosition 
              positions={positions} 
              candidates={candidates} 
              resultsData={resultsData} 
              electionPositions={electionPositions}
            />
          </div>

          {/* Right Sidebar Column */}
          <div className="col-lg-4 h-100 scrollable-col">
            <div className="row">
              <div className="col-12 mb-3">
                <SummaryCard 
                  icon="📊" 
                  title="Total Votes Cast" 
                  value={totalVotes.toLocaleString()} 
                />
              </div>
              <div className="col-12 mb-3">
                <SummaryCard 
                  icon="👥" 
                  title="Voter Turnout" 
                  value={`${voterTurnout}%`} 
                  tooltipText="Percentage of registered voters who have cast a vote."
                />
              </div>
              <div className="col-12 mb-3">
                <SummaryCard 
                  icon="⏰" 
                  title={timeTitle} 
                  value={timeDisplay || '00:00:00'} 
                />
              </div>
            </div>
            <TopCandidatesPerPosition 
              positions={positions} 
              candidates={candidates} 
              resultsData={resultsData} 
              electionPositions={electionPositions}
              topN={3} 
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Results; 