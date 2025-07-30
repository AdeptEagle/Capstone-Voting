import React, { useState, useEffect, useMemo } from 'react';
import { getActiveElectionResults, getRealTimeStats, getVoteTimeline, getPositions, getCandidates, getVoters, getDepartments, getCourses } from '../services/api';
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

const formatPercentage = (value, total) => {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};

const getRandomColor = (index) => {
  const colors = [
    '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#e67e22', '#34495e', '#16a085', '#d35400',
    '#8e44ad', '#27ae60', '#f1c40f', '#e74c3c', '#3498db'
  ];
  return colors[index % colors.length];
};

// --- Chart Components ---
const ProgressBar = ({ value, max, label, color = '#3498db', showPercentage = true }) => (
  <div className="progress-item">
    <div className="progress-header">
      <span className="progress-label">{label}</span>
      {showPercentage && (
        <span className="progress-value">{formatPercentage(value, max)}</span>
      )}
    </div>
    <div className="progress-bar-container">
      <div 
        className="progress-bar-fill"
        style={{ 
          width: `${max > 0 ? (value / max) * 100 : 0}%`,
          backgroundColor: color
        }}
      />
    </div>
    <div className="progress-stats">
      <span>{value} votes</span>
      <span>{max} total</span>
    </div>
  </div>
);

