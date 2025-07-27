import express from "express";
import { VoterController } from "../controllers/VoterController.js";

const router = express.Router();

// Get all voters
router.get("/", VoterController.getAllVoters);

// Get voter by ID
router.get("/:id", VoterController.getVoterById);

// Create new voter
router.post("/", VoterController.createVoter);

// Update voter
router.put("/:id", VoterController.updateVoter);

// Delete voter
router.delete("/:id", VoterController.deleteVoter);

export default router; 