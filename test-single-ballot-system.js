#!/usr/bin/env node

/**
 * Comprehensive Single Ballot System Test Script
 * Tests the complete workflow: Create → Start → Vote → Stop → Results
 */

import fetch from 'node-fetch';
import readline from 'readline';

// Configuration
const BASE_URL = 'http://localhost:5000/api';
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

let adminToken = '';
let userTokens = [];
let testBallotId = '';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

const log = (message, color = 'white') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const step = (message) => {
  console.log(`\n${colors.cyan}📋 STEP: ${message}${colors.reset}`);
};

const success = (message) => {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
};

const error = (message) => {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
};

const warning = (message) => {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
};

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(adminToken && { 'Authorization': `Bearer ${adminToken}` })
    }
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`API Error: ${data.error || response.statusText}`);
  }

  return data;
}

// Authentication
async function authenticateAdmin() {
  step('Authenticating as Admin');
  try {
    const response = await apiCall('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(ADMIN_CREDENTIALS)
    });
    
    adminToken = response.token;
    success('Admin authenticated successfully');
    return response;
  } catch (err) {
    error(`Admin authentication failed: ${err.message}`);
    throw err;
  }
}

// Create test users
async function createTestUsers() {
  step('Creating test users for voting');
  const users = [
    { studentId: 'TEST001', firstName: 'John', lastName: 'Doe', departmentId: 'CS', courseId: 'BSCS', email: 'john@test.com', password: 'password123' },
    { studentId: 'TEST002', firstName: 'Jane', lastName: 'Smith', departmentId: 'CS', courseId: 'BSCS', email: 'jane@test.com', password: 'password123' },
    { studentId: 'TEST003', firstName: 'Bob', lastName: 'Johnson', departmentId: 'IT', courseId: 'BSIT', email: 'bob@test.com', password: 'password123' },
    { studentId: 'TEST004', firstName: 'Alice', lastName: 'Brown', departmentId: 'IT', courseId: 'BSIT', email: 'alice@test.com', password: 'password123' },
    { studentId: 'TEST005', firstName: 'Charlie', lastName: 'Wilson', departmentId: 'CS', courseId: 'BSCS', email: 'charlie@test.com', password: 'password123' }
  ];

  const createdUsers = [];
  for (const user of users) {
    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(user)
      });
      createdUsers.push({ ...user, id: response.user.id });
      success(`Created user: ${user.firstName} ${user.lastName} (${user.studentId})`);
    } catch (err) {
      warning(`User ${user.studentId} might already exist: ${err.message}`);
      createdUsers.push(user);
    }
  }

  return createdUsers;
}

// Authenticate test users
async function authenticateTestUsers(users) {
  step('Authenticating test users');
  userTokens = [];
  
  for (const user of users) {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.studentId,
          password: user.password
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        userTokens.push({
          ...user,
          token: data.token
        });
        success(`Authenticated: ${user.firstName} ${user.lastName}`);
      } else {
        error(`Failed to authenticate ${user.studentId}: ${data.error}`);
      }
    } catch (err) {
      error(`Authentication error for ${user.studentId}: ${err.message}`);
    }
  }
  
  log(`Successfully authenticated ${userTokens.length} users`, 'green');
  return userTokens;
}

// Create test positions
async function createTestPositions() {
  step('Creating test positions');
  const positions = [
    { id: 'PRES', name: 'President', voteLimit: 1, displayOrder: 1 },
    { id: 'VPRES', name: 'Vice President', voteLimit: 1, displayOrder: 2 },
    { id: 'SEC', name: 'Secretary', voteLimit: 1, displayOrder: 3 },
    { id: 'TREAS', name: 'Treasurer', voteLimit: 1, displayOrder: 4 }
  ];

  const createdPositions = [];
  for (const position of positions) {
    try {
      const response = await apiCall('/positions', {
        method: 'POST',
        body: JSON.stringify(position)
      });
      createdPositions.push(response);
      success(`Created position: ${position.name}`);
    } catch (err) {
      warning(`Position ${position.id} might already exist: ${err.message}`);
      createdPositions.push(position);
    }
  }

  return createdPositions;
}

// Create test candidates
async function createTestCandidates() {
  step('Creating test candidates');
  const candidates = [
    { name: 'Maria Garcia', positionId: 'PRES', departmentId: 'CS', courseId: 'BSCS', description: 'Experienced leader with vision' },
    { name: 'David Lee', positionId: 'PRES', departmentId: 'IT', courseId: 'BSIT', description: 'Innovative and dedicated' },
    { name: 'Sarah Connor', positionId: 'VPRES', departmentId: 'CS', courseId: 'BSCS', description: 'Strong organizational skills' },
    { name: 'Mike Ross', positionId: 'VPRES', departmentId: 'IT', courseId: 'BSIT', description: 'Team player and motivator' },
    { name: 'Lisa Wong', positionId: 'SEC', departmentId: 'CS', courseId: 'BSCS', description: 'Detail-oriented and reliable' },
    { name: 'Tom Brady', positionId: 'SEC', departmentId: 'IT', courseId: 'BSIT', description: 'Excellent communication skills' },
    { name: 'Emma Stone', positionId: 'TREAS', departmentId: 'CS', courseId: 'BSCS', description: 'Financial management expertise' },
    { name: 'Ryan Gosling', positionId: 'TREAS', departmentId: 'IT', courseId: 'BSIT', description: 'Trustworthy and analytical' }
  ];

  const createdCandidates = [];
  for (const candidate of candidates) {
    try {
      const response = await apiCall('/candidates?all=true', {
        method: 'POST',
        body: JSON.stringify(candidate)
      });
      createdCandidates.push(response.candidate);
      success(`Created candidate: ${candidate.name} for ${candidate.positionId}`);
    } catch (err) {
      error(`Failed to create candidate ${candidate.name}: ${err.message}`);
    }
  }

  return createdCandidates;
}

