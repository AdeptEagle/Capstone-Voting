import { createConnection } from "../config/database.js";
import { ElectionModel } from "../models/ElectionModel.js";
import { VoteModel } from "../models/VoteModel.js";
import { VoterModel } from "../models/VoterModel.js";
import { ResultsModel } from "../models/ResultsModel.js";
import { CandidateModel } from "../models/CandidateModel.js";
import { PositionModel } from "../models/PositionModel.js";
import { TransactionHelper } from "../utils/transactionHelper.js";

export class VotingService {
  static async processVote(voteData) {
    const { voterId, candidateId, positionId, isLastVote } = voteData;
    
    // Log vote submission for traceability
    console.log(`Vote submission: VoterID=${voterId}, CandidateID=${candidateId}, PositionID=${positionId}, isLastVote=${isLastVote}`);
    
    return await TransactionHelper.executeInTransaction(async (db) => {
      // First check if there's an active election
      const activeElection = await ElectionModel.getActive();
      if (!activeElection) {
        throw new Error("No active election found");
      }
      
      console.log('Active election found:', activeElection);
      
      // Check if election is active
      if (activeElection.status !== 'active') {
        throw new Error("Election is not active");
      }
      
      // Check if voter has already completed voting (hasVoted flag)
      const voter = await VoterModel.getById(voterId);
      if (!voter) {
        throw new Error("Voter not found");
      }
      
      console.log('Voter query results:', voter);
      
      if (voter.hasVoted) {
        console.log(`Voter ${voterId} has already voted (hasVoted=${voter.hasVoted})`);
        throw new Error("You have already voted in this election");
      }
      
      console.log(`Voter ${voterId} has not voted yet, proceeding with vote recording`);
      
      // Get the candidate details
      const candidate = await CandidateModel.getById(candidateId);
      if (!candidate) {
        throw new Error("Candidate not found");
      }

      // Get the position and check vote limit
      const position = await PositionModel.getById(positionId);
      if (!position) {
        throw new Error("Position not found");
      }

      // Verify candidate belongs to this position
      if (candidate.positionId !== positionId) {
        throw new Error("Candidate does not belong to the specified position");
      }

      // Count existing votes for this position by this voter
      const existingVotes = await VoteModel.countVotesByPosition(voterId, activeElection.id, positionId);
      console.log(`Current votes for position ${position.name}: ${existingVotes} (limit: ${position.voteLimit})`);
      
      if (existingVotes >= position.voteLimit) {
        throw new Error(`You have already cast the maximum number of votes (${position.voteLimit}) for ${position.name}. Please select a different position or candidate.`);
      }
      
      // Check if voter has already voted for this specific candidate in this position
      const duplicateCheck = await new Promise((resolve, reject) => {
        const query = "SELECT COUNT(*) as count FROM votes WHERE voterId = ? AND electionId = ? AND candidateId = ? AND positionId = ?";
        db.query(query, [voterId, activeElection.id, candidateId, positionId], (err, result) => {
          if (err) reject(err);
          else resolve(result[0].count);
        });
      });
      
      console.log(`Duplicate check for voter ${voterId}, candidate ${candidateId}, position ${positionId}: ${duplicateCheck} existing votes`);
      
      if (duplicateCheck > 0) {
        console.log(`❌ Duplicate vote detected: voter ${voterId} already voted for candidate ${candidateId} in position ${positionId}`);
        throw new Error(`Duplicate vote detected: You have already voted for this candidate in this position`);
      }
      
      // Get next vote ID
      const IDGenerator = await import('../utils/idGenerator.js');
      const voteId = await IDGenerator.default.getNextVoteID();
      
      console.log(`Generated vote ID: ${voteId}`);
      console.log(`About to record vote: voterId=${voterId}, candidateId=${candidateId}, positionId=${positionId}`);
      
      // Record the vote using VoteModel
      try {
        await VoteModel.create({
          id: voteId,
          voterId,
          candidateId,
          electionId: activeElection.id,
          positionId
        });
        console.log(`Vote recorded successfully: ${voteId}`);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          throw new Error(`Duplicate vote detected: You have already voted for this candidate in this position`);
        }
        throw err;
      }
      
      // Only set hasVoted = true if this is the last vote
      if (isLastVote) {
        console.log(`This is the last vote, updating voter ${voterId} hasVoted flag to true`);
        await new Promise((resolve, reject) => {
          const query = "UPDATE voters SET hasVoted = 1 WHERE id = ?";
          db.query(query, [voterId], (err, result) => {
            if (err) {
              console.error('Voter update error:', err);
              reject(err);
            } else {
              console.log(`Voter ${voterId} hasVoted flag updated successfully. Rows affected: ${result.affectedRows}`);
              resolve();
            }
          });
        });
        console.log(`Voter ${voterId} locked out after completing all votes`);
      } else {
        console.log(`This is not the last vote (${isLastVote}), keeping voter ${voterId} hasVoted flag as false`);
      }
      
      return { 
        message: isLastVote ? "All votes recorded and voter locked out" : "Vote recorded",
        voteId,
        position: position.name,
        candidate: candidate.name
      };
    });
  }

  // NEW: Process multiple votes for a position as a group
  static async processMultipleVotes(voteData) {
    const { voterId, positionId, candidateIds, isLastVote } = voteData;
    
    console.log(`Processing multiple votes: VoterID=${voterId}, PositionID=${positionId}, Candidates=${candidateIds.length}, isLastVote=${isLastVote}`);
    
    return await TransactionHelper.executeInTransaction(async (db) => {
      // First check if there's an active election
      const activeElection = await ElectionModel.getActive();
      if (!activeElection) {
        throw new Error("No active election found");
      }
      
      // Check if election is active
      if (activeElection.status !== 'active') {
        throw new Error("Election is not active");
      }
      
      // Check if voter has already completed voting
      const voter = await VoterModel.getById(voterId);
      if (!voter) {
        throw new Error("Voter not found");
      }
      
      if (voter.hasVoted) {
        throw new Error("You have already voted in this election");
      }
      
      // Get the position and check vote limit
      const position = await PositionModel.getById(positionId);
      if (!position) {
        throw new Error("Position not found");
      }
      
      // Check if we're within the vote limit for this position
      if (candidateIds.length > position.voteLimit) {
        throw new Error(`You can only vote for up to ${position.voteLimit} candidates for ${position.name}`);
      }
      
      // Check for duplicate candidates in the selection
      const uniqueCandidates = [...new Set(candidateIds)];
      if (uniqueCandidates.length !== candidateIds.length) {
        throw new Error("You cannot vote for the same candidate multiple times");
      }
      
      // Check if voter has already voted for any of these candidates in this position
      const existingVotes = await new Promise((resolve, reject) => {
        const query = "SELECT candidateId FROM votes WHERE voterId = ? AND electionId = ? AND positionId = ?";
        db.query(query, [voterId, activeElection.id, positionId], (err, result) => {
          if (err) reject(err);
          else resolve(result.map(row => row.candidateId));
        });
      });
      
      // Check for conflicts with existing votes
      const conflicts = candidateIds.filter(candidateId => existingVotes.includes(candidateId));
      if (conflicts.length > 0) {
        throw new Error(`You have already voted for some of these candidates in ${position.name}`);
      }
      
      // Check total votes for this position by this voter
      const totalVotesForPosition = existingVotes.length + candidateIds.length;
      if (totalVotesForPosition > position.voteLimit) {
        throw new Error(`You can only vote for up to ${position.voteLimit} candidates for ${position.name}`);
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
        candidateCount: candidateIds.length
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
} 