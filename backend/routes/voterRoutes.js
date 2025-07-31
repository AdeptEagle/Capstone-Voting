import express from "express";
import { VoterController } from "../controllers/VoterController.js";

const router = express.Router();

// Get all voters
router.get("/", VoterController.getAllVoters);

// Get available voters (not assigned to any department/course)
router.get("/available", VoterController.getAvailableVoters);

// Get voter by ID
router.get("/:id", VoterController.getVoterById);

// Create new voter
router.post("/", VoterController.createVoter);

// Update voter
router.put("/:id", VoterController.updateVoter);

// Delete voter
router.delete("/:id", VoterController.deleteVoter);

// Delete multiple voters
router.delete("/", VoterController.deleteMultipleVoters);

export default router; 