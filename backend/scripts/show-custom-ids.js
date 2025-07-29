import { createConnection } from "../config/database.js";

async function showCustomIDs() {
  const db = createConnection();
  
  try {
    console.log('📊 PROPOSED CUSTOM ID PATTERNS');
    console.log('================================');
    
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
    
    console.log('\n🚀 PROPOSED CUSTOM ID PATTERNS:');
    console.log('================================');
    
    console.log('\n📋 Elections (Proposed):');
    console.log('  Pattern: id VARCHAR(20) PRIMARY KEY (Custom format)');
    console.log('  Format: "ELEC-{auto_increment_number}"');
    console.log('  Examples:');
    console.log('    1. ID: "ELEC-1" → Title: "Student Council Election 2024"');
    console.log('    2. ID: "ELEC-2" → Title: "Department Representative Election"');
    console.log('    3. ID: "ELEC-3" → Title: "Class President Election"');
    console.log('    4. ID: "ELEC-4" → Title: "TestFromLaptop"');
    console.log('    5. ID: "ELEC-5" → Title: "Test"');
    
    console.log('\n📋 Election Positions (Proposed):');
    console.log('  Pattern: id VARCHAR(20) PRIMARY KEY (Custom format)');
    console.log('  Format: "ELEC-POS-{auto_increment_number}"');
    console.log('  Examples:');
    console.log('    1. ID: "ELEC-POS-1" → ElectionID: "ELEC-1" → PositionID: "pos-001"');
    console.log('    2. ID: "ELEC-POS-2" → ElectionID: "ELEC-2" → PositionID: "pos-001"');
    console.log('    3. ID: "ELEC-POS-3" → ElectionID: "ELEC-1" → PositionID: "pos-002"');
    console.log('    4. ID: "ELEC-POS-4" → ElectionID: "ELEC-3" → PositionID: "president-001"');
    
    console.log('\n📋 Election Candidates (Proposed):');
    console.log('  Pattern: id VARCHAR(20) PRIMARY KEY (Custom format)');
    console.log('  Format: "ELEC-CAND-{auto_increment_number}"');
    console.log('  Examples:');
    console.log('    1. ID: "ELEC-CAND-1" → ElectionID: "ELEC-2" → CandidateID: "cand-001"');
    console.log('    2. ID: "ELEC-CAND-2" → ElectionID: "ELEC-1" → CandidateID: "cand-002"');
    console.log('    3. ID: "ELEC-CAND-3" → ElectionID: "ELEC-3" → CandidateID: "cand-003"');
    console.log('    4. ID: "ELEC-CAND-4" → ElectionID: "ELEC-1" → CandidateID: "cand-004"');
    
    console.log('\n📋 Votes (Proposed):');
    console.log('  Pattern: id VARCHAR(20) PRIMARY KEY (Custom format)');
    console.log('  Format: "VOTE-{auto_increment_number}"');
    console.log('  Examples:');
    console.log('    1. ID: "VOTE-1" → ElectionID: "ELEC-1" → VoterID: 1');
    console.log('    2. ID: "VOTE-2" → ElectionID: "ELEC-1" → VoterID: 2');
    console.log('    3. ID: "VOTE-3" → ElectionID: "ELEC-2" → VoterID: 3');
    console.log('    4. ID: "VOTE-4" → ElectionID: "ELEC-1" → VoterID: 4');
    
    console.log('\n📊 ID COMPARISON SUMMARY:');
    console.log('========================');
    console.log('CURRENT (UUID):');
    console.log('  Elections: "8e17845a-ffb5-42cf-9aa7-422fa12d0677"');
    console.log('  Election Positions: "1862c392-eab3-4681-abd6-7ce3ee036bf4"');
    console.log('  Election Candidates: "05dcf643-1957-43af-b7a8-3caff42295b7"');
    console.log('  Votes: "vote-uuid-format"');
    
    console.log('\nPROPOSED (Custom Identifiable):');
    console.log('  Elections: "ELEC-1", "ELEC-2", "ELEC-3"...');
    console.log('  Election Positions: "ELEC-POS-1", "ELEC-POS-2", "ELEC-POS-3"...');
    console.log('  Election Candidates: "ELEC-CAND-1", "ELEC-CAND-2", "ELEC-CAND-3"...');
    console.log('  Votes: "VOTE-1", "VOTE-2", "VOTE-3"...');
    
    console.log('\n✅ BENEFITS:');
    console.log('  • Easy to identify table type from ID');
    console.log('  • Human-readable and memorable');
    console.log('  • Better debugging and tracking');
    console.log('  • Consistent naming convention');
    console.log('  • Maintains referential integrity');
    
    console.log('\n🔧 IMPLEMENTATION DETAILS:');
    console.log('  • Elections: VARCHAR(20) with "ELEC-" prefix');
    console.log('  • Election Positions: VARCHAR(20) with "ELEC-POS-" prefix');
    console.log('  • Election Candidates: VARCHAR(20) with "ELEC-CAND-" prefix');
    console.log('  • Votes: VARCHAR(20) with "VOTE-" prefix');
    console.log('  • Auto-increment logic in application layer');
    console.log('  • Foreign key references updated accordingly');
    
  } catch (error) {
    console.error('❌ Error showing custom IDs:', error);
  } finally {
    db.end();
  }
}

// Run the analysis
showCustomIDs(); 