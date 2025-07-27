import express from "express";
import { authenticate } from "../middleware/auth.js";
import { VoteController } from "../controllers/VoteController.js";

const router = express.Router();

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