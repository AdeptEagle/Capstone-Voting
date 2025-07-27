import express from "express";
import { authenticate } from "../middleware/auth.js";
import { VoteController } from "../controllers/VoteController.js";
import ElectionAssignmentController from "../controllers/ElectionAssignmentController.js";

const router = express.Router();

// Public endpoints for ballot data (no authentication required)
router.get("/ballot/positions/:electionId", ElectionAssignmentController.getElectionPositions);
router.get("/ballot/candidates/:electionId", ElectionAssignmentController.getElectionCandidates);

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all votes
router.get("/", VoteController.getAllVotes);

// Submit a vote
router.post("/", VoteController.submitVote);

// Get voting results
router.get("/results", VoteController.getResults);

// Debug: Reset voter status (for testing)
router.post("/debug/reset-voter/:voterId", VoteController.resetVoterStatus);

// Debug: Check voter status
router.get("/debug/voter-status/:voterId", VoteController.getVoterStatus);

export default router; 