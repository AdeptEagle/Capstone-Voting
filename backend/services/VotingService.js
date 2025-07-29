import { ElectionModel } from "../models/ElectionModel.js";
import { VoteModel } from "../models/VoteModel.js";
import { VoterModel } from "../models/VoterModel.js";
import { ResultsModel } from "../models/ResultsModel.js";

export class VotingService {
  static async processVote(voteData) {
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
      
      // Get current timestamp for vote recording
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
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
      
      // Record the vote
      await VoteModel.create({
        id,
        voterId,
        candidateId,
        electionId: activeElection.id,
        positionId: candidate.positionId
      });
      
      console.log(`Vote recorded successfully: ${id}`);
      
      // Only set hasVoted = true if this is the last vote
      if (isLastVote) {
        await VoterModel.setVotedStatus(voterId, true);
        console.log(`Voter ${voterId} locked out after completing all votes`);
        return { message: "All votes recorded and voter locked out" };
      } else {
        return { message: "Vote recorded" };
      }
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