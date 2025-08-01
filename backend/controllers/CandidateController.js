import { CandidateModel } from "../models/CandidateModel.js";

export class CandidateController {
  static async getAllCandidates(req, res) {
    try {
      // Check if user is admin or superadmin to show all candidates
      // Also allow showing all candidates if explicitly requested via query parameter for ballot creation
      const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'superadmin');
      const requestAll = req.query.all === 'true';
      const showAll = isAdmin || requestAll;
      
      const candidates = await CandidateModel.getAll(showAll);
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createCandidate(req, res) {
    try {
      const { name, positionId, departmentId, courseId, description, photoUrl } = req.body;
      
      // Debug logging for file upload
      console.log('📁 File upload debug:');
      console.log('   - req.file:', req.file);
      console.log('   - req.body:', req.body);
      console.log('   - photoUrl:', photoUrl);

      // Validate required fields
      if (!name || !positionId || !departmentId || !courseId) {
        return res.status(400).json({ 
          error: 'Name, position, department, and course are required' 
        });
      }

      // Use uploaded file URL or provided photoUrl
      const finalPhotoUrl = photoUrl || (req.file ? req.file.filename : null);

      const candidateData = {
        id: req.body.id,
        name,
        positionId,
        departmentId,
        courseId,
        photoUrl: finalPhotoUrl,
        description
      };

      console.log('   - candidateData:', candidateData);

      const result = await CandidateModel.create(candidateData);
      res.json(result);
    } catch (error) {
      console.error('❌ Error creating candidate:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async updateCandidate(req, res) {
    try {
      const candidateId = req.params.id;
      const { name, positionId, departmentId, courseId, description, photoUrl } = req.body;
      
      // Debug logging for file upload
      console.log('📁 File upload debug (update):');
      console.log('   - req.file:', req.file);
      console.log('   - req.body:', req.body);
      console.log('   - photoUrl:', photoUrl);
      
      // Validate required fields
      if (!name || !positionId || !departmentId || !courseId) {
        return res.status(400).json({ 
          error: 'Name, position, department, and course are required' 
        });
      }
      
      // Use uploaded file URL or provided photoUrl
      let finalPhotoUrl = photoUrl;
      if (req.file) {
        finalPhotoUrl = req.file.filename;
      }
      
      console.log('   - finalPhotoUrl:', finalPhotoUrl);
      
      const candidateData = {
        name,
        positionId,
        departmentId,
        courseId,
        photoUrl: finalPhotoUrl,
        description
      };

      console.log('   - candidateData:', candidateData);

      const result = await CandidateModel.update(candidateId, candidateData);
      res.json(result);
    } catch (error) {
      console.error('❌ Error updating candidate:', error);
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

  static async deleteMultipleCandidates(req, res) {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "Please select candidates to delete" });
      }
      
      const result = await CandidateModel.deleteMultiple(ids);
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