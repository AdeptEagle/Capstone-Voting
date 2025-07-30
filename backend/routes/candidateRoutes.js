import express from "express";
import { authenticate } from "../middleware/auth.js";
import { CandidateController } from "../controllers/CandidateController.js";
import { upload, handleBase64Image } from "../middleware/upload.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all candidates
router.get("/", CandidateController.getAllCandidates);

// Get candidate by ID
router.get("/:id", CandidateController.getCandidateById);

// Create new candidate (with base64 image handling)
router.post("/", handleBase64Image, CandidateController.createCandidate);

// Update candidate (with base64 image handling)
router.put("/:id", handleBase64Image, CandidateController.updateCandidate);

// Delete candidate
router.delete("/:id", CandidateController.deleteCandidate);

export default router; 