const DonutChart = ({ data, title, size = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>No data available</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="donut-chart">
      <h4>{title}</h4>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((item, index) => {
          const percentage = total > 0 ? item.value / total : 0;
          const angle = percentage * 360;
          const radius = size / 2 - 10;
          const x1 = size / 2 + radius * Math.cos(currentAngle * Math.PI / 180);
          const y1 = size / 2 + radius * Math.sin(currentAngle * Math.PI / 180);
          const x2 = size / 2 + radius * Math.cos((currentAngle + angle) * Math.PI / 180);
          const y2 = size / 2 + radius * Math.sin((currentAngle + angle) * Math.PI / 180);
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          currentAngle += angle;
          
          return (
            <path
              key={index}
              d={`M ${size / 2} ${size / 2} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
              fill={getRandomColor(index)}
              stroke="#fff"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      <div className="chart-legend">
        {data.map((item, index) => (
          <div key={index} className="legend-item">
            <span 
              className="legend-color" 
              style={{ backgroundColor: getRandomColor(index) }}
            />
            <span className="legend-label">{item.label}</span>
            <span className="legend-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BarChart = ({ data, title, height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const barWidth = 100 / data.length;

  return (
    <div className="bar-chart">
      <h4>{title}</h4>
      <div className="chart-container" style={{ height }}>
        {data.map((item, index) => (
          <div key={index} className="bar-item">
            <div 
              className="bar"
              style={{ 
                height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                backgroundColor: getRandomColor(index),
                width: `${barWidth}%`
              }}
            />
            <div className="bar-label">{item.label}</div>
            <div className="bar-value">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LineChart = ({ data, title, height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const points = data.map((item, index) => {
    // Fix division by zero when data.length is 1
    const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
    const y = maxValue > 0 ? 100 - (item.value / maxValue) * 100 : 100;
    return `${x}%,${y}%`;
  }).join(' ');

  return (
    <div className="line-chart">
      <h4>{title}</h4>
      <div className="chart-container" style={{ height }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <polyline
            points={points}
            fill="none"
            stroke="#3498db"
            strokeWidth="2"
          />
          {data.map((item, index) => {
            // Fix division by zero when data.length is 1
            const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
            const y = maxValue > 0 ? 100 - (item.value / maxValue) * 100 : 100;
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="2"
                fill="#3498db"
              />
            );
          })}
        </svg>
        <div className="chart-labels">
          {data.map((item, index) => (
            <div key={index} className="chart-label">
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AnalyticsCard = ({ title, value, change, icon, color = '#3498db' }) => (
  <div className="analytics-card">
    <div className="card-icon" style={{ backgroundColor: color }}>
      <i className={icon}></i>
    </div>
    <div className="card-content">
      <h3>{title}</h3>
      <div className="card-value">{value}</div>
      {change && (
        <div className={`card-change ${change >= 0 ? 'positive' : 'negative'}`}>
          <i className={`fas fa-arrow-${change >= 0 ? 'up' : 'down'}`}></i>
          {Math.abs(change)}%
        </div>
      )}
    </div>
  </div>
);

const Results = () => {
  const [resultsData, setResultsData] = useState([]);
  const [realTimeStats, setRealTimeStats] = useState({});
  const [voteTimeline, setVoteTimeline] = useState([]);
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  const { currentElection, canViewResults } = useElection();
  const currentUser = checkCurrentUser();

  // Fetch data with real-time updates
  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        activeResults,
        stats,
        timeline
      ] = await Promise.all([
        getActiveElectionResults(),
        getRealTimeStats(),
        getVoteTimeline()
      ]);
      
      setResultsData(activeResults);
      setRealTimeStats(stats);
      setVoteTimeline(timeline);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching results data:', error);
      setError('Failed to load results data');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update time display
  useEffect(() => {
    if (currentElection) {
      const updateTimeDisplay = () => {
        const now = new Date().getTime();
        const endTime = new Date(currentElection.endTime).getTime();
        const timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeLeft(timeRemaining);
      };

      updateTimeDisplay();
      const interval = setInterval(updateTimeDisplay, 5000);
      return () => clearInterval(interval);
    }
  }, [currentElection]);

  // Calculate analytics data from real-time stats
  const analyticsData = useMemo(() => {
    if (!resultsData.length) return {};

    const totalVotes = realTimeStats.totalVotes || 0;
    const totalVoters = realTimeStats.totalVoters || 0;
    const voterTurnout = realTimeStats.voterTurnout || 0;
    
    // Group results by position
    const positionGroups = {};
    resultsData.forEach(result => {
      if (!positionGroups[result.positionId]) {
        positionGroups[result.positionId] = {
          positionName: result.positionName,
          candidates: []
        };
      }
      positionGroups[result.positionId].candidates.push({
        candidateId: result.candidateId,
        candidateName: result.candidateName,
        voteCount: result.voteCount
      });
    });

    // Votes per position
    const votesPerPosition = Object.values(positionGroups).map(position => ({
      label: position.positionName,
      value: position.candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0)
    }));

    // Top candidates
    const topCandidates = resultsData
      .map(result => ({
        label: result.candidateName,
        value: result.voteCount
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Timeline data from real-time API
    const timelineData = voteTimeline.map(item => ({
      label: item.hour,
      value: item.voteCount
    }));

    return {
      totalVotes,
      totalVoters,
      voterTurnout,
      votesPerPosition,
      topCandidates,
      timelineData,
      positionGroups
    };
  }, [resultsData, realTimeStats, voteTimeline]);

  if (!canViewResults) {
    return <ElectionStatusMessage type="results" />;
  }

  // Check if there's any active election data
  if (!resultsData.length) {
    return (
      <div className="results-container">
        <div className="results-header">
          <div className="results-title">
            <h1>Election Results</h1>
            <p className="text-muted">No active election found</p>
          </div>
        </div>
        <div className="alert alert-info text-center">
          <i className="fas fa-info-circle fa-2x mb-3"></i>
          <h4>No Active Election</h4>
          <p>There is currently no active election with results to display.</p>
          <p className="mb-0">Please wait for an election to be started or check back later.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="results-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading real-time results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-error">
        <div className="alert alert-danger text-center">
          <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
          <h4>Error Loading Results</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchData}>
            <i className="fas fa-refresh me-2"></i>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      {/* Header */}
      <div className="results-header">
        <div className="results-title">
          <h1>Live Election Results</h1>
          <p className="text-muted">Real-time voting statistics and analytics</p>
        </div>
        <div className="results-actions">
          <button className="btn btn-outline-primary" onClick={fetchData}>
            <i className="fas fa-sync-alt me-2"></i>
            Refresh
          </button>
          <div className="last-update">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Election Status */}
      {currentElection && (
        <div className="election-status">
          <div className="status-card">
            <h3>{currentElection.title}</h3>
            <p className="status-text">
              Status: <span className={`status-badge ${currentElection.status}`}>
                {currentElection.status.toUpperCase()}
              </span>
            </p>
            {timeLeft > 0 && (
              <p className="time-remaining">
                Time Remaining: <span className="countdown">{formatTime(timeLeft)}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Real-time Analytics Cards */}
      <div className="analytics-grid">
        <AnalyticsCard
          title="Total Votes"
          value={analyticsData.totalVotes || 0}
          icon="fas fa-vote-yea"
          color="#3498db"
        />
        <AnalyticsCard
          title="Voter Turnout"
          value={`${Math.round(analyticsData.voterTurnout || 0)}%`}
          icon="fas fa-users"
          color="#2ecc71"
        />
        <AnalyticsCard
          title="Active Voters"
          value={realTimeStats.votersWhoVoted || 0}
          icon="fas fa-user-check"
          color="#e74c3c"
        />
        <AnalyticsCard
          title="Positions"
          value={Object.keys(analyticsData.positionGroups || {}).length}
          icon="fas fa-briefcase"
          color="#f39c12"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="results-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-chart-pie"></i>
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'positions' ? 'active' : ''}`}
          onClick={() => setActiveTab('positions')}
        >
          <i className="fas fa-briefcase"></i>
          By Position
        </button>
        <button 
          className={`tab-button ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          <i className="fas fa-clock"></i>
          Timeline
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="charts-grid">
              <div className="chart-card">
                <DonutChart 
                  data={analyticsData.votesPerPosition || []}
                  title="Votes by Position"
                />
              </div>
              <div className="chart-card">
                <BarChart 
                  data={analyticsData.topCandidates || []}
                  title="Top Candidates"
                />
              </div>
            </div>
            <div className="progress-section">
              <h3>Voting Progress by Position</h3>
              {analyticsData.votesPerPosition?.map((item, index) => (
                <ProgressBar
                  key={index}
                  value={item.value}
                  max={analyticsData.totalVotes || 1}
                  label={item.label}
                  color={getRandomColor(index)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'positions' && (
          <div className="positions-tab">
            <div className="positions-grid">
              {Object.values(analyticsData.positionGroups || {}).map((position, index) => {
                const candidateResults = position.candidates
                  .sort((a, b) => b.voteCount - a.voteCount);

                const totalPositionVotes = position.candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);

                return (
                  <div key={position.positionName} className="position-card">
                    <h3>{position.positionName}</h3>
                    <div className="candidate-results">
                      {candidateResults.map((candidate, idx) => (
                        <div key={candidate.candidateId} className="candidate-result">
                          <div className="candidate-info">
                            <span className="candidate-name">{candidate.candidateName}</span>
                            <span className="candidate-votes">{candidate.voteCount} votes</span>
                          </div>
                          <div className="candidate-progress">
                            <div 
                              className="candidate-progress-bar"
                              style={{ 
                                width: `${totalPositionVotes > 0 ? (candidate.voteCount / totalPositionVotes) * 100 : 0}%`,
                                backgroundColor: getRandomColor(idx)
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="timeline-tab">
            <div className="timeline-chart">
              <LineChart 
                data={analyticsData.timelineData || []}
                title="Voting Activity (Last 24 Hours)"
              />
            </div>
            <div className="timeline-stats">
              <h3>Voting Timeline</h3>
              <div className="timeline-items">
                {analyticsData.timelineData?.map((item, index) => (
                  <div key={index} className="timeline-item">
                    <span className="timeline-time">{item.label}</span>
                    <span className="timeline-votes">{item.value} votes</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results; 