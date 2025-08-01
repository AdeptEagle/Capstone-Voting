import { ElectionModel } from "../models/ElectionModel.js";
import { VoteModel } from "../models/VoteModel.js";
import { VoterModel } from "../models/VoterModel.js";
import { ResultsModel } from "../models/ResultsModel.js";
import { createConnection } from "../config/database.js";

export class VotingService {
  static async processVote(voteData) {
    const db = await createConnection();
    
    try {
      const { voterId, candidateId, positionId, isLastVote } = voteData;
      
      // Log vote submission for traceability
      console.log(`Vote submission: VoterID=${voterId}, CandidateID=${candidateId}, PositionID=${positionId}, isLastVote=${isLastVote}`);
      
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
      
      // Get the candidate and position details
      const { CandidateModel } = await import("../models/CandidateModel.js");
      const candidate = await CandidateModel.getById(candidateId);
      if (!candidate) {
        throw new Error("Candidate not found");
      }

      // Get the position and check vote limit
      const { PositionModel } = await import("../models/PositionModel.js");
      const position = await PositionModel.getById(positionId);
      if (!position) {
        throw new Error("Position not found");
      }

      // Verify candidate belongs to this position
      if (candidate.positionId !== positionId) {
        throw new Error("Candidate does not belong to the specified position");
      }

      // BEGIN TRANSACTION - ACID Atomicity
      await db.beginTransaction();

      try {
        // Count existing votes for this position (inside transaction)
        const [rows] = await db.execute(
          "SELECT COUNT(*) as voteCount FROM votes WHERE voterId = ? AND electionId = ? AND positionId = ? FOR UPDATE",
          [voterId, activeElection.id, positionId]
        );
        const existingVotes = rows[0].voteCount;

        console.log(`Current votes for position ${position.name}: ${existingVotes} (limit: ${position.voteLimit})`);
        
        if (existingVotes >= position.voteLimit) {
          throw new Error(`You have already cast the maximum number of votes (${position.voteLimit}) for ${position.name}`);
        }
        
        // Get next vote ID
        const IDGenerator = await import('../utils/idGenerator.js');
        const voteId = await IDGenerator.default.getNextVoteID();
        
        console.log(`Generated vote ID: ${voteId}`);
        console.log(`About to record vote: voterId=${voterId}, candidateId=${candidateId}, electionId=${activeElection.id}, positionId=${positionId}`);

        // Record the vote
        await db.execute(
          "INSERT INTO votes (id, voterId, candidateId, electionId, positionId) VALUES (?, ?, ?, ?, ?)",
          [voteId, voterId, candidateId, activeElection.id, positionId]
        );
        
        // Only set hasVoted = true if this is the last vote
        if (isLastVote) {
          console.log(`This is the last vote, updating voter ${voterId} hasVoted flag to true`);
          const [result] = await db.execute(
            "UPDATE voters SET hasVoted = 1 WHERE id = ?",
            [voterId]
          );
          console.log(`Voter ${voterId} hasVoted flag updated successfully. Rows affected: ${result.affectedRows}`);
          console.log(`Voter ${voterId} locked out after completing all votes`);
        } else {
          console.log(`This is not the last vote (${isLastVote}), keeping voter ${voterId} hasVoted flag as false`);
        }
        
        // COMMIT TRANSACTION - ACID Durability
        await db.commit();
        console.log('Transaction committed successfully');
        
        return { message: isLastVote ? "All votes recorded and voter locked out" : "Vote recorded" };
        
      } catch (error) {
        console.error('Error during vote processing, rolling back transaction:', error);
        // ROLLBACK TRANSACTION - ACID Consistency
        await db.rollback();
        console.log('Transaction rolled back');
        throw error;
      }
    } catch (error) {
      console.error('Vote processing error:', error);
      throw error;
    } finally {
      await db.release();
    }
  }

  static async getActiveElectionResults() {
    try {
      return await ResultsModel.getActiveElectionResults();
    } catch (error) {
      throw error;
    }
  }

  static async getResults(showAll = false) {
    try {
      return await ResultsModel.getResults(showAll);
    } catch (error) {
      throw error;
    }
  }

  static async getRealTimeStats() {
    try {
      return await ResultsModel.getRealTimeStats();
    } catch (error) {
      throw error;
    }
  }

  static async getVoteTimeline() {
    try {
      return await ResultsModel.getVoteTimeline();
    } catch (error) {
      throw error;
    }
  }

  static async resetVoterStatus(voterId) {
    try {
      return await VoterModel.resetVotingStatus(voterId);
    } catch (error) {
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
      throw error;
    }
  }
}