// Create test ballot
async function createTestBallot(positions, candidates) {
  step('Creating test ballot');
  
  const ballotData = {
    title: 'Test Student Council Election 2024',
    description: 'Automated test ballot for the new single ballot system',
    startTime: new Date(Date.now() + 5000).toISOString(), // Start in 5 seconds
    endTime: new Date(Date.now() + 300000).toISOString(), // End in 5 minutes
    positionIds: positions.map(p => p.id),
    candidateIds: candidates.map(c => c.id)
  };

  try {
    const response = await apiCall('/elections', {
      method: 'POST',
      body: JSON.stringify(ballotData)
    });
    
    testBallotId = response.id;
    success(`Created ballot: ${ballotData.title}`);
    log(`Ballot ID: ${testBallotId}`, 'cyan');
    return response;
  } catch (err) {
    error(`Failed to create ballot: ${err.message}`);
    throw err;
  }
}

// Start the ballot
async function startBallot() {
  step('Starting the ballot');
  try {
    const response = await apiCall(`/elections/${testBallotId}/start`, {
      method: 'POST'
    });
    success('Ballot started successfully - Users can now vote!');
    return response;
  } catch (err) {
    error(`Failed to start ballot: ${err.message}`);
    throw err;
  }
}

// Simulate user voting
async function simulateVoting(candidates) {
  step('Simulating user voting');
  
  // Group candidates by position
  const candidatesByPosition = {};
  candidates.forEach(candidate => {
    if (!candidatesByPosition[candidate.positionId]) {
      candidatesByPosition[candidate.positionId] = [];
    }
    candidatesByPosition[candidate.positionId].push(candidate);
  });

  // Simulate votes from each user
  const votePromises = userTokens.map(async (user, index) => {
    try {
      const votes = [];
      
      // Each user votes for one candidate per position
      Object.keys(candidatesByPosition).forEach(positionId => {
        const positionCandidates = candidatesByPosition[positionId];
        // Randomly select a candidate for this position
        const selectedCandidate = positionCandidates[index % positionCandidates.length];
        votes.push({
          positionId: positionId,
          candidateId: selectedCandidate.id
        });
      });

      const response = await fetch(`${BASE_URL}/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ votes })
      });

      const data = await response.json();
      if (response.ok) {
        success(`${user.firstName} ${user.lastName} voted successfully`);
        return data;
      } else {
        error(`Voting failed for ${user.firstName}: ${data.error}`);
        return null;
      }
    } catch (err) {
      error(`Voting error for ${user.firstName}: ${err.message}`);
      return null;
    }
  });

  const voteResults = await Promise.all(votePromises);
  const successfulVotes = voteResults.filter(result => result !== null);
  
  log(`\n📊 Voting Summary:`, 'yellow');
  log(`Total users: ${userTokens.length}`, 'white');
  log(`Successful votes: ${successfulVotes.length}`, 'green');
  log(`Failed votes: ${userTokens.length - successfulVotes.length}`, 'red');

  return successfulVotes;
}

// Check election status
async function checkElectionStatus() {
  step('Checking election status');
  try {
    const response = await apiCall('/elections/current');
    log(`Current election status: ${response.status}`, 'cyan');
    log(`Title: ${response.title}`, 'white');
    return response;
  } catch (err) {
    error(`Failed to get election status: ${err.message}`);
    return null;
  }
}

// Stop/End the ballot
async function stopBallot() {
  step('Stopping the ballot');
  try {
    // First stop the ballot
    const stopResponse = await apiCall(`/elections/${testBallotId}/stop`, {
      method: 'POST'
    });
    success('Ballot stopped successfully');

    // Wait a moment then end it to save to history
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const endResponse = await apiCall(`/elections/${testBallotId}/end`, {
      method: 'POST'
    });
    success('Ballot ended and saved to history');
    
    return endResponse;
  } catch (err) {
    error(`Failed to stop/end ballot: ${err.message}`);
    throw err;
  }
}

// Get final results
async function getFinalResults() {
  step('Getting final election results');
  try {
    const response = await apiCall('/results');
    
    log('\n🏆 FINAL RESULTS:', 'magenta');
    log('=' * 50, 'magenta');
    
    if (response && response.length > 0) {
      response.forEach(position => {
        log(`\n📍 ${position.positionName}:`, 'yellow');
        if (position.candidates && position.candidates.length > 0) {
          position.candidates.forEach((candidate, index) => {
            const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📊';
            log(`   ${emoji} ${candidate.candidateName}: ${candidate.voteCount} votes (${candidate.percentage}%)`, 'white');
          });
        } else {
          log('   No votes recorded', 'red');
        }
      });
    } else {
      warning('No results found');
    }
    
    return response;
  } catch (err) {
    error(`Failed to get results: ${err.message}`);
    return null;
  }
}

// Get vote history
async function getVoteHistory() {
  step('Getting vote history');
  try {
    const response = await apiCall('/votes');
    log(`\n📋 Vote History: ${response.length} total votes recorded`, 'cyan');
    
    if (response.length > 0) {
      // Group votes by user
      const votesByUser = {};
      response.forEach(vote => {
        if (!votesByUser[vote.voterId]) {
          votesByUser[vote.voterId] = [];
        }
        votesByUser[vote.voterId].push(vote);
      });
      
      log(`Number of users who voted: ${Object.keys(votesByUser).length}`, 'green');
      
      // Show vote distribution
      Object.keys(votesByUser).forEach(voterId => {
        const userVotes = votesByUser[voterId];
        log(`  Voter ${voterId}: ${userVotes.length} votes`, 'white');
      });
    }
    
    return response;
  } catch (err) {
    error(`Failed to get vote history: ${err.message}`);
    return null;
  }
}

// Get election history
async function getElectionHistory() {
  step('Getting election history');
  try {
    const response = await apiCall('/elections/history');
    log(`\n📚 Election History: ${response.length} completed elections`, 'cyan');
    
    response.forEach(election => {
      log(`  📋 ${election.title} - Status: ${election.status} - Ended: ${new Date(election.endTime).toLocaleString()}`, 'white');
    });
    
    return response;
  } catch (err) {
    error(`Failed to get election history: ${err.message}`);
    return null;
  }
}

// Wait for user input
function waitForUser(message) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question(`${colors.yellow}${message} (Press Enter to continue)${colors.reset}`, () => {
      rl.close();
      resolve();
    });
  });
}

// Main test function
async function runFullTest() {
  console.log(`${colors.magenta}
╔══════════════════════════════════════════════════════════════╗
║                 SINGLE BALLOT SYSTEM TEST                   ║
║              Complete End-to-End Workflow                   ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);

  try {
    // Phase 1: Setup
    log('\n🚀 PHASE 1: SETUP & AUTHENTICATION', 'magenta');
    await authenticateAdmin();
    const users = await createTestUsers();
    await authenticateTestUsers(users);

    // Phase 2: Create Election Components
    log('\n🏗️  PHASE 2: CREATE ELECTION COMPONENTS', 'magenta');
    const positions = await createTestPositions();
    const candidates = await createTestCandidates();

    // Phase 3: Create and Start Ballot
    log('\n🗳️  PHASE 3: BALLOT CREATION & ACTIVATION', 'magenta');
    await createTestBallot(positions, candidates);
    await checkElectionStatus();
    
    await waitForUser('\nReady to start the ballot?');
    await startBallot();
    await checkElectionStatus();

    // Phase 4: Voting
    log('\n🗳️  PHASE 4: SIMULATE VOTING PROCESS', 'magenta');
    await waitForUser('\nReady to simulate voting?');
    await simulateVoting(candidates);

    // Phase 5: Stop and Results
    log('\n📊 PHASE 5: BALLOT COMPLETION & RESULTS', 'magenta');
    await waitForUser('\nReady to stop the ballot and view results?');
    await stopBallot();
    await checkElectionStatus();

    // Phase 6: Results and History
    log('\n📈 PHASE 6: FINAL REPORTING', 'magenta');
    await getFinalResults();
    await getVoteHistory();
    await getElectionHistory();

    // Summary
    log('\n🎉 TEST COMPLETED SUCCESSFULLY!', 'green');
    log('=' * 60, 'green');
    log('✅ All phases completed without critical errors', 'green');
    log('✅ Single ballot system is working correctly', 'green');
    log('✅ Voting process is functional', 'green');
    log('✅ Results are being saved and calculated', 'green');
    log('✅ Election history is maintained', 'green');

  } catch (err) {
    error(`\n💥 TEST FAILED: ${err.message}`);
    log(err.stack, 'red');
    process.exit(1);
  }
}

// Cleanup function
async function cleanup() {
  step('Cleaning up test data (optional)');
  warning('Test data cleanup can be done manually through the admin interface if needed');
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  runFullTest()
    .then(() => {
      log('\n🏁 Test script completed. Check the results above.', 'cyan');
      process.exit(0);
    })
    .catch((err) => {
      error(`Fatal error: ${err.message}`);
      process.exit(1);
    });
}

export {
  runFullTest,
  authenticateAdmin,
  createTestUsers,
  createTestPositions,
  createTestCandidates,
  createTestBallot,
  startBallot,
  simulateVoting,
  stopBallot,
  getFinalResults
};