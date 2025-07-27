import React, { useState, useEffect } from 'react';
import { getPositions, getCandidates, getVoters, getVotes } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    positions: 0,
    candidates: 0,
    voters: 0,
    votes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [positions, candidates, voters, votes] = await Promise.all([
          getPositions(),
          getCandidates(),
          getVoters(),
          getVotes()
        ]);

        setStats({
          positions: positions.length,
          candidates: candidates.length,
          voters: voters.length,
          votes: votes.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Dashboard</h1>
        <p className="lead">
          Welcome to the administrative panel. Monitor and manage your system from here.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card countdown-card">
            <div className="card-body">
              <div className="display-4">{stats.positions}</div>
              <div className="text-muted">Total Positions</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card countdown-card">
            <div className="card-body">
              <div className="display-4">{stats.candidates}</div>
              <div className="text-muted">Total Candidates</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card countdown-card">
            <div className="card-body">
              <div className="display-4">{stats.voters}</div>
              <div className="text-muted">Registered Voters</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card countdown-card">
            <div className="card-body">
              <div className="display-4">{stats.votes}</div>
              <div className="text-muted">Total Votes Cast</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card feature-card">
            <div className="card-body">
              <h5 className="card-title">
                Manage Positions
              </h5>
              <p className="card-text">
                Create and manage voting positions. Add new positions, edit existing ones, and remove outdated positions.
              </p>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">• Create new positions</li>
                <li className="list-group-item">• Edit position details</li>
                <li className="list-group-item">• Delete positions</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card feature-card">
            <div className="card-body">
              <h5 className="card-title">
                Manage Candidates
              </h5>
              <p className="card-text">
                Add candidates to positions, manage their information, and track their performance.
              </p>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">• Add candidates</li>
                <li className="list-group-item">• Update candidate info</li>
                <li className="list-group-item">• Remove candidates</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card feature-card">
            <div className="card-body">
              <h5 className="card-title">
                View Results
              </h5>
              <p className="card-text">
                Monitor voting progress and view real-time results. Track voter participation and candidate performance.
              </p>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">• Real-time results</li>
                <li className="list-group-item">• Voter statistics</li>
                <li className="list-group-item">• Performance analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="announcement-card">
            <h3>Quick Actions</h3>
            <div className="row">
              <div className="col-md-3 mb-2">
                <button className="btn btn-custom-blue w-100">Add Position</button>
              </div>
              <div className="col-md-3 mb-2">
                <button className="btn btn-custom-blue w-100">Add Candidate</button>
              </div>
              <div className="col-md-3 mb-2">
                <button className="btn btn-custom-orange w-100">View Results</button>
              </div>
              <div className="col-md-3 mb-2">
                <button className="btn btn-custom-blue w-100">Export Data</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 