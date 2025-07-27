import ElectionAssignmentModel from '../models/ElectionAssignmentModel.js';

class ElectionAssignmentController {
  // Get all positions assigned to an election
  static async getElectionPositions(req, res) {
    try {
      const { electionId } = req.params;
      const positions = await ElectionAssignmentModel.getElectionPositions(electionId);
      res.json(positions);
    } catch (error) {
      console.error('Error getting election positions:', error);
      res.status(500).json({ error: 'Failed to get election positions' });
    }
  }

  // Get all candidates assigned to an election
  static async getElectionCandidates(req, res) {
    try {
      const { electionId } = req.params;
      const candidates = await ElectionAssignmentModel.getElectionCandidates(electionId);
      res.json(candidates);
    } catch (error) {
      console.error('Error getting election candidates:', error);
      res.status(500).json({ error: 'Failed to get election candidates' });
    }
  }

  // Get all positions NOT assigned to an election
  static async getUnassignedPositions(req, res) {
    try {
      const { electionId } = req.params;
      const positions = await ElectionAssignmentModel.getUnassignedPositions(electionId);
      res.json(positions);
    } catch (error) {
      console.error('Error getting unassigned positions:', error);
      res.status(500).json({ error: 'Failed to get unassigned positions' });
    }
  }

  // Get all candidates NOT assigned to an election
  static async getUnassignedCandidates(req, res) {
    try {
      const { electionId } = req.params;
      const candidates = await ElectionAssignmentModel.getUnassignedCandidates(electionId);
      res.json(candidates);
    } catch (error) {
      console.error('Error getting unassigned candidates:', error);
      res.status(500).json({ error: 'Failed to get unassigned candidates' });
    }
  }

  // Get assignment status for positions in an election
  static async getPositionAssignmentStatus(req, res) {
    try {
      const { electionId } = req.params;
      const positions = await ElectionAssignmentModel.getPositionAssignmentStatus(electionId);
      res.json(positions);
    } catch (error) {
      console.error('Error getting position assignment status:', error);
      res.status(500).json({ error: 'Failed to get position assignment status' });
    }
  }

  // Get assignment status for candidates in an election
  static async getCandidateAssignmentStatus(req, res) {
    try {
      const { electionId } = req.params;
      const candidates = await ElectionAssignmentModel.getCandidateAssignmentStatus(electionId);
      res.json(candidates);
    } catch (error) {
      console.error('Error getting candidate assignment status:', error);
      res.status(500).json({ error: 'Failed to get candidate assignment status' });
    }
  }

  // Assign a position to an election
  static async assignPositionToElection(req, res) {
    try {
      const { electionId, positionId } = req.body;
      
      if (!electionId || !positionId) {
        return res.status(400).json({ error: 'Election ID and Position ID are required' });
      }

      await ElectionAssignmentModel.assignPositionToElection(electionId, positionId);
      res.json({ message: 'Position assigned to election successfully' });
    } catch (error) {
      console.error('Error assigning position to election:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'Position is already assigned to this election' });
      } else {
        res.status(500).json({ error: 'Failed to assign position to election' });
      }
    }
  }

  // Assign a candidate to an election
  static async assignCandidateToElection(req, res) {
    try {
      const { electionId, candidateId } = req.body;
      
      console.log('Assigning candidate to election:', { electionId, candidateId });
      
      if (!electionId || !candidateId) {
        return res.status(400).json({ error: 'Election ID and Candidate ID are required' });
      }

      await ElectionAssignmentModel.assignCandidateToElection(electionId, candidateId);
      res.json({ message: 'Candidate assigned to election successfully' });
    } catch (error) {
      console.error('Error assigning candidate to election:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        sqlMessage: error.sqlMessage,
        sqlState: error.sqlState
      });
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'Candidate is already assigned to this election' });
      } else {
        res.status(500).json({ error: 'Failed to assign candidate to election', details: error.message });
      }
    }
  }

  // Remove a position from an election
  static async removePositionFromElection(req, res) {
    try {
      const { electionId, positionId } = req.params;
      
      await ElectionAssignmentModel.removePositionFromElection(electionId, positionId);
      res.json({ message: 'Position removed from election successfully' });
    } catch (error) {
      console.error('Error removing position from election:', error);
      res.status(500).json({ error: 'Failed to remove position from election' });
    }
  }

  // Remove a candidate from an election
  static async removeCandidateFromElection(req, res) {
    try {
      const { electionId, candidateId } = req.params;
      
      await ElectionAssignmentModel.removeCandidateFromElection(electionId, candidateId);
      res.json({ message: 'Candidate removed from election successfully' });
    } catch (error) {
      console.error('Error removing candidate from election:', error);
      res.status(500).json({ error: 'Failed to remove candidate from election' });
    }
  }
}

export default ElectionAssignmentController; 