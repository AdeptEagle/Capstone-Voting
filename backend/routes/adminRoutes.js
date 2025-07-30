import express from "express";
import { AdminController } from "../controllers/AdminController.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Special route to create default superadmin (no auth required)
router.post("/create-default-superadmin", AdminController.createDefaultSuperadmin);

// All other admin management routes require superadmin role
router.use(authenticate, requireRole("superadmin"));

// Get all admins
router.get("/", AdminController.getAllAdmins);

// Get admin by ID
router.get("/:id", AdminController.getAdminById);

// Create new admin
router.post("/", AdminController.createAdmin);

// Update admin
router.put("/:id", AdminController.updateAdmin);

// Delete admin
router.delete("/:id", AdminController.deleteAdmin);

export default router; 