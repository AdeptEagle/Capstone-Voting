import express from "express";
import { authenticate } from "../middleware/auth.js";
import { PositionController } from "../controllers/PositionController.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get positions (filtered by role - users see active election only, admins see all)
router.get("/", PositionController.getAllPositions);

// Get position by ID
router.get("/:id", PositionController.getPositionById);

// Create new position
router.post("/", PositionController.createPosition);

// Update position
router.put("/:id", PositionController.updatePosition);

// Delete position
router.delete("/:id", PositionController.deletePosition);

// Delete multiple positions
router.delete("/", PositionController.deleteMultiplePositions);

export default router; 