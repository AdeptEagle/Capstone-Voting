import { ElectionModel } from "../models/ElectionModel.js";
import { VoteModel } from "../models/VoteModel.js";
import { VoterModel } from "../models/VoterModel.js";
import { ResultsModel } from "../models/ResultsModel.js";
import { createConnection } from "../config/database.js";

export class VotingService {
  static async processVote(voteData) {
    const db = createConnection();
    
    try {
      const { voterId, candidateId, id, isLastVote } = voteData;
      
      // Log vote submission for traceability
      console.log(`Vote submission: ID=${id}, VoterID=${voterId}, CandidateID=${candidateId}, isLastVote=${isLastVote}`);
      
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
      
      // Get the position ID from the candidate
      const { CandidateModel } = await import("../models/CandidateModel.js");
      const candidate = await CandidateModel.getById(candidateId);
      if (!candidate) {
        throw new Error("Candidate not found");
      }
      
      // Get next vote ID
      const IDGenerator = await import('../utils/idGenerator.js');
      const voteId = await IDGenerator.default.getNextVoteID();
      
      // BEGIN TRANSACTION - ACID Atomicity
      await new Promise((resolve, reject) => {
        db.beginTransaction((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      try {
        // Record the vote
        await new Promise((resolve, reject) => {
          const query = "INSERT INTO votes (id, voterId, candidateId, electionId, positionId) VALUES (?, ?, ?, ?, ?)";
          const values = [voteId, voterId, candidateId, activeElection.id, candidate.positionId];
          db.query(query, values, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        
        console.log(`Vote recorded successfully: ${id}`);
        
        // Only set hasVoted = true if this is the last vote
        if (isLastVote) {
          await new Promise((resolve, reject) => {
            const query = "UPDATE voters SET hasVoted = 1 WHERE id = ?";
            db.query(query, [voterId], (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
          console.log(`Voter ${voterId} locked out after completing all votes`);
        }
        
        // COMMIT TRANSACTION - ACID Durability
        await new Promise((resolve, reject) => {
          db.commit((err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        
        return { message: isLastVote ? "All votes recorded and voter locked out" : "Vote recorded" };
        
      } catch (error) {
        // ROLLBACK TRANSACTION - ACID Consistency
        await new Promise((resolve) => {
          db.rollback(() => resolve());
        });
        throw error;
      }
      
    } catch (error) {
      throw error;
    } finally {
      db.end();
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