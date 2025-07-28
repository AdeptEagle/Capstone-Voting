import React, { useState, useEffect, useMemo } from 'react';
import { getResults, getPositions, getCandidates, getVoters, getElectionPositions, getDepartments, getCourses } from '../services/api';
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
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="donut-chart">
      <h4>{title}</h4>
      <div className="donut-container" style={{ width: size, height: size }}>
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
            const pathData = [
              `M ${size / 2} ${size / 2}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            currentAngle += angle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={getRandomColor(index)}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        <div className="donut-center">
          <div className="donut-total">{total}</div>
          <div className="donut-label">Total Votes</div>
        </div>
      </div>
      <div className="donut-legend">
        {data.map((item, index) => (
          <div key={index} className="legend-item">
            <div 
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
  const maxValue = Math.max(...data.map(item => item.value), 1);

  return (
    <div className="bar-chart">
      <h4>{title}</h4>
      <div className="bar-container" style={{ height }}>
        {data.map((item, index) => (
          <div key={index} className="bar-item">
            <div className="bar-label">{item.label}</div>
            <div className="bar-wrapper">
              <div 
                className="bar-fill"
                style={{ 
                  height: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: getRandomColor(index)
                }}
              />
            </div>
            <div className="bar-value">{item.value}</div>
          </div>
        ))}
        </div>
    </div>
  );
};

const LineChart = ({ data, title, height = 200 }) => {
  const maxValue = Math.max(...data.map(item => item.value), 1);
  const points = data.map((item, index) => ({
    x: (index / (data.length - 1)) * 100,
    y: 100 - ((item.value / maxValue) * 100)
  }));

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x}% ${point.y}%`
  ).join(' ');

  return (
    <div className="line-chart">
      <h4>{title}</h4>
      <div className="line-container" style={{ height }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d={pathData}
            stroke="#3498db"
            strokeWidth="2"
            fill="none"
          />
          {points.map((point, index) => (
            <circle
              key={index}
              cx={`${point.x}%`}
              cy={`${point.y}%`}
              r="2"
              fill="#3498db"
            />
          ))}
        </svg>
        <div className="line-labels">
          {data.map((item, index) => (
            <div key={index} className="line-label">
              <span className="line-label-text">{item.label}</span>
              <span className="line-label-value">{item.value}</span>
                  </div>
                ))}
              </div>
          </div>
    </div>
  );
};

const AnalyticsCard = ({ title, value, change, icon, color = '#3498db' }) => (
  <div className="analytics-card">
    <div className="analytics-icon" style={{ backgroundColor: color }}>
      <i className={icon}></i>
              </div>
    <div className="analytics-content">
      <h3 className="analytics-title">{title}</h3>
      <div className="analytics-value">{value}</div>
      {change && (
        <div className={`analytics-change ${change > 0 ? 'positive' : 'negative'}`}>
          <i className={`fas fa-arrow-${change > 0 ? 'up' : 'down'}`}></i>
          {Math.abs(change)}%
        </div>
      )}
    </div>
  </div>
  );

