import express from "express";
import { ElectionController } from "../controllers/ElectionController.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Get all elections
router.get("/", ElectionController.getAllElections);

// Get active election (MUST come before /:id route)
router.get("/active", ElectionController.getActiveElection);

// Get election by ID
router.get("/:id", ElectionController.getElectionById);

// Get election positions
router.get("/:id/positions", ElectionController.getElectionPositions);

// Create new election (requires authentication)
router.post("/", authenticate, requireRole(["admin", "superadmin"]), ElectionController.createElection);

// Update election (requires authentication)
router.put("/:id", authenticate, requireRole(["admin", "superadmin"]), ElectionController.updateElection);

// Delete election (requires authentication)
router.delete("/:id", authenticate, requireRole(["admin", "superadmin"]), ElectionController.deleteElection);

export default router; 