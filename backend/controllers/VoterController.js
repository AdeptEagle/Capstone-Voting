import { VoterModel } from "../models/VoterModel.js";

export class VoterController {
  static async getAllVoters(req, res) {
    try {
      const voters = await VoterModel.getAll();
      res.json(voters);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createVoter(req, res) {
    try {
      const { studentId } = req.body;
      
      // Validate student ID format: YYYY-NNNNN
      const idPattern = /^\d{4}-\d{5}$/;
      if (!idPattern.test(studentId)) {
        return res.status(400).json({ 
          error: 'Student ID must be in the format YYYY-NNNNN (e.g., 2024-00001)' 
        });
      }
      
      const result = await VoterModel.create(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateVoter(req, res) {
    try {
      const voterId = req.params.id;
      const { studentId } = req.body;
      
      // Validate student ID format: YYYY-NNNNN
      const idPattern = /^\d{4}-\d{5}$/;
      if (!idPattern.test(studentId)) {
        return res.status(400).json({ 
          error: 'Student ID must be in the format YYYY-NNNNN (e.g., 2024-00001)' 
        });
      }
      
      const result = await VoterModel.update(voterId, req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteVoter(req, res) {
    try {
      const voterId = req.params.id;
      const result = await VoterModel.delete(voterId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteMultipleVoters(req, res) {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "Please select voters to delete" });
      }
      
      const result = await VoterModel.deleteMultiple(ids);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getVoterById(req, res) {
    try {
      const voterId = req.params.id;
      const voter = await VoterModel.getById(voterId);
      if (!voter) {
        return res.status(404).json({ error: "Voter not found" });
      }
      res.json(voter);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAvailableVoters(req, res) {
    try {
      const voters = await VoterModel.getAvailable();
      res.json(voters);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
} 