const Results = () => {
  const [resultsData, setResultsData] = useState([]);
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [electionPositions, setElectionPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { currentElection } = useElection();
  const currentUser = checkCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          results,
          positionsData,
          candidatesData,
          votersData,
          departmentsData,
          coursesData,
          electionPositionsData
        ] = await Promise.all([
          getResults(),
          getPositions(),
          getCandidates(),
          getVoters(),
          getDepartments(),
          getCourses(),
          getElectionPositions()
        ]);
        
          setResultsData(results);
        setPositions(positionsData);
        setCandidates(candidatesData);
        setVoters(votersData);
        setDepartments(departmentsData);
        setCourses(coursesData);
        setElectionPositions(electionPositionsData);
      } catch (error) {
        console.error('Error fetching results data:', error);
        setError('Failed to load results data');
      } finally {
          setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (currentElection) {
      const updateTimeDisplay = () => {
        const now = new Date().getTime();
        const endTime = new Date(currentElection.endTime).getTime();
        const timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeLeft(timeRemaining);
      };

      updateTimeDisplay();
      const interval = setInterval(updateTimeDisplay, 1000);
      return () => clearInterval(interval);
    }
  }, [currentElection]);

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    if (!resultsData.length || !voters.length) return {};

    const totalVotes = resultsData.length;
    const totalVoters = voters.length;
    const voterTurnout = totalVoters > 0 ? (totalVotes / totalVoters) * 100 : 0;
    
    // Votes per position
    const votesPerPosition = positions.map(position => {
      const positionVotes = resultsData.filter(vote => {
        const candidate = candidates.find(c => c.id === vote.candidateId);
        return candidate && candidate.positionId === position.id;
      }).length;
      return { label: position.name, value: positionVotes };
    });

    // Top candidates
    const candidateVotes = {};
    resultsData.forEach(vote => {
      candidateVotes[vote.candidateId] = (candidateVotes[vote.candidateId] || 0) + 1;
    });

    const topCandidates = Object.entries(candidateVotes)
      .map(([candidateId, votes]) => {
        const candidate = candidates.find(c => c.id === candidateId);
    return { 
          label: candidate ? candidate.name : 'Unknown',
          value: votes
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Department analytics
    const departmentVotes = {};
    voters.forEach(voter => {
      if (voter.departmentId) {
        const department = departments.find(d => d.id === voter.departmentId);
        if (department) {
          departmentVotes[department.name] = (departmentVotes[department.name] || 0) + 1;
        }
      }
    });

    const departmentData = Object.entries(departmentVotes)
      .map(([name, votes]) => ({ label: name, value: votes }))
      .sort((a, b) => b.value - a.value);

    // Course analytics
    const courseVotes = {};
    voters.forEach(voter => {
      if (voter.courseId) {
        const course = courses.find(c => c.id === voter.courseId);
        if (course) {
          courseVotes[course.name] = (courseVotes[course.name] || 0) + 1;
        }
      }
    });

    const courseData = Object.entries(courseVotes)
      .map(([name, votes]) => ({ label: name, value: votes }))
      .sort((a, b) => b.value - a.value);

    // Voting timeline (simulated)
    const timelineData = [
      { label: '9:00 AM', value: Math.floor(totalVotes * 0.1) },
      { label: '10:00 AM', value: Math.floor(totalVotes * 0.25) },
      { label: '11:00 AM', value: Math.floor(totalVotes * 0.4) },
      { label: '12:00 PM', value: Math.floor(totalVotes * 0.6) },
      { label: '1:00 PM', value: Math.floor(totalVotes * 0.75) },
      { label: '2:00 PM', value: Math.floor(totalVotes * 0.85) },
      { label: '3:00 PM', value: Math.floor(totalVotes * 0.95) },
      { label: '4:00 PM', value: totalVotes }
    ];

    return {
      totalVotes,
      totalVoters,
      voterTurnout,
      votesPerPosition,
      topCandidates,
      departmentData,
      courseData,
      timelineData
    };
  }, [resultsData, voters, positions, candidates, departments, courses]);

  if (loading) {
    return (
      <div className="results-loading">
        <div className="loading-spinner">
          <i className="fas fa-chart-line fa-spin"></i>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-error">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Error Loading Results</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      {/* Header */}
      <div className="results-header">
        <div className="results-title">
          <h1><i className="fas fa-chart-bar"></i> Election Analytics</h1>
          <p>Comprehensive voting statistics and real-time insights</p>
          </div>
        {currentElection && (
          <div className="election-status">
            <ElectionStatusMessage />
            {timeLeft > 0 && (
              <div className="time-remaining">
                <i className="fas fa-clock"></i>
                <span>Time Remaining: {formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
        )}
      </div>

      {/* Analytics Cards */}
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
          value={voters.filter(v => v.hasVoted).length}
          icon="fas fa-user-check"
          color="#e74c3c"
        />
        <AnalyticsCard
          title="Positions"
          value={positions.length}
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
          className={`tab-button ${activeTab === 'demographics' ? 'active' : ''}`}
          onClick={() => setActiveTab('demographics')}
        >
          <i className="fas fa-users"></i>
          Demographics
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
              {positions.map((position, index) => {
                const positionCandidates = candidates.filter(c => c.positionId === position.id);
                const positionVotes = resultsData.filter(vote => {
                  const candidate = candidates.find(c => c.id === vote.candidateId);
                  return candidate && candidate.positionId === position.id;
                });

                const candidateResults = positionCandidates.map(candidate => {
                  const votes = positionVotes.filter(vote => vote.candidateId === candidate.id).length;
                  return { ...candidate, votes };
                }).sort((a, b) => b.votes - a.votes);

                return (
                  <div key={position.id} className="position-card">
                    <h3>{position.name}</h3>
                    <div className="candidate-results">
                      {candidateResults.map((candidate, idx) => (
                        <div key={candidate.id} className="candidate-result">
                          <div className="candidate-info">
                            <span className="candidate-name">{candidate.name}</span>
                            <span className="candidate-votes">{candidate.votes} votes</span>
                          </div>
                          <div className="candidate-progress">
                            <div 
                              className="candidate-progress-bar"
                              style={{ 
                                width: `${positionVotes.length > 0 ? (candidate.votes / positionVotes.length) * 100 : 0}%`,
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

        {activeTab === 'demographics' && (
          <div className="demographics-tab">
            <div className="charts-grid">
              <div className="chart-card">
                <DonutChart 
                  data={analyticsData.departmentData || []}
                  title="Votes by Department"
                />
              </div>
              <div className="chart-card">
                <BarChart 
                  data={analyticsData.courseData || []}
                  title="Votes by Course"
                />
              </div>
            </div>
            <div className="demographics-stats">
              <div className="stat-card">
                <h4>Department Participation</h4>
                <div className="stat-list">
                  {analyticsData.departmentData?.map((dept, index) => (
                    <div key={index} className="stat-item">
                      <span>{dept.label}</span>
                      <span>{dept.value} votes</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="stat-card">
                <h4>Course Participation</h4>
                <div className="stat-list">
                  {analyticsData.courseData?.map((course, index) => (
                    <div key={index} className="stat-item">
                      <span>{course.label}</span>
                      <span>{course.value} votes</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="timeline-tab">
            <div className="chart-card full-width">
              <LineChart 
                data={analyticsData.timelineData || []}
                title="Voting Timeline"
                height={300}
              />
            </div>
            <div className="timeline-insights">
              <h3>Voting Insights</h3>
              <div className="insights-grid">
                <div className="insight-card">
                  <i className="fas fa-chart-line"></i>
                  <h4>Peak Voting Time</h4>
                  <p>12:00 PM - 2:00 PM</p>
                </div>
                <div className="insight-card">
                  <i className="fas fa-clock"></i>
                  <h4>Average Voting Rate</h4>
                  <p>15 votes per hour</p>
                </div>
                <div className="insight-card">
                  <i className="fas fa-trending-up"></i>
                  <h4>Growth Rate</h4>
                  <p>+25% from last hour</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results; 