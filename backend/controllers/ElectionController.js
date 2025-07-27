import { ElectionModel } from "../models/ElectionModel.js";

export class ElectionController {
  static async getAllElections(req, res) {
    try {
      const elections = await ElectionModel.getAll();
      res.json(elections);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getActiveElection(req, res) {
    try {
      const election = await ElectionModel.getActive();
      res.json(election);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getElectionById(req, res) {
    try {
      const electionId = req.params.id;
      const election = await ElectionModel.getById(electionId);
      if (!election) {
        return res.status(404).json({ error: "Election not found" });
      }
      res.json(election);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createElection(req, res) {
    try {
      const { title, description, startTime, endTime, positionIds } = req.body;
      const electionId = req.body.id;
      const createdBy = req.user.id;

      // Validate dates
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (start >= end) {
        return res.status(400).json({ error: "End time must be after start time" });
      }

      const electionData = {
        id: electionId,
        title,
        description,
        startTime,
        endTime,
        positionIds,
        createdBy
      };

      const result = await ElectionModel.create(electionData);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateElection(req, res) {
    try {
      const electionId = req.params.id;
      const { title, description, startTime, endTime, status, positionIds } = req.body;

      // Validate dates
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (start >= end) {
        return res.status(400).json({ error: "End time must be after start time" });
      }

      const electionData = {
        title,
        description,
        startTime,
        endTime,
        status,
        positionIds
      };

      const result = await ElectionModel.update(electionId, electionData);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteElection(req, res) {
    try {
      const electionId = req.params.id;
      const result = await ElectionModel.delete(electionId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getElectionPositions(req, res) {
    try {
      const electionId = req.params.id;
      const positions = await ElectionModel.getPositions(electionId);
      res.json(positions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
} 