import express from "express";
import { authenticate } from "../middleware/auth.js";
import { CandidateController } from "../controllers/CandidateController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all candidates
router.get("/", CandidateController.getAllCandidates);

// Get candidate by ID
router.get("/:id", CandidateController.getCandidateById);

// Create new candidate (with file upload)
router.post("/", upload.single('photo'), CandidateController.createCandidate);

// Update candidate (with optional file upload)
router.put("/:id", upload.single('photo'), CandidateController.updateCandidate);

// Delete candidate
router.delete("/:id", CandidateController.deleteCandidate);

// Delete multiple candidates
router.delete("/", CandidateController.deleteMultipleCandidates);

export default router; 