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

  // Debug endpoint to help troubleshoot results
  static async getDebugResults(req, res) {
    try {
      const { createConnection } = await import("../config/database.js");
      const db = createConnection();
      
      // Get all votes with candidate and position info
      const votesQuery = `
        SELECT 
          v.id as voteId,
          v.voterId,
          v.candidateId,
          v.electionId,
          v.timestamp,
          c.name as candidateName,
          p.name as positionName,
          p.id as positionId
        FROM votes v
        LEFT JOIN candidates c ON v.candidateId = c.id
        LEFT JOIN positions p ON c.positionId = p.id
        ORDER BY v.timestamp DESC
      `;
      
      // Get all elections with their status
      const electionsQuery = `
        SELECT id, title, status, startTime, endTime
        FROM elections
        ORDER BY startTime DESC
      `;
      
      db.query(votesQuery, (votesErr, votesData) => {
        if (votesErr) {
          db.end();
          res.status(500).json({ error: votesErr.message });
          return;
        }
        
        db.query(electionsQuery, (electionsErr, electionsData) => {
          db.end();
          if (electionsErr) {
            res.status(500).json({ error: electionsErr.message });
          } else {
            res.json({
              totalVotes: votesData.length,
              votes: votesData,
              elections: electionsData,
              message: "Debug data retrieved successfully"
            });
          }
        });
      });
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