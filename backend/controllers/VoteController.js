import { VotingService } from "../services/VotingService.js";
import { createConnection } from "../config/database.js";

export class VoteController {

  static async createVote(req, res) {
    try {
      const voteData = req.body;
      const result = await VotingService.processVote(voteData);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async createMultipleVotes(req, res) {
    try {
      const voteData = req.body;
      const result = await VotingService.processMultipleVotes(voteData);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // ✅ UPDATE: Improved multiple votes handler with better validation
  static async handleMultipleVotesArray(req, res) {
    const { votes } = req.body;
    const voterId = req.user?.id || req.body.voterId;
    
    if (!votes || !Array.isArray(votes)) {
      return res.status(400).json({ error: 'Invalid votes data' });
    }

    const db = createConnection();
    
    try {
      await new Promise((resolve, reject) => {
        db.query('START TRANSACTION', (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      const results = [];
      const errors = [];
      const processedVotes = []; // Track votes in this transaction

      // Sort votes by position to make debugging easier
      const sortedVotes = votes.sort((a, b) => a.positionId.localeCompare(b.positionId));

      for (let i = 0; i < sortedVotes.length; i++) {
        const vote = sortedVotes[i];
        const { electionId, positionId, candidateId } = vote;
        
        try {
          console.log(`Processing vote ${i + 1}/${sortedVotes.length}: Position ${positionId}, Candidate ${candidateId}`);
          console.log(`   Current processed votes in transaction: ${processedVotes.length}`);
          
          // Check if this vote already exists in database
          const existingVote = await new Promise((resolve, reject) => {
            const query = 'SELECT id FROM votes WHERE voterId = ? AND electionId = ? AND positionId = ? AND candidateId = ?';
            db.query(query, [voterId, electionId, positionId, candidateId], (err, result) => {
              if (err) reject(err);
              else resolve(result);
            });
          });
          
          if (existingVote.length > 0) {
            console.log(`   ⚠️ Vote already exists in database:`, existingVote[0]);
            errors.push({
              success: false,
              electionId,
              positionId,
              candidateId,
              error: 'You have already voted for this candidate in this position'
            });
            continue;
          }
          
          // Validate with current transaction context
          const validation = await VotingService.validateVoteForPosition(
            voterId, 
            electionId, 
            positionId, 
            candidateId, 
            processedVotes
          );
          
          console.log(`   Validation result:`, validation);
          
          if (validation.valid) {
            // Generate unique vote ID
            const IDGenerator = await import('../utils/idGenerator.js');
            const voteId = await IDGenerator.default.getNextVoteID();
            
            console.log(`   Inserting vote with ID: ${voteId}`);
            
            await new Promise((resolve, reject) => {
              const query = 'INSERT INTO votes (id, electionId, positionId, candidateId, voterId) VALUES (?, ?, ?, ?, ?)';
              db.query(query, [voteId, electionId, positionId, candidateId, voterId], (err) => {
                if (err) {
                  console.error(`   ❌ Database error:`, err.message);
                  reject(err);
                } else {
                  console.log(`   ✅ Vote inserted successfully`);
                  resolve();
                }
              });
            });
            
            // Add to processed votes for next validations
            processedVotes.push({ electionId, positionId, candidateId });
            
            results.push({
              success: true,
              voteId,
              electionId,
              positionId,
              candidateId,
              currentVotes: validation.currentVotes,
              transactionVotes: validation.transactionVotes,
              totalAfter: validation.totalAfter,
              limit: validation.limit
            });
            
            console.log(`✅ Vote successful: ${validation.totalAfter}/${validation.limit} for position ${positionId}`);
          }
        } catch (error) {
          console.error(`❌ Vote failed for position ${positionId}:`, error.message);
          console.error(`   Error details:`, error);
          errors.push({
            success: false,
            electionId,
            positionId,
            candidateId,
            error: error.message
          });
        }
      }

      // If there are any errors, rollback the transaction
      if (errors.length > 0) {
        await new Promise((resolve) => {
          db.query('ROLLBACK', () => resolve());
        });
        console.log(`Rolling back transaction. ${results.length} succeeded, ${errors.length} failed.`);
        return res.status(400).json({ 
          error: 'Some votes failed',
          results,
          errors,
          summary: {
            total: votes.length,
            successful: results.length,
            failed: errors.length
          }
        });
      }

      // Commit the transaction if all votes succeeded
      await new Promise((resolve, reject) => {
        db.query('COMMIT', (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      // Update voter's hasVoted status
      await new Promise((resolve, reject) => {
        const query = 'UPDATE voters SET hasVoted = TRUE WHERE id = ?';
        db.query(query, [voterId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      console.log(`✅ All ${results.length} votes committed successfully`);

      res.json({ 
        success: true,
        message: `All ${results.length} votes cast successfully`,
        results,
        summary: {
          total: votes.length,
          successful: results.length,
          failed: 0
        }
      });

    } catch (error) {
      await new Promise((resolve) => {
        db.query('ROLLBACK', () => resolve());
      });
      console.error('Error processing multiple votes:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    } finally {
      db.end();
    }
  }

  // NEW: Get voter's current votes for an election
  static async getVoterVotes(req, res) {
    try {
      const { electionId } = req.params;
      const voterId = req.user?.id || req.body.voterId; // Support both authenticated and direct access
      
      const db = createConnection();
      
      try {
        const votes = await new Promise((resolve, reject) => {
          const query = `
            SELECT v.*, p.name as positionName, c.name as candidateName, pos.voteLimit
            FROM votes v
            JOIN positions p ON v.positionId = p.id
            JOIN candidates c ON v.candidateId = c.id
            JOIN positions pos ON v.positionId = pos.id
            WHERE v.voterId = ? AND v.electionId = ?
            ORDER BY p.displayOrder, c.name
          `;
          db.query(query, [voterId, electionId], (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        });

        // Group votes by position
        const votesByPosition = {};
        votes.forEach(vote => {
          if (!votesByPosition[vote.positionId]) {
            votesByPosition[vote.positionId] = {
              positionName: vote.positionName,
              voteLimit: vote.voteLimit,
              votes: []
            };
          }
          votesByPosition[vote.positionId].votes.push({
            candidateId: vote.candidateId,
            candidateName: vote.candidateName,
            voteId: vote.id
          });
        });

        res.json({ 
          success: true,
          votesByPosition,
          totalVotes: votes.length
        });

      } finally {
        db.end();
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // NEW: Check if voter can vote for a specific position
  static async checkVotingEligibility(req, res) {
    try {
      const { electionId, positionId } = req.params;
      const voterId = req.user?.id || req.body.voterId;
      
      const db = createConnection();
      
      try {
        // Get position vote limit
        const positionResult = await new Promise((resolve, reject) => {
          const query = 'SELECT voteLimit FROM positions WHERE id = ?';
          db.query(query, [positionId], (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        });
        
        if (positionResult.length === 0) {
          return res.status(404).json({ error: 'Position not found' });
        }
        
        const voteLimit = positionResult[0].voteLimit;
        
        // Check current vote count for this voter and position
        const currentVotes = await new Promise((resolve, reject) => {
          const query = 'SELECT COUNT(*) as count FROM votes WHERE voterId = ? AND electionId = ? AND positionId = ?';
          db.query(query, [voterId, electionId, positionId], (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        });
        
        const currentVoteCount = currentVotes[0].count;
        const canVote = currentVoteCount < voteLimit;
        const remainingVotes = voteLimit - currentVoteCount;

        res.json({ 
          success: true,
          canVote,
          currentVotes: currentVoteCount,
          voteLimit,
          remainingVotes
        });

      } finally {
        db.end();
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // NEW: Get voting status for a position
  static async getVotingStatus(req, res) {
    try {
      const { electionId, positionId } = req.params;
      const voterId = req.user.id; // Get from authenticated user
      
      // Get position details
      const position = await VotingService.getPositionById(positionId);
      if (!position) {
        return res.status(404).json({ error: 'Position not found' });
      }
      
      // Get voter's current votes for this position
      const currentVotes = await VotingService.getVoterVotesForPosition(voterId, electionId, positionId);
      
      // Calculate remaining votes
      const remainingVotes = position.voteLimit - currentVotes.length;
      
      // Get available candidates for this position
      const candidates = await VotingService.getCandidatesForPosition(positionId);
      
      res.json({
        position: {
          id: position.id,
          name: position.name,
          voteLimit: position.voteLimit
        },
        votingStatus: {
          currentVotes: currentVotes.length,
          remainingVotes: Math.max(0, remainingVotes),
          canVote: remainingVotes > 0,
          hasVoted: currentVotes.length > 0
        },
        candidates: candidates.map(c => ({
          id: c.id,
          name: c.name,
          isVotedFor: currentVotes.some(vote => vote.candidateId === c.id)
        }))
      });
    } catch (error) {
      console.error('Error getting voting status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getVotes(req, res) {
    try {
      const { VoteModel } = await import("../models/VoteModel.js");
      const votes = await VoteModel.getAll();
      res.json(votes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getResults(req, res) {
    try {
      // Check if user is admin or superadmin to show all results
      const showAll = req.user && (req.user.role === 'admin' || req.user.role === 'superadmin');
      const results = await VotingService.getResults(showAll);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getActiveElectionResults(req, res) {
    try {
      const results = await VotingService.getActiveElectionResults();
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getRealTimeStats(req, res) {
    try {
      const stats = await VotingService.getRealTimeStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getVoteTimeline(req, res) {
    try {
      const timeline = await VotingService.getVoteTimeline();
      res.json(timeline);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async resetVoterStatus(req, res) {
    try {
      const { voterId } = req.params;
      await VotingService.resetVoterStatus(voterId);
      res.json({ message: "Voter status reset successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ✅ DEBUG: Force fix database constraint
  static async forceFixConstraint(req, res) {
    try {
      console.log('🔧 Force fixing database constraint...');
      const { fixVotesTableConstraint } = await import('../config/database.js');
      await fixVotesTableConstraint(true);
      res.json({ 
        success: true, 
        message: 'Database constraint fixed successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fixing constraint:', error);
      res.status(500).json({ error: 'Failed to fix constraint', details: error.message });
    }
  }

  // ✅ EMERGENCY: Railway-specific database fix
  static async fixRailwayDatabase(req, res) {
    const db = createConnection();
    
    try {
      console.log('🚂 Fixing Railway database constraints...');
      
      const steps = [];
      
      // Step 1: Check current constraints
      steps.push('Checking current constraints...');
      const currentConstraints = await new Promise((resolve, reject) => {
        db.query(`
          SELECT CONSTRAINT_NAME, COLUMN_NAME
          FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
          WHERE TABLE_NAME = 'votes' 
          AND TABLE_SCHEMA = DATABASE()
          AND CONSTRAINT_NAME != 'PRIMARY'
          ORDER BY CONSTRAINT_NAME, ORDINAL_POSITION
        `, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      
      console.log('Current constraints:', currentConstraints);
      steps.push(`Found ${currentConstraints.length} existing constraints`);
      
      // Step 2: Drop all unique constraints on votes table
      const constraintNames = [...new Set(currentConstraints.map(c => c.CONSTRAINT_NAME))];
      
      for (const constraintName of constraintNames) {
        try {
          steps.push(`Dropping constraint: ${constraintName}`);
          await new Promise((resolve, reject) => {
            db.query(`ALTER TABLE votes DROP INDEX \`${constraintName}\``, (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
          steps.push(`✅ Dropped: ${constraintName}`);
          console.log(`Dropped constraint: ${constraintName}`);
        } catch (error) {
          steps.push(`⚠️ Could not drop ${constraintName}: ${error.message}`);
          console.log(`Could not drop ${constraintName}:`, error.message);
        }
      }
      
      // Step 3: Add the correct constraint
      steps.push('Adding correct constraint...');
      try {
        await new Promise((resolve, reject) => {
          db.query(`
            ALTER TABLE votes 
            ADD UNIQUE KEY \`unique_voter_candidate\` (\`voterId\`, \`electionId\`, \`candidateId\`)
          `, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        steps.push('✅ Added constraint: unique_voter_candidate');
        console.log('Added correct constraint');
      } catch (error) {
        if (error.message.includes('Duplicate key name')) {
          steps.push('✅ Constraint already exists: unique_voter_candidate');
        } else {
          throw error;
        }
      }
      
      // Step 4: Verify the fix
      steps.push('Verifying constraint...');
      const newConstraints = await new Promise((resolve, reject) => {
        db.query(`
          SELECT CONSTRAINT_NAME, COLUMN_NAME 
          FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
          WHERE TABLE_NAME = 'votes' 
          AND CONSTRAINT_NAME = 'unique_voter_candidate'
          AND TABLE_SCHEMA = DATABASE()
          ORDER BY ORDINAL_POSITION
        `, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      
      const columns = newConstraints.map(c => c.COLUMN_NAME);
      steps.push(`Verified columns: ${columns.join(', ')}`);
      
      if (JSON.stringify(columns) === JSON.stringify(['voterId', 'electionId', 'candidateId'])) {
        steps.push('🎉 SUCCESS! Database constraint fixed');
        console.log('Database constraint fixed successfully');
        
        res.json({
          success: true,
          message: 'Railway database constraint fixed successfully',
          steps,
          constraint: {
            name: 'unique_voter_candidate',
            columns: ['voterId', 'electionId', 'candidateId'],
            purpose: 'Allows multiple votes per position, prevents duplicate candidate votes'
          }
        });
      } else {
        throw new Error('Constraint verification failed');
      }
      
    } catch (error) {
      console.error('Railway database fix failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fix Railway database constraint',
        details: error.message,
        steps: steps || []
      });
    } finally {
      db.end();
    }
  }
} 