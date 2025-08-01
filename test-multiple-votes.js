// Test script for multiple vote functionality
import mysql from 'mysql2/promise';
import { VotingService } from './backend/services/VotingService.js';
import { ElectionModel } from './backend/models/ElectionModel.js';
import { VoteModel } from './backend/models/VoteModel.js';
import { VoterModel } from './backend/models/VoterModel.js';
import { PositionModel } from './backend/models/PositionModel.js';
import { CandidateModel } from './backend/models/CandidateModel.js';

// Database configuration
const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || 'root',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'voting_system',
  port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT) || 3306,
  charset: 'utf8mb4',
  timezone: '+00:00'
};

async function setupTestData() {
  console.log('🔧 Setting up test data...');
  const connection = await mysql.createConnection(dbConfig);

  try {
    // Create test election
    const electionId = 'E-TEST-001';
    await connection.execute(`
      INSERT INTO elections (id, title, description, startTime, endTime, status, created_by)
      VALUES (?, 'Test Election', 'Test Description', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 'active', 'superadmin-001')
      ON DUPLICATE KEY UPDATE status = 'active'
    `, [electionId]);
    console.log('✅ Test election created');

    // Create test positions with different vote limits
    const positions = [
      { id: 'pos-test-001', name: 'Test President', voteLimit: 1 },
      { id: 'pos-test-002', name: 'Test Senator', voteLimit: 8 }, // Changed to 8 votes
      { id: 'pos-test-003', name: 'Test Board Member', voteLimit: 2 }
    ];

    for (const pos of positions) {
      await connection.execute(`
        INSERT INTO positions (id, name, voteLimit, displayOrder)
        VALUES (?, ?, ?, 1)
        ON DUPLICATE KEY UPDATE name = ?, voteLimit = ?
      `, [pos.id, pos.name, pos.voteLimit, pos.name, pos.voteLimit]);
    }
    console.log('✅ Test positions created');

    // Create test candidates
    const candidates = [
      // President candidates (1 vote limit)
      { id: 'cand-test-001', name: 'President 1', positionId: 'pos-test-001' },
      { id: 'cand-test-002', name: 'President 2', positionId: 'pos-test-001' },
      // Senator candidates (8 vote limit)
      { id: 'cand-test-003', name: 'Senator 1', positionId: 'pos-test-002' },
      { id: 'cand-test-004', name: 'Senator 2', positionId: 'pos-test-002' },
      { id: 'cand-test-005', name: 'Senator 3', positionId: 'pos-test-002' },
      { id: 'cand-test-006', name: 'Senator 4', positionId: 'pos-test-002' },
      { id: 'cand-test-007', name: 'Senator 5', positionId: 'pos-test-002' },
      { id: 'cand-test-008', name: 'Senator 6', positionId: 'pos-test-002' },
      { id: 'cand-test-009', name: 'Senator 7', positionId: 'pos-test-002' },
      { id: 'cand-test-010', name: 'Senator 8', positionId: 'pos-test-002' },
      { id: 'cand-test-011', name: 'Senator 9', positionId: 'pos-test-002' }, // Extra candidate
      // Board Member candidates (2 vote limit)
      { id: 'cand-test-012', name: 'Board Member 1', positionId: 'pos-test-003' },
      { id: 'cand-test-013', name: 'Board Member 2', positionId: 'pos-test-003' },
      { id: 'cand-test-014', name: 'Board Member 3', positionId: 'pos-test-003' }
    ];

    for (const cand of candidates) {
      await connection.execute(`
        INSERT INTO candidates (id, name, positionId)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE name = ?
      `, [cand.id, cand.name, cand.positionId, cand.name]);
    }
    console.log('✅ Test candidates created');

    // Create test voter
    const voterId = 9999;
    await connection.execute(`
      INSERT INTO voters (id, name, email, studentId, hasVoted)
      VALUES (?, 'Test Voter', 'test.voter@test.com', 'TEST-001', 0)
      ON DUPLICATE KEY UPDATE hasVoted = 0
    `, [voterId]);
    console.log('✅ Test voter created');

    return {
      electionId,
      voterId,
      positions,
      candidates
    };
  } finally {
    await connection.end();
  }
}

async function cleanupTestData() {
  console.log('\n🧹 Cleaning up test data...');
  const connection = await mysql.createConnection(dbConfig);

  try {
    await connection.execute('DELETE FROM votes WHERE electionId LIKE "E-TEST-%"');
    await connection.execute('UPDATE voters SET hasVoted = 0 WHERE id = 9999');
    console.log('✅ Test data cleaned up');
  } finally {
    await connection.end();
  }
}

