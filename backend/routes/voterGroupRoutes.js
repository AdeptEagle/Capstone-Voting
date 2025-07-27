import express from 'express';
import VoterGroupController from '../controllers/VoterGroupController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public endpoint for fetching voter groups (no authentication required)
router.get('/public', VoterGroupController.getAllVoterGroups);

// Apply authentication middleware to all routes
router.use(authenticate);
router.use(requireRole(['admin', 'superadmin']));

// Get all voter groups (authenticated)
router.get('/', VoterGroupController.getAllVoterGroups);

// Get available voters (not in any group) - MUST come before /:id routes
router.get('/available-voters', VoterGroupController.getAvailableVoters);

// Get voter groups by type - MUST come before /:id routes
router.get('/type/:type', VoterGroupController.getVoterGroupsByType);

// Get voter groups for a specific voter - MUST come before /:id routes
router.get('/voter/:voterId', VoterGroupController.getVoterGroupsForVoter);

// Get voter group by ID
router.get('/:id', VoterGroupController.getVoterGroupById);

// Create a new voter group
router.post('/', VoterGroupController.createVoterGroup);

// Update a voter group
router.put('/:id', VoterGroupController.updateVoterGroup);

// Delete a voter group
router.delete('/:id', VoterGroupController.deleteVoterGroup);

// Get members of a voter group
router.get('/:id/members', VoterGroupController.getVoterGroupMembers);

// Add member to voter group
router.post('/members', VoterGroupController.addMemberToGroup);

// Remove member from voter group
router.delete('/members', VoterGroupController.removeMemberFromGroup);

export default router; 