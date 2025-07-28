import { CandidateModel } from "../models/CandidateModel.js";

export class CandidateController {
  static async getAllCandidates(req, res) {
    try {
      // Check if user is admin or superadmin to show all candidates
      const showAll = req.user && (req.user.role === 'admin' || req.user.role === 'superadmin');
      const candidates = await CandidateModel.getAll(showAll);
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createCandidate(req, res) {
    try {
      const { name, positionId, departmentId, courseId, description } = req.body;
      const photoUrl = req.file ? req.file.filename : null;

      // Validate required fields
      if (!name || !positionId || !departmentId || !courseId) {
        return res.status(400).json({ 
          error: 'Name, position, department, and course are required' 
        });
      }

      const candidateData = {
        id: req.body.id,
        name,
        positionId,
        departmentId,
        courseId,
        photoUrl,
        description
      };

      const result = await CandidateModel.create(candidateData);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateCandidate(req, res) {
    try {
      const candidateId = req.params.id;
      const { name, positionId, departmentId, courseId, description } = req.body;
      
      // Validate required fields
      if (!name || !positionId || !departmentId || !courseId) {
        return res.status(400).json({ 
          error: 'Name, position, department, and course are required' 
        });
      }
      
      // If a new photo was uploaded, use it; otherwise keep the existing one
      let photoUrl = req.body.photoUrl; // Keep existing if no new file
      if (req.file) {
        photoUrl = req.file.filename; // Store just the filename
      }
      
      const candidateData = {
        name,
        positionId,
        departmentId,
        courseId,
        photoUrl,
        description
      };

      const result = await CandidateModel.update(candidateId, candidateData);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteCandidate(req, res) {
    try {
      const candidateId = req.params.id;
      const result = await CandidateModel.delete(candidateId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCandidateById(req, res) {
    try {
      const candidateId = req.params.id;
      const candidate = await CandidateModel.getById(candidateId);
      if (!candidate) {
        return res.status(404).json({ error: "Candidate not found" });
      }
      res.json(candidate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
} 