import express from "express";
import { ElectionController } from "../controllers/ElectionController.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Get all elections
router.get("/", ElectionController.getAllElections);

// Get active election (MUST come before /:id route)
router.get("/active", ElectionController.getActiveElection);

// Get current election (includes paused/stopped elections for admin monitoring)
router.get("/current", ElectionController.getCurrentElection);

// Get election history
router.get("/history", ElectionController.getElectionHistory);

// Get real-time stats
router.get("/stats/realtime", ElectionController.getRealTimeStats);

// Get active election results
router.get("/active/results", ElectionController.getActiveElectionResults);

// Get election by ID
router.get("/:id", ElectionController.getElectionById);

// Get election positions
router.get("/:id/positions", ElectionController.getElectionPositions);

// Create new election (requires authentication)
router.post("/", authenticate, requireRole(["admin", "superadmin"]), ElectionController.createElection);

// Update election (requires authentication)
router.put("/:id", authenticate, requireRole(["admin", "superadmin"]), ElectionController.updateElection);

// Start election (requires authentication)
router.post("/:id/start", authenticate, requireRole(["admin", "superadmin"]), ElectionController.startElection);

// Pause election (requires authentication)
router.post("/:id/pause", authenticate, requireRole(["admin", "superadmin"]), ElectionController.pauseElection);

// Stop election (requires authentication)
router.post("/:id/stop", authenticate, requireRole(["admin", "superadmin"]), ElectionController.stopElection);

// Resume election (requires authentication)
router.post("/:id/resume", authenticate, requireRole(["admin", "superadmin"]), ElectionController.resumeElection);

// End election (requires authentication)
router.post("/:id/end", authenticate, requireRole(["admin", "superadmin"]), ElectionController.endElection);

// Delete election (requires authentication)
router.delete("/:id", authenticate, requireRole(["admin", "superadmin"]), ElectionController.deleteElection);

export default router; 