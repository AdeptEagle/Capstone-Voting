import express from "express";
import { AuthController } from "../controllers/AuthController.js";

const router = express.Router();

// Admin login
router.post("/admin/login", AuthController.adminLogin);

// User registration
router.post("/user/register", AuthController.userRegister);

// User login
router.post("/user/login", AuthController.userLogin);

export default router; 