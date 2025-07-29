import { createConnection } from "../config/database.js";

async function showProposedIDs() {
  const db = createConnection();
  
  try {
    console.log('📊 PROPOSED AUTO-INCREMENT ID PATTERNS');
    console.log('=====================================');
    
    // Show current data structure
    console.log('\n🔍 CURRENT DATA EXAMPLES:');
    console.log('------------------------');
    
    // Check elections
    const elections = await new Promise((resolve, reject) => {
      db.query('SELECT id, title FROM elections LIMIT 3', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log('📋 Elections (Current):');
    elections.forEach((election, index) => {
      console.log(`  ${index + 1}. ID: "${election.id}" → Title: "${election.title}"`);
    });
    
    // Check election_positions
    const electionPositions = await new Promise((resolve, reject) => {
      db.query('SELECT id, electionId, positionId FROM election_positions LIMIT 3', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log('\n📋 Election Positions (Current):');
    electionPositions.forEach((ep, index) => {
      console.log(`  ${index + 1}. ID: "${ep.id}" → ElectionID: "${ep.electionId}" → PositionID: "${ep.positionId}"`);
    });
    
    // Check election_candidates
    const electionCandidates = await new Promise((resolve, reject) => {
      db.query('SELECT id, electionId, candidateId FROM election_candidates LIMIT 3', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log('\n📋 Election Candidates (Current):');
    electionCandidates.forEach((ec, index) => {
      console.log(`  ${index + 1}. ID: "${ec.id}" → ElectionID: "${ec.electionId}" → CandidateID: "${ec.candidateId}"`);
    });
    
    // Check votes
    const votes = await new Promise((resolve, reject) => {
      db.query('SELECT id, electionId, voterId FROM votes LIMIT 3', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log('\n📋 Votes (Current):');
    votes.forEach((vote, index) => {
      console.log(`  ${index + 1}. ID: "${vote.id}" → ElectionID: "${vote.electionId}" → VoterID: ${vote.voterId}`);
    });
    
    console.log('\n🚀 PROPOSED AUTO-INCREMENT ID PATTERNS:');
    console.log('=====================================');
    
    console.log('\n📋 Elections (Proposed):');
    console.log('  Pattern: id INT AUTO_INCREMENT PRIMARY KEY');
    console.log('  Examples:');
    console.log('    1. ID: 1 → Title: "Student Council Election 2024"');
    console.log('    2. ID: 2 → Title: "Department Representative Election"');
    console.log('    3. ID: 3 → Title: "Class President Election"');
    
    console.log('\n📋 Election Positions (Proposed):');
    console.log('  Pattern: id INT AUTO_INCREMENT PRIMARY KEY');
    console.log('  Examples:');
    console.log('    1. ID: 1 → ElectionID: 1 → PositionID: "president-001"');
    console.log('    2. ID: 2 → ElectionID: 1 → PositionID: "vice-president-001"');
    console.log('    3. ID: 3 → ElectionID: 2 → PositionID: "secretary-001"');
    
    console.log('\n📋 Election Candidates (Proposed):');
    console.log('  Pattern: id INT AUTO_INCREMENT PRIMARY KEY');
    console.log('  Examples:');
    console.log('    1. ID: 1 → ElectionID: 1 → CandidateID: "candidate-001"');
    console.log('    2. ID: 2 → ElectionID: 1 → CandidateID: "candidate-002"');
    console.log('    3. ID: 3 → ElectionID: 2 → CandidateID: "candidate-003"');
    
    console.log('\n📋 Votes (Proposed):');
    console.log('  Pattern: id INT AUTO_INCREMENT PRIMARY KEY');
    console.log('  Examples:');
    console.log('    1. ID: 1 → ElectionID: 1 → VoterID: 1');
    console.log('    2. ID: 2 → ElectionID: 1 → VoterID: 2');
    console.log('    3. ID: 3 → ElectionID: 2 → VoterID: 3');
    
    console.log('\n📊 ID COMPARISON SUMMARY:');
    console.log('========================');
    console.log('CURRENT (UUID):');
    console.log('  Elections: "election-001", "election-002", "election-003"');
    console.log('  Election Positions: "ep-001", "ep-002", "ep-003"');
    console.log('  Election Candidates: "ec-001", "ec-002", "ec-003"');
    console.log('  Votes: "vote-001", "vote-002", "vote-003"');
    
    console.log('\nPROPOSED (Auto-Increment):');
    console.log('  Elections: 1, 2, 3, 4, 5...');
    console.log('  Election Positions: 1, 2, 3, 4, 5...');
    console.log('  Election Candidates: 1, 2, 3, 4, 5...');
    console.log('  Votes: 1, 2, 3, 4, 5...');
    
    console.log('\n✅ BENEFITS:');
    console.log('  • Simpler ID management');
    console.log('  • Better performance (INT vs VARCHAR)');
    console.log('  • Easier debugging and tracking');
    console.log('  • Consistent with database best practices');
    
  } catch (error) {
    console.error('❌ Error showing proposed IDs:', error);
  } finally {
    db.end();
  }
}

// Run the analysis
showProposedIDs(); 