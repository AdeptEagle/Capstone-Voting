import { createConnection } from "../config/database.js";
import { ElectionModel } from "../models/ElectionModel.js";
import { VoteModel } from "../models/VoteModel.js";
import { VoterModel } from "../models/VoterModel.js";
import { ResultsModel } from "../models/ResultsModel.js";
import { CandidateModel } from "../models/CandidateModel.js";
import { PositionModel } from "../models/PositionModel.js";
import { TransactionHelper } from "../utils/transactionHelper.js";

export class VotingService {
  
  // ✅ UPDATE: Enhanced validation function that works with transactions
  static async validateVoteForPosition(voterId, electionId, positionId, candidateId, currentTransactionVotes = []) {
    try {
      const db = createConnection();
      
      // Get the vote limit for this position
      const [positionResult] = await db.promise().query(
        'SELECT voteLimit FROM positions WHERE id = ?', 
        [positionId]
      );
      
      if (positionResult.length === 0) {
        db.end();
        throw new Error('Position not found');
      }
      
      const voteLimit = positionResult[0].voteLimit;
      
      // Check if voter already voted for this specific candidate in this position (in database)
      const [duplicateVote] = await db.promise().query(
        'SELECT id FROM votes WHERE voterId = ? AND electionId = ? AND positionId = ? AND candidateId = ?',
        [voterId, electionId, positionId, candidateId]
      );
      
      if (duplicateVote.length > 0) {
        db.end();
        throw new Error('You have already voted for this candidate in this position');
      }
      
      // Check if this candidate is already in the current transaction votes
      const duplicateInTransaction = currentTransactionVotes.some(vote => 
        vote.candidateId === candidateId && vote.positionId === positionId
      );
      
      if (duplicateInTransaction) {
        db.end();
        throw new Error('You are trying to vote for the same candidate multiple times');
      }
      
      // Get current vote count for this voter and position (from database)
      const [currentVotes] = await db.promise().query(
        'SELECT COUNT(*) as count FROM votes WHERE voterId = ? AND electionId = ? AND positionId = ?',
        [voterId, electionId, positionId]
      );
      
      const currentVoteCount = currentVotes[0].count;
      
      // Count votes for this position in current transaction
      const transactionVotesForPosition = currentTransactionVotes.filter(vote => vote.positionId === positionId).length;
      
      // Total votes would be: database votes + transaction votes + 1 (current vote)
      const totalVotesAfterThis = currentVoteCount + transactionVotesForPosition + 1;
      
      if (totalVotesAfterThis > voteLimit) {
        db.end();
        throw new Error(`You can only vote for ${voteLimit} candidate(s) in this position. You would have ${totalVotesAfterThis} votes.`);
      }
      
      db.end();
      return { 
        valid: true, 
        currentVotes: currentVoteCount, 
        transactionVotes: transactionVotesForPosition,
        limit: voteLimit,
        totalAfter: totalVotesAfterThis
      };
      
    } catch (error) {
      throw error;
    }
  }

