import { VotingService } from "../services/VotingService.js";

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
} 