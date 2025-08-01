import express from "express";
import { VoteController } from "../controllers/VoteController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Create a new vote
router.post("/", VoteController.createVote);

// Create multiple votes for a position
router.post("/multiple", VoteController.createMultipleVotes);

// Get all votes
router.get("/", authenticate, VoteController.getVotes);

// Get voting results
router.get("/results", VoteController.getResults);

// Get active election results only
router.get("/active-results", VoteController.getActiveElectionResults);

// Get real-time voting statistics
router.get("/real-time-stats", VoteController.getRealTimeStats);

// Get vote timeline data
router.get("/vote-timeline", VoteController.getVoteTimeline);

// Get vote timeline (alternative route for frontend)
router.get("/timeline", VoteController.getVoteTimeline);

// Reset voter status (admin only)
router.put("/reset-voter/:voterId", authenticate, VoteController.resetVoterStatus);

export default router; 