  // NEW: Handle multiple votes with proper validation
  static async processMultipleVotes(voteData) {
    const { voterId, positionId, candidateIds, isLastVote } = voteData;
    
    console.log(`Processing multiple votes: VoterID=${voterId}, PositionID=${positionId}, Candidates=${candidateIds.length}, isLastVote=${isLastVote}`);
    
    return await TransactionHelper.executeInTransaction(async (db) => {
      // Get active election
      const activeElection = await ElectionModel.getActive();
      if (!activeElection) {
        throw new Error("No active election found");
      }
      
      // Get position details
      const position = await PositionModel.getById(positionId);
      if (!position) {
        throw new Error("Position not found");
      }
      
      // Check for duplicate candidates in the selection
      const uniqueCandidates = [...new Set(candidateIds)];
      if (uniqueCandidates.length !== candidateIds.length) {
        throw new Error("You cannot vote for the same candidate multiple times");
      }
      
      // Check if we're within the vote limit for this position
      if (candidateIds.length > position.voteLimit) {
        throw new Error(`You can only vote for up to ${position.voteLimit} candidates for ${position.name}`);
      }
      
      // Check current votes for this position
      const currentVotes = await new Promise((resolve, reject) => {
        const query = "SELECT candidateId FROM votes WHERE voterId = ? AND electionId = ? AND positionId = ?";
        db.query(query, [voterId, activeElection.id, positionId], (err, result) => {
          if (err) reject(err);
          else resolve(result.map(row => row.candidateId));
        });
      });
      
      // Check total votes for this position by this voter
      const totalVotesForPosition = currentVotes.length + candidateIds.length;
      if (totalVotesForPosition > position.voteLimit) {
        throw new Error(`You can only vote for up to ${position.voteLimit} candidates for ${position.name}`);
      }
      
      // Check for conflicts with existing votes
      const conflicts = candidateIds.filter(candidateId => currentVotes.includes(candidateId));
      if (conflicts.length > 0) {
        throw new Error(`You have already voted for some of these candidates in ${position.name}`);
      }
      
      // Record all votes for this position
      const voteIds = [];
      for (const candidateId of candidateIds) {
        const IDGenerator = await import('../utils/idGenerator.js');
        const voteId = await IDGenerator.default.getNextVoteID();
        
        try {
          await VoteModel.create({
            id: voteId,
            voterId,
            candidateId,
            electionId: activeElection.id,
            positionId
          });
          
          voteIds.push(voteId);
          console.log(`Vote recorded: ${voteId} for candidate ${candidateId}`);
        } catch (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            throw new Error(`Duplicate vote detected: You have already voted for this candidate in ${position.name}`);
          }
          throw err;
        }
      }
      
      // Only set hasVoted = true if this is the last vote
      if (isLastVote) {
        await new Promise((resolve, reject) => {
          const query = "UPDATE voters SET hasVoted = 1 WHERE id = ?";
          db.query(query, [voterId], (err, result) => {
            if (err) reject(err);
            else resolve();
          });
        });
        console.log(`Voter ${voterId} locked out after completing all votes`);
      }
      
      return {
        message: isLastVote ? "All votes recorded and voter locked out" : "Votes recorded",
        voteIds,
        position: position.name,
        candidateCount: candidateIds.length,
        currentVotes: currentVotes.length + candidateIds.length,
        limit: position.voteLimit
      };
    });
  }

  // LEGACY: Keep for backward compatibility
  static async processVote(voteData) {
    const { voterId, candidateId, positionId, isLastVote } = voteData;
    
    console.log(`Vote submission: VoterID=${voterId}, CandidateID=${candidateId}, PositionID=${positionId}, isLastVote=${isLastVote}`);
    
    return await TransactionHelper.executeInTransaction(async (db) => {
      // Get active election
      const activeElection = await ElectionModel.getActive();
      if (!activeElection) {
        throw new Error("No active election found");
      }
      
      // Validate the vote
      const validation = await this.validateVoteForPosition(voterId, activeElection.id, positionId, candidateId);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      
      // Record the vote
      const IDGenerator = await import('../utils/idGenerator.js');
      const voteId = await IDGenerator.default.getNextVoteID();
      
      await VoteModel.create({
        id: voteId,
        voterId,
        candidateId,
        electionId: activeElection.id,
        positionId
      });
      
      // Only set hasVoted = true if this is the last vote
      if (isLastVote) {
        await new Promise((resolve, reject) => {
          const query = "UPDATE voters SET hasVoted = 1 WHERE id = ?";
          db.query(query, [voterId], (err, result) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
      
      return { 
        message: isLastVote ? "All votes recorded and voter locked out" : "Vote recorded",
        voteId,
        position: validation.position?.name,
        candidate: validation.candidate?.name
      };
    });
  }

  static async getActiveElectionResults() {
    try {
      return await ResultsModel.getActiveElectionResults();
    } catch (error) {
      console.error('Error fetching active election results:', error);
      throw error;
    }
  }

  static async getAllElectionResults() {
    try {
      return await ResultsModel.getAllElectionResults();
    } catch (error) {
      console.error('Error fetching all election results:', error);
      throw error;
    }
  }

  static async getResults(showAll = false) {
    try {
      return await ResultsModel.getResults(showAll);
    } catch (error) {
      console.error('Error fetching results:', error);
      throw error;
    }
  }

  static async getVotesByElection(electionId) {
    try {
      const db = createConnection();
      return new Promise((resolve, reject) => {
        const query = `
          SELECT 
            v.id,
            v.voterId,
            v.candidateId,
            v.positionId,
            v.created_at,
            vo.name as voterName,
            vo.studentId,
            vo.departmentName,
            vo.courseName,
            c.name as candidateName,
            p.name as positionName
          FROM votes v
          LEFT JOIN voters vo ON v.voterId = vo.id
          LEFT JOIN candidates c ON v.candidateId = c.id
          LEFT JOIN positions p ON v.positionId = p.id
          WHERE v.electionId = ?
          ORDER BY v.created_at DESC
        `;
        db.query(query, [electionId], (err, data) => {
          db.end();
          if (err) reject(err);
          else resolve(data);
        });
      });
    } catch (error) {
      console.error('Error fetching votes by election:', error);
      throw error;
    }
  }

  static async getVotingStatistics(electionId) {
    try {
      const db = createConnection();
      return new Promise((resolve, reject) => {
        const query = `
          SELECT 
            COUNT(DISTINCT v.voterId) as totalVoters,
            COUNT(v.id) as totalVotes,
            COUNT(DISTINCT v.positionId) as positionsVoted,
            MIN(v.created_at) as firstVoteTime,
            MAX(v.created_at) as lastVoteTime,
            ROUND(AVG(votesPerVoter.voteCount), 2) as avgVotesPerVoter
          FROM votes v
          LEFT JOIN (
            SELECT voterId, COUNT(*) as voteCount 
            FROM votes 
            WHERE electionId = ? 
            GROUP BY voterId
          ) votesPerVoter ON v.voterId = votesPerVoter.voterId
          WHERE v.electionId = ?
        `;
        db.query(query, [electionId, electionId], (err, data) => {
          db.end();
          if (err) reject(err);
          else resolve(data[0]);
        });
      });
    } catch (error) {
      console.error('Error fetching voting statistics:', error);
      throw error;
    }
  }

  static async getRealTimeStats() {
    try {
      return await ResultsModel.getRealTimeStats();
    } catch (error) {
      console.error('Error fetching real-time stats:', error);
      throw error;
    }
  }

  static async getVoteTimeline() {
    try {
      return await ResultsModel.getVoteTimeline();
    } catch (error) {
      console.error('Error fetching vote timeline:', error);
      throw error;
    }
  }

  static async resetVoterStatus(voterId) {
    try {
      return await VoterModel.resetVotingStatus(voterId);
    } catch (error) {
      console.error('Error resetting voter status:', error);
      throw error;
    }
  }

  static async getVoterStatus(voterId) {
    try {
      const voter = await VoterModel.getById(voterId);
      if (!voter) {
        throw new Error("Voter not found");
      }
      return {
        id: voter.id,
        name: voter.name,
        studentId: voter.studentId,
        hasVoted: voter.hasVoted
      };
    } catch (error) {
      console.error('Error fetching voter status:', error);
      throw error;
    }
  }

  // NEW: Get position by ID
  static async getPositionById(positionId) {
    try {
      const db = createConnection();
      const [rows] = await db.promise().query(
        'SELECT * FROM positions WHERE id = ?',
        [positionId]
      );
      db.end();
      return rows[0] || null;
    } catch (error) {
      console.error('Error getting position by ID:', error);
      throw error;
    }
  }

  // NEW: Get voter's votes for a specific position
  static async getVoterVotesForPosition(voterId, electionId, positionId) {
    try {
      const db = createConnection();
      const [rows] = await db.promise().query(
        'SELECT * FROM votes WHERE voterId = ? AND electionId = ? AND positionId = ?',
        [voterId, electionId, positionId]
      );
      db.end();
      return rows;
    } catch (error) {
      console.error('Error getting voter votes for position:', error);
      throw error;
    }
  }

  // NEW: Get candidates for a position
  static async getCandidatesForPosition(positionId) {
    try {
      const db = createConnection();
      const [rows] = await db.promise().query(
        'SELECT * FROM candidates WHERE positionId = ? ORDER BY name',
        [positionId]
      );
      db.end();
      return rows;
    } catch (error) {
      console.error('Error getting candidates for position:', error);
      throw error;
    }
  }
} 