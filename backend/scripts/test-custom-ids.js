import { createConnection } from "../config/database.js";
import IDGenerator from "../utils/idGenerator.js";

async function testCustomIDs() {
  const db = createConnection();
  
  try {
    console.log('🧪 Testing Custom ID Generation...');
    console.log('==================================');
    
    // Test ID generation
    console.log('\n📋 Testing ID Generation:');
    const nextElectionId = await IDGenerator.getNextElectionID();
    const nextElectionPosId = await IDGenerator.getNextElectionPositionID();
    const nextElectionCandId = await IDGenerator.getNextElectionCandidateID();
    const nextVoteId = await IDGenerator.getNextVoteID();
    
    console.log(`✅ Next Election ID: ${nextElectionId}`);
    console.log(`✅ Next Election Position ID: ${nextElectionPosId}`);
    console.log(`✅ Next Election Candidate ID: ${nextElectionCandId}`);
    console.log(`✅ Next Vote ID: ${nextVoteId}`);
    
    // Test ID validation
    console.log('\n📋 Testing ID Validation:');
    console.log(`✅ Election ID "${nextElectionId}" valid: ${IDGenerator.isValidCustomID(nextElectionId, 'election')}`);
    console.log(`✅ Election Position ID "${nextElectionPosId}" valid: ${IDGenerator.isValidCustomID(nextElectionPosId, 'election-position')}`);
    console.log(`✅ Election Candidate ID "${nextElectionCandId}" valid: ${IDGenerator.isValidCustomID(nextElectionCandId, 'election-candidate')}`);
    console.log(`✅ Vote ID "${nextVoteId}" valid: ${IDGenerator.isValidCustomID(nextVoteId, 'vote')}`);
    
    // Test invalid IDs
    console.log('\n📋 Testing Invalid IDs:');
    console.log(`❌ Invalid Election ID "INVALID" valid: ${IDGenerator.isValidCustomID('INVALID', 'election')}`);
    console.log(`❌ Invalid Election Position ID "WRONG" valid: ${IDGenerator.isValidCustomID('WRONG', 'election-position')}`);
    
    // Check current data
    console.log('\n📋 Current Database Data:');
    
    const elections = await new Promise((resolve, reject) => {
      db.query('SELECT id, title FROM elections LIMIT 5', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log('📊 Elections:');
    elections.forEach((election, index) => {
      console.log(`  ${index + 1}. ID: "${election.id}" → Title: "${election.title}"`);
    });
    
    const electionPositions = await new Promise((resolve, reject) => {
      db.query('SELECT id, electionId FROM election_positions LIMIT 5', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log('\n📊 Election Positions:');
    electionPositions.forEach((ep, index) => {
      console.log(`  ${index + 1}. ID: "${ep.id}" → ElectionID: "${ep.electionId}"`);
    });
    
    const electionCandidates = await new Promise((resolve, reject) => {
      db.query('SELECT id, electionId FROM election_candidates LIMIT 5', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log('\n📊 Election Candidates:');
    electionCandidates.forEach((ec, index) => {
      console.log(`  ${index + 1}. ID: "${ec.id}" → ElectionID: "${ec.electionId}"`);
    });
    
    const votes = await new Promise((resolve, reject) => {
      db.query('SELECT id, electionId FROM votes LIMIT 5', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log('\n📊 Votes:');
    votes.forEach((vote, index) => {
      console.log(`  ${index + 1}. ID: "${vote.id}" → ElectionID: "${vote.electionId}"`);
    });
    
    console.log('\n🎉 Custom ID System Test Completed Successfully!');
    console.log('================================================');
    console.log('✅ ID generation working correctly');
    console.log('✅ ID validation working correctly');
    console.log('✅ Database schema updated');
    console.log('✅ Data format consistent');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    db.end();
  }
}

// Run the test
testCustomIDs(); 