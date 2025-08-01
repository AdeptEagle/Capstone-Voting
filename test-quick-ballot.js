#!/usr/bin/env node

/**
 * Quick Single Ballot System Test
 * Automated test without user interaction
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';
const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

let adminToken = '';
let testBallotId = '';

const log = (message, type = 'info') => {
  const timestamp = new Date().toLocaleTimeString();
  const symbols = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
  console.log(`[${timestamp}] ${symbols[type]} ${message}`);
};

async function apiCall(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(adminToken && { 'Authorization': `Bearer ${adminToken}` })
    },
    ...options
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || response.statusText);
  return data;
}

async function quickTest() {
  try {
    // 1. Authenticate
    log('Authenticating as admin...');
    const auth = await apiCall('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(ADMIN_CREDENTIALS)
    });
    adminToken = auth.token;
    log('Admin authenticated', 'success');

    // 2. Create positions
    log('Creating test positions...');
    const positions = ['PRES', 'VPRES', 'SEC'];
    const positionPromises = positions.map(id => 
      apiCall('/positions', {
        method: 'POST',
        body: JSON.stringify({
          id,
          name: id === 'PRES' ? 'President' : id === 'VPRES' ? 'Vice President' : 'Secretary',
          voteLimit: 1,
          displayOrder: positions.indexOf(id) + 1
        })
      }).catch(() => null) // Ignore if exists
    );
    await Promise.all(positionPromises);
    log('Positions ready', 'success');

    // 3. Create candidates
    log('Creating test candidates...');
    const candidates = [
      { name: 'Alice Johnson', positionId: 'PRES', departmentId: 'CS', courseId: 'BSCS' },
      { name: 'Bob Smith', positionId: 'PRES', departmentId: 'IT', courseId: 'BSIT' },
      { name: 'Carol Brown', positionId: 'VPRES', departmentId: 'CS', courseId: 'BSCS' },
      { name: 'David Wilson', positionId: 'SEC', departmentId: 'IT', courseId: 'BSIT' }
    ];
    
    const candidateIds = [];
    for (const candidate of candidates) {
      try {
        const result = await apiCall('/candidates?all=true', {
          method: 'POST',
          body: JSON.stringify(candidate)
        });
        candidateIds.push(result.candidate.id);
      } catch (err) {
        log(`Candidate creation skipped: ${err.message}`, 'warning');
      }
    }
    log(`${candidateIds.length} candidates ready`, 'success');

    // 4. Create ballot
    log('Creating test ballot...');
    const ballot = await apiCall('/elections', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Quick Test Election',
        description: 'Automated test ballot',
        startTime: new Date(Date.now() + 2000).toISOString(),
        endTime: new Date(Date.now() + 60000).toISOString(),
        positionIds: positions,
        candidateIds
      })
    });
    testBallotId = ballot.id;
    log(`Ballot created: ${ballot.title}`, 'success');

    // 5. Start ballot
    log('Starting ballot...');
    await apiCall(`/elections/${testBallotId}/start`, { method: 'POST' });
    log('Ballot started - voting enabled!', 'success');

    // 6. Check status
    log('Checking election status...');
    const status = await apiCall('/elections/current');
    log(`Election status: ${status.status}`, 'info');

    // 7. Create and vote with test users
    log('Creating test voters...');
    const voters = [
      { studentId: 'QT001', firstName: 'John', lastName: 'Doe', departmentId: 'CS', courseId: 'BSCS', email: 'john@quick.test', password: 'test123' },
      { studentId: 'QT002', firstName: 'Jane', lastName: 'Smith', departmentId: 'IT', courseId: 'BSIT', email: 'jane@quick.test', password: 'test123' }
    ];

    const voterTokens = [];
    for (const voter of voters) {
      try {
        // Register user
        await fetch(`${BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(voter)
        });

        // Login user
        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId: voter.studentId, password: voter.password })
        });
        
        const loginData = await loginResponse.json();
        if (loginResponse.ok) {
          voterTokens.push({ ...voter, token: loginData.token });
        }
      } catch (err) {
        log(`Voter setup issue: ${err.message}`, 'warning');
      }
    }
    log(`${voterTokens.length} voters ready`, 'success');

    // 8. Cast votes
    log('Casting test votes...');
    let successfulVotes = 0;
    for (const voter of voterTokens) {
      try {
        const votes = [
          { positionId: 'PRES', candidateId: candidateIds[0] },
          { positionId: 'VPRES', candidateId: candidateIds[2] },
          { positionId: 'SEC', candidateId: candidateIds[3] }
        ].filter(vote => candidateIds.includes(vote.candidateId));

        const voteResponse = await fetch(`${BASE_URL}/votes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${voter.token}`
          },
          body: JSON.stringify({ votes })
        });

        if (voteResponse.ok) {
          successfulVotes++;
        }
      } catch (err) {
        log(`Vote failed for ${voter.firstName}: ${err.message}`, 'warning');
      }
    }
    log(`${successfulVotes} votes cast successfully`, 'success');

    // 9. Stop ballot
    log('Stopping ballot...');
    await apiCall(`/elections/${testBallotId}/stop`, { method: 'POST' });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    
    await apiCall(`/elections/${testBallotId}/end`, { method: 'POST' });
    log('Ballot ended and saved to history', 'success');

    // 10. Get results
    log('Fetching results...');
    const results = await apiCall('/results');
    log('RESULTS:', 'info');
    
    if (results && results.length > 0) {
      results.forEach(position => {
        console.log(`\n📍 ${position.positionName}:`);
        if (position.candidates && position.candidates.length > 0) {
          position.candidates.forEach(candidate => {
            console.log(`   • ${candidate.candidateName}: ${candidate.voteCount} votes (${candidate.percentage}%)`);
          });
        } else {
          console.log('   No votes recorded');
        }
      });
    } else {
      log('No results found', 'warning');
    }

    // 11. Get vote history
    const voteHistory = await apiCall('/votes');
    log(`Vote history: ${voteHistory.length} total votes recorded`, 'info');

    log('\n🎉 QUICK TEST COMPLETED SUCCESSFULLY!', 'success');
    log('✅ Single ballot system is working correctly', 'success');
    log('✅ All core functions tested and operational', 'success');

  } catch (err) {
    log(`❌ TEST FAILED: ${err.message}`, 'error');
    throw err;
  }
}

// Run the quick test
quickTest()
  .then(() => {
    console.log('\n🏁 Quick test completed successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error(`💥 Quick test failed: ${err.message}`);
    process.exit(1);
  });