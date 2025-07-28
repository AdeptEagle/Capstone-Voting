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
      const result = await VoterModel.create(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateVoter(req, res) {
    try {
      const voterId = req.params.id;
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