import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Table, Tabs, Tab, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  getAllCompletedElections, 
  getElectionAnalysis,
  getElectionSummary,
  getElectionHistoryResults,
  getElectionVoters,
  getDepartmentStats,
  getCourseStats,
  getVotingTimeline,
  getPositionAnalytics,
  getVoteDistribution
} from '../services/api';
import { CandidateImage } from '../utils/image';
import './BallotHistory.css';

// Chart component (simple bar chart)
const SimpleBarChart = ({ data, title, xKey, yKey, color = '#667eea' }) => {
  if (!data || data.length === 0) return <div>No data available</div>;

  const maxValue = Math.max(...data.map(item => item[yKey]));

  return (
    <div className="simple-chart">
      <h6 className="chart-title">{title}</h6>
      <div className="chart-container">
        {data.map((item, index) => (
          <div key={index} className="chart-bar-container">
            <div className="chart-bar-label">{item[xKey]}</div>
            <div className="chart-bar-wrapper">
              <div 
                className="chart-bar" 
                style={{ 
                  height: `${(item[yKey] / maxValue) * 100}%`,
                  backgroundColor: color 
                }}
              ></div>
            </div>
            <div className="chart-bar-value">{item[yKey]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pie chart component (simple)
const SimplePieChart = ({ data, title, labelKey, valueKey }) => {
  if (!data || data.length === 0) return <div>No data available</div>;

  const total = data.reduce((sum, item) => sum + item[valueKey], 0);
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

  return (
    <div className="simple-pie-chart">
      <h6 className="chart-title">{title}</h6>
      <div className="pie-chart-container">
        <div className="pie-chart-legend">
          {data.map((item, index) => (
            <div key={index} className="pie-legend-item">
              <div 
                className="pie-legend-color" 
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="pie-legend-label">
                {item[labelKey]}: {item[valueKey]} ({((item[valueKey] / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BallotHistory = () => {
  const [completedElections, setCompletedElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [electionData, setElectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompletedElections();
  }, []);

  const fetchCompletedElections = async () => {
    try {
      setLoading(true);
      const response = await getAllCompletedElections();
      setCompletedElections(response.data || []);
    } catch (error) {
      console.error('Error fetching completed elections:', error);
      setError('Failed to load election history');
    } finally {
      setLoading(false);
    }
  };

  const handleElectionSelect = async (election) => {
    try {
      setAnalysisLoading(true);
      setSelectedElection(election);
      setError('');
      
      // Fetch comprehensive election data
      const analysisResponse = await getElectionAnalysis(election.id);
      setElectionData(analysisResponse.data);
      setActiveTab('overview');
    } catch (error) {
      console.error('Error fetching election analysis:', error);
      setError('Failed to load election analysis');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes || minutes === 0) return 'N/A';
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    return new Date(dateTime).toLocaleString();
  };

  if (loading) {
    return (
      <div className="ballot-history-loading">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading ballot history...</p>
      </div>
    );
  }

  return (
    <div className="ballot-history-container">
      {/* Header */}
      <div className="ballot-history-header">
        <div className="header-content">
          <div>
            <h2 className="page-title">📊 Ballot History & Analytics</h2>
            <p className="page-subtitle">
              Comprehensive analysis of completed elections with detailed insights
            </p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-value">{completedElections.length}</div>
              <div className="stat-label">Completed Elections</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      <Row>
        {/* Elections List */}
        <Col lg={4} className="elections-sidebar">
          <Card className="elections-list-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-history me-2"></i>
                Election History
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {completedElections.length === 0 ? (
                <div className="no-elections-message">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No completed elections found</p>
                </div>
              ) : (
                <div className="elections-list">
                  {completedElections.map((election) => (
                    <div
                      key={election.id}
                      className={`election-item ${selectedElection?.id === election.id ? 'active' : ''}`}
                      onClick={() => handleElectionSelect(election)}
                    >
                      <div className="election-main-info">
                        <h6 className="election-title">{election.title}</h6>
                        <p className="election-description">{election.description}</p>
                      </div>
                      
                      <div className="election-stats">
                        <div className="stat-row">
                          <span className="stat-icon">👥</span>
                          <span>{election.totalVoters} voters</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-icon">🗳️</span>
                          <span>{election.totalVotes} votes</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-icon">⏱️</span>
                          <span>{formatDuration(election.durationMinutes)}</span>
                        </div>
                      </div>
                      
                      <div className="election-date">
                        <small className="text-muted">
                          {formatDateTime(election.endTime)}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Election Analysis */}
        <Col lg={8}>
          {!selectedElection ? (
            <Card className="selection-prompt-card">
              <Card.Body className="text-center py-5">
                <i className="fas fa-chart-line fa-4x text-muted mb-4"></i>
                <h4 className="text-muted">Select an Election</h4>
                <p className="text-muted">
                  Choose an election from the list to view comprehensive analysis and results
                </p>
              </Card.Body>
            </Card>
          ) : analysisLoading ? (
            <Card className="loading-card">
              <Card.Body className="text-center py-5">
                <Spinner animation="border" size="lg" />
                <h5 className="mt-3">Loading Election Analysis...</h5>
                <p className="text-muted">Please wait while we prepare the comprehensive report</p>
              </Card.Body>
            </Card>
          ) : electionData ? (
            <Card className="analysis-card">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-analytics me-2"></i>
                    {selectedElection.title} - Analysis
                  </h5>
                  <Badge bg="success" className="fs-6">
                    <i className="fas fa-check-circle me-1"></i>
                    Completed
                  </Badge>
                </div>
              </Card.Header>
              
              <Card.Body>
                <Tabs activeKey={activeTab} onSelect={setActiveTab} className="election-tabs">
                  
                  {/* Overview Tab */}
                  <Tab eventKey="overview" title="📊 Overview">
                    <div className="tab-content-container">
                      {/* Election Summary */}
                      <div className="summary-cards">
                        <Row>
                          <Col md={3}>
                            <div className="summary-stat-card">
                              <div className="stat-icon-large">👥</div>
                              <div className="stat-info">
                                <div className="stat-number">{electionData.summary.totalVoters}</div>
                                <div className="stat-label">Total Voters</div>
                              </div>
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="summary-stat-card">
                              <div className="stat-icon-large">🗳️</div>
                              <div className="stat-info">
                                <div className="stat-number">{electionData.summary.totalVotes}</div>
                                <div className="stat-label">Total Votes</div>
                              </div>
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="summary-stat-card">
                              <div className="stat-icon-large">🏆</div>
                              <div className="stat-info">
                                <div className="stat-number">{electionData.summary.totalPositions}</div>
                                <div className="stat-label">Positions</div>
                              </div>
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="summary-stat-card">
                              <div className="stat-icon-large">👤</div>
                              <div className="stat-info">
                                <div className="stat-number">{electionData.summary.totalCandidates}</div>
                                <div className="stat-label">Candidates</div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      {/* Election Timeline */}
                      <Card className="mt-4">
                        <Card.Header>
                          <h6 className="mb-0">
                            <i className="fas fa-clock me-2"></i>
                            Election Timeline
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <div className="timeline-info">
                            <div className="timeline-item">
                              <span className="timeline-label">Started:</span>
                              <span className="timeline-value">{formatDateTime(electionData.summary.startTime)}</span>
                            </div>
                            <div className="timeline-item">
                              <span className="timeline-label">Ended:</span>
                              <span className="timeline-value">{formatDateTime(electionData.summary.endTime)}</span>
                            </div>
                            <div className="timeline-item">
                              <span className="timeline-label">Duration:</span>
                              <span className="timeline-value">{formatDuration(electionData.summary.durationMinutes)}</span>
                            </div>
                            <div className="timeline-item">
                              <span className="timeline-label">First Vote:</span>
                              <span className="timeline-value">{formatDateTime(electionData.summary.firstVoteTime)}</span>
                            </div>
                            <div className="timeline-item">
                              <span className="timeline-label">Last Vote:</span>
                              <span className="timeline-value">{formatDateTime(electionData.summary.lastVoteTime)}</span>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  </Tab>

                  {/* Results Tab */}
                  <Tab eventKey="results" title="🏆 Results">
                    <div className="tab-content-container">
                      {electionData.positionResults.map((position) => (
                        <Card key={position.positionId} className="position-results-card mb-4">
                          <Card.Header>
                            <h6 className="mb-0">
                              <i className="fas fa-trophy me-2"></i>
                              {position.positionName}
                              <Badge bg="info" className="ms-2">
                                {position.voteLimit} winner{position.voteLimit > 1 ? 's' : ''}
                              </Badge>
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            {/* Winners */}
                            <div className="winners-section mb-4">
                              <h6 className="section-title text-success">
                                <i className="fas fa-crown me-2"></i>
                                Winners
                              </h6>
                              <Row>
                                {position.candidates
                                  .filter(c => c.isWinner)
                                  .map((candidate) => (
                                  <Col md={6} lg={4} key={candidate.candidateId} className="mb-3">
                                    <div className="candidate-result-card winner">
                                      <div className="candidate-photo-section">
                                        <CandidateImage 
                                          photoUrl={candidate.photoUrl}
                                          alt={candidate.candidateName}
                                          size="normal"
                                        />
                                        <div className="rank-badge winner-badge">#{candidate.rank}</div>
                                      </div>
                                      <div className="candidate-info">
                                        <h6 className="candidate-name">{candidate.candidateName}</h6>
                                        <p className="candidate-details">
                                          {candidate.candidateDepartment}
                                          {candidate.candidateCourse && (
                                            <><br />{candidate.candidateCourse}</>
                                          )}
                                        </p>
                                        <div className="vote-count-badge">
                                          <i className="fas fa-vote-yea me-1"></i>
                                          {candidate.voteCount} votes
                                        </div>
                                      </div>
                                    </div>
                                  </Col>
                                ))}
                              </Row>
                            </div>

                            {/* Losers */}
                            {position.candidates.filter(c => !c.isWinner).length > 0 && (
                              <div className="losers-section">
                                <h6 className="section-title text-muted">
                                  <i className="fas fa-users me-2"></i>
                                  Other Candidates
                                </h6>
                                <Row>
                                  {position.candidates
                                    .filter(c => !c.isWinner)
                                    .map((candidate) => (
                                    <Col md={6} lg={4} key={candidate.candidateId} className="mb-3">
                                      <div className="candidate-result-card">
                                        <div className="candidate-photo-section">
                                          <CandidateImage 
                                            photoUrl={candidate.photoUrl}
                                            alt={candidate.candidateName}
                                            size="small"
                                          />
                                          <div className="rank-badge">#{candidate.rank}</div>
                                        </div>
                                        <div className="candidate-info">
                                          <h6 className="candidate-name">{candidate.candidateName}</h6>
                                          <p className="candidate-details">
                                            {candidate.candidateDepartment}
                                            {candidate.candidateCourse && (
                                              <><br />{candidate.candidateCourse}</>
                                            )}
                                          </p>
                                          <div className="vote-count-badge secondary">
                                            <i className="fas fa-vote-yea me-1"></i>
                                            {candidate.voteCount} votes
                                          </div>
                                        </div>
                                      </div>
                                    </Col>
                                  ))}
                                </Row>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </Tab>

                  {/* Voters Tab */}
                  <Tab eventKey="voters" title="👥 Voters">
                    <div className="tab-content-container">
                      <Card>
                        <Card.Header>
                          <h6 className="mb-0">
                            <i className="fas fa-users me-2"></i>
                            Voters Who Participated ({electionData.voters.length})
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <div className="voters-table-container">
                            <Table responsive striped hover>
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Name</th>
                                  <th>Student ID</th>
                                  <th>Department</th>
                                  <th>Course</th>
                                  <th>Votes Cast</th>
                                  <th>Voted At</th>
                                </tr>
                              </thead>
                              <tbody>
                                {electionData.voters.map((voter, index) => (
                                  <tr key={voter.id}>
                                    <td>{index + 1}</td>
                                    <td className="fw-semibold">{voter.name}</td>
                                    <td><code>{voter.studentId}</code></td>
                                    <td>{voter.departmentName}</td>
                                    <td>{voter.courseName}</td>
                                    <td>
                                      <Badge bg="primary">{voter.votesCount}</Badge>
                                    </td>
                                    <td>
                                      <small>{formatDateTime(voter.firstVoteTime)}</small>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  </Tab>

                  {/* Analytics Tab */}
                  <Tab eventKey="analytics" title="📈 Analytics">
                    <div className="tab-content-container">
                      {/* Department Stats */}
                      <Card className="mb-4">
                        <Card.Header>
                          <h6 className="mb-0">
                            <i className="fas fa-building me-2"></i>
                            Department Participation
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <SimpleBarChart 
                            data={electionData.analytics.departmentStats} 
                            title="Participation Rate by Department"
                            xKey="departmentName"
                            yKey="participationRate"
                            color="#28a745"
                          />
                        </Card.Body>
                      </Card>

                      {/* Vote Distribution */}
                      <Card className="mb-4">
                        <Card.Header>
                          <h6 className="mb-0">
                            <i className="fas fa-clock me-2"></i>
                            Voting Patterns
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <SimplePieChart 
                            data={electionData.analytics.voteDistribution}
                            title="Votes by Time Period"
                            labelKey="timePeriod"
                            valueKey="voteCount"
                          />
                        </Card.Body>
                      </Card>

                      {/* Position Analytics */}
                      <Card>
                        <Card.Header>
                          <h6 className="mb-0">
                            <i className="fas fa-chart-bar me-2"></i>
                            Position Performance
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <Table responsive striped>
                            <thead>
                              <tr>
                                <th>Position</th>
                                <th>Candidates</th>
                                <th>Total Votes</th>
                                <th>Unique Voters</th>
                                <th>Avg Votes/Candidate</th>
                              </tr>
                            </thead>
                            <tbody>
                              {electionData.analytics.positionAnalytics.map((position) => (
                                <tr key={position.positionId}>
                                  <td className="fw-semibold">{position.positionName}</td>
                                  <td><Badge bg="info">{position.totalCandidates}</Badge></td>
                                  <td><Badge bg="success">{position.totalVotes}</Badge></td>
                                  <td><Badge bg="primary">{position.uniqueVoters}</Badge></td>
                                  <td>{position.avgVotesPerCandidate}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </div>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          ) : null}
        </Col>
      </Row>
    </div>
  );
};

export default BallotHistory; 