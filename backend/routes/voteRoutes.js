import express from "express";
import { VoteController } from "../controllers/VoteController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// ✅ UPDATE: Multiple votes endpoint (authenticated)
router.post("/multiple", authenticate, VoteController.createMultipleVotes);

// ✅ UPDATE: Single vote endpoint (authenticated)
router.post("/single", authenticate, VoteController.createVote);

// ✅ NEW: Handle votes array format from frontend (authenticated)
router.post("/votes-array", authenticate, VoteController.handleMultipleVotesArray);

// ✅ SUPPORT: Both endpoints for compatibility
router.post("/multiple-votes", authenticate, VoteController.handleMultipleVotesArray);

// ✅ NEW: Get voting status for a position (authenticated)
router.get("/status/:electionId/:positionId", authenticate, VoteController.getVotingStatus);

// ✅ KEEP: Get voter's votes for an election (authenticated)
router.get("/voter/:electionId", authenticate, VoteController.getVoterVotes);

// ✅ KEEP: Check voting eligibility for a position (authenticated)
router.get("/eligibility/:electionId/:positionId", authenticate, VoteController.checkVotingEligibility);

// ✅ KEEP: Get all votes (admin only)
router.get("/", authenticate, VoteController.getVotes);

// ✅ KEEP: Get voting results
router.get("/results", VoteController.getResults);

// ✅ KEEP: Get active election results only
router.get("/active-results", VoteController.getActiveElectionResults);

// ✅ KEEP: Get real-time voting statistics
router.get("/real-time-stats", VoteController.getRealTimeStats);

// ✅ KEEP: Get vote timeline data
router.get("/vote-timeline", VoteController.getVoteTimeline);

// ✅ KEEP: Get vote timeline (alternative route for frontend)
router.get("/timeline", VoteController.getVoteTimeline);

// ✅ KEEP: Reset voter status (admin only)
router.put("/reset-voter/:voterId", authenticate, VoteController.resetVoterStatus);

// ✅ DEBUG: Force fix database constraint (admin only)
router.post("/debug/fix-constraint", authenticate, VoteController.forceFixConstraint);

// ✅ EMERGENCY: Railway-specific database fix
router.get("/fix-railway-db/emergency-fix-2024", VoteController.fixRailwayDatabase);

export default router; 