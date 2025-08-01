import express from "express";
import { BallotHistoryController } from "../controllers/BallotHistoryController.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Get all completed elections (admin only)
router.get("/elections", authenticate, requireRole(["admin", "superadmin"]), BallotHistoryController.getAllCompletedElections);

// Get comprehensive election analysis (admin only)
router.get("/elections/:electionId/analysis", authenticate, requireRole(["admin", "superadmin"]), BallotHistoryController.getElectionAnalysis);

// Get election summary
router.get("/elections/:electionId/summary", authenticate, requireRole(["admin", "superadmin"]), BallotHistoryController.getElectionSummary);

// Get election results with winners/losers
router.get("/elections/:electionId/results", authenticate, requireRole(["admin", "superadmin"]), BallotHistoryController.getElectionResults);

// Get voters who participated
router.get("/elections/:electionId/voters", authenticate, requireRole(["admin", "superadmin"]), BallotHistoryController.getElectionVoters);

// Get department statistics
router.get("/elections/:electionId/departments", authenticate, requireRole(["admin", "superadmin"]), BallotHistoryController.getDepartmentStats);

// Get course statistics
router.get("/elections/:electionId/courses", authenticate, requireRole(["admin", "superadmin"]), BallotHistoryController.getCourseStats);

// Get voting timeline
router.get("/elections/:electionId/timeline", authenticate, requireRole(["admin", "superadmin"]), BallotHistoryController.getVotingTimeline);

// Get position analytics
router.get("/elections/:electionId/analytics/positions", authenticate, requireRole(["admin", "superadmin"]), BallotHistoryController.getPositionAnalytics);

// Get vote distribution
router.get("/elections/:electionId/analytics/distribution", authenticate, requireRole(["admin", "superadmin"]), BallotHistoryController.getVoteDistribution);

export default router; 