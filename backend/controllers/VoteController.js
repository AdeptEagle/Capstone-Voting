import { VoteModel } from "../models/VoteModel.js";
import { VotingService } from "../services/VotingService.js";

export class VoteController {
  static async getAllVotes(req, res) {
    try {
      const votes = await VoteModel.getAll();
      res.json(votes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async submitVote(req, res) {
    try {
      const result = await VotingService.processVote(req.body);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
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

  static async resetVoterStatus(req, res) {
    try {
      const voterId = req.params.voterId;
      const result = await VotingService.resetVoterStatus(voterId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getVoterStatus(req, res) {
    try {
      const voterId = req.params.voterId;
      const result = await VotingService.getVoterStatus(voterId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
} 