async function runTests() {
  console.log('🧪 Starting multiple vote tests...\n');
  let testData;

  try {
    // Setup test data
    testData = await setupTestData();

    // Test 1: Single vote for President (should succeed)
    console.log('\n📝 Test 1: Single vote for President');
    try {
      await VotingService.processVote({
        voterId: testData.voterId,
        candidateId: 'cand-test-001',
        positionId: 'pos-test-001',
        isLastVote: false
      });
      console.log('✅ Successfully cast single vote for President');
    } catch (error) {
      console.error('❌ Failed:', error.message);
      throw error;
    }

    // Test 2: Second vote for President (should fail)
    console.log('\n📝 Test 2: Second vote for President (should fail)');
    try {
      await VotingService.processVote({
        voterId: testData.voterId,
        candidateId: 'cand-test-002',
        positionId: 'pos-test-001',
        isLastVote: false
      });
      throw new Error('Should not allow second vote for President');
    } catch (error) {
      if (error.message.includes('maximum number of votes')) {
        console.log('✅ Correctly prevented second vote for President');
      } else {
        throw error;
      }
    }

    // Test 3: Multiple votes for Senator (should succeed up to 8 votes)
    console.log('\n📝 Test 3: Multiple votes for Senator (8 votes)');
    const senatorCandidates = [
      'cand-test-003', 'cand-test-004', 'cand-test-005', 'cand-test-006',
      'cand-test-007', 'cand-test-008', 'cand-test-009', 'cand-test-010'
    ];
    
    for (let i = 0; i < senatorCandidates.length; i++) {
      try {
        await VotingService.processVote({
          voterId: testData.voterId,
          candidateId: senatorCandidates[i],
          positionId: 'pos-test-002',
          isLastVote: false
        });
        console.log(`✅ Successfully cast vote ${i + 1}/8 for Senator`);
      } catch (error) {
        console.error(`❌ Failed to cast vote ${i + 1}/8 for Senator:`, error.message);
        throw error;
      }
    }

    // Test 4: Extra vote for Senator (should fail)
    console.log('\n📝 Test 4: Extra vote for Senator (should fail)');
    try {
      await VotingService.processVote({
        voterId: testData.voterId,
        candidateId: 'cand-test-011',
        positionId: 'pos-test-002',
        isLastVote: false
      });
      throw new Error('Should not allow ninth vote for Senator');
    } catch (error) {
      if (error.message.includes('maximum number of votes')) {
        console.log('✅ Correctly prevented extra vote for Senator');
      } else {
        throw error;
      }
    }

    // Test 5: Multiple votes for Board Member
    console.log('\n📝 Test 5: Multiple votes for Board Member');
    const boardMemberCandidates = ['cand-test-012', 'cand-test-013'];
    for (let i = 0; i < boardMemberCandidates.length; i++) {
      try {
        const isLast = i === boardMemberCandidates.length - 1;
        await VotingService.processVote({
          voterId: testData.voterId,
          candidateId: boardMemberCandidates[i],
          positionId: 'pos-test-003',
          isLastVote: isLast
        });
        console.log(`✅ Successfully cast vote ${i + 1}/2 for Board Member`);
      } catch (error) {
        console.error(`❌ Failed to cast vote ${i + 1}/2 for Board Member:`, error.message);
        throw error;
      }
    }

    // Test 6: Verify vote counts
    console.log('\n📝 Test 6: Verifying vote counts');
    const connection = await mysql.createConnection(dbConfig);
    try {
      const [results] = await connection.execute(`
        SELECT p.name as position, p.voteLimit, COUNT(*) as voteCount
        FROM votes v
        JOIN positions p ON v.positionId = p.id
        WHERE v.voterId = ? AND v.electionId = ?
        GROUP BY p.id, p.name, p.voteLimit
      `, [testData.voterId, 'E-TEST-001']);

      for (const row of results) {
        const isCorrect = row.voteCount <= row.voteLimit;
        console.log(`${isCorrect ? '✅' : '❌'} ${row.position}: ${row.voteCount}/${row.voteLimit} votes`);
        if (!isCorrect) {
          throw new Error(`Vote count exceeds limit for ${row.position}`);
        }
      }
    } finally {
      await connection.end();
    }

    // Test 7: Verify voter status
    console.log('\n📝 Test 7: Verifying voter status');
    const voter = await VoterModel.getById(testData.voterId);
    if (voter.hasVoted) {
      console.log('✅ Voter status correctly marked as voted');
    } else {
      throw new Error('Voter status not updated after final vote');
    }

    console.log('\n🎉 All tests passed successfully!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    throw error;
  } finally {
    // Clean up test data
    await cleanupTestData();
  }
}

// Run the tests
runTests().catch(console.error);