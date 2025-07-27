import express from 'express';
import ElectionAssignmentController from '../controllers/ElectionAssignmentController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);
router.use(requireRole(['admin', 'superadmin']));

// Get positions and candidates assigned to an election
router.get('/elections/:electionId/positions', ElectionAssignmentController.getElectionPositions);
router.get('/elections/:electionId/candidates', ElectionAssignmentController.getElectionCandidates);

// Get unassigned positions and candidates for an election
router.get('/elections/:electionId/unassigned-positions', ElectionAssignmentController.getUnassignedPositions);
router.get('/elections/:electionId/unassigned-candidates', ElectionAssignmentController.getUnassignedCandidates);

// Get assignment status for positions and candidates in an election
router.get('/elections/:electionId/position-status', ElectionAssignmentController.getPositionAssignmentStatus);
router.get('/elections/:electionId/candidate-status', ElectionAssignmentController.getCandidateAssignmentStatus);

// Assign positions and candidates to an election
router.post('/elections/assign-position', ElectionAssignmentController.assignPositionToElection);
router.post('/elections/assign-candidate', ElectionAssignmentController.assignCandidateToElection);

// Remove positions and candidates from an election
router.delete('/elections/:electionId/positions/:positionId', ElectionAssignmentController.removePositionFromElection);
router.delete('/elections/:electionId/candidates/:candidateId', ElectionAssignmentController.removeCandidateFromElection);

// Test endpoint to check if table exists and its structure
router.get('/test-table', async (req, res) => {
  try {
    const { createConnection } = await import('../config/database.js');
    const db = createConnection();
    
    // First check if table exists
    db.query('SHOW TABLES LIKE "election_candidates"', (err, tableResults) => {
      if (err) {
        db.end();
        console.error('Error checking table:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
        return;
      }
      
      if (tableResults.length === 0) {
        db.end();
        res.json({ 
          tableExists: false,
          message: 'election_candidates table does not exist'
        });
        return;
      }
      
      // If table exists, check its structure
      db.query('DESCRIBE election_candidates', (err, structureResults) => {
        db.end();
        if (err) {
          console.error('Error checking table structure:', err);
          res.status(500).json({ error: 'Database error', details: err.message });
        } else {
          console.log('Table structure:', structureResults);
          res.json({ 
            tableExists: true,
            structure: structureResults,
            message: 'election_candidates table exists'
          });
        }
      });
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    res.status(500).json({ error: 'Test endpoint error', details: error.message });
  }
});

export default router; 