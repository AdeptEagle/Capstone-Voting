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

  static async getElectionHistory(req, res) {
    try {
      const history = await ElectionModel.getElectionHistory();
      res.json(history);
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

  static async getCurrentElection(req, res) {
    try {
      const election = await ElectionModel.getCurrentElection();
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
      const { title, description, startTime, endTime, positionIds, candidateIds } = req.body;
      const createdBy = req.user.id;

      // Validate dates
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (start >= end) {
        return res.status(400).json({ error: "End time must be after start time" });
      }

      // Generate election ID using the backend ID generator
      const IDGenerator = await import('../utils/idGenerator.js');
      const electionId = await IDGenerator.default.getNextElectionID();

      const electionData = {
        id: electionId,
        title,
        description,
        startTime,
        endTime,
        positionIds,
        candidateIds,
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
      const { title, description, startTime, endTime, status, positionIds, candidateIds } = req.body;

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
        positionIds,
        candidateIds
      };

      const result = await ElectionModel.update(electionId, electionData);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async startElection(req, res) {
    try {
      const electionId = req.params.id;
      const result = await ElectionModel.startElection(electionId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async pauseElection(req, res) {
    try {
      const electionId = req.params.id;
      const result = await ElectionModel.pauseElection(electionId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async stopElection(req, res) {
    try {
      const electionId = req.params.id;
      const result = await ElectionModel.stopElection(electionId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async resumeElection(req, res) {
    try {
      const electionId = req.params.id;
      const result = await ElectionModel.resumeElection(electionId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async endElection(req, res) {
    try {
      const electionId = req.params.id;
      const result = await ElectionModel.endElection(electionId);
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