import express from 'express';
import DepartmentController from '../controllers/DepartmentController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Simple test route to verify no auth is required
router.get('/test', (req, res) => {
  res.json({ message: 'Test route works without auth', timestamp: new Date().toISOString() });
});

// Get departments with their courses (public - using specific path to avoid conflicts)
router.get('/all-with-courses', DepartmentController.getAllWithCourses);

// Public routes (no authentication required)
router.get('/', DepartmentController.getAll);

// Get courses in a department (public - needed for user registration and candidate creation)
router.get('/:id/courses', DepartmentController.getCourses);

// Protected routes (require authentication)
router.use(authenticate);
router.use(requireRole(['admin', 'superadmin']));

// Get department by ID
router.get('/:id', DepartmentController.getById);

// Create a new department
router.post('/', DepartmentController.create);

// Update a department
router.put('/:id', DepartmentController.update);

// Delete a department
router.delete('/:id', DepartmentController.delete);

// Get voters in a department
router.get('/:id/voters', DepartmentController.getVoters);

// Get candidates in a department
router.get('/:id/candidates', DepartmentController.getCandidates);

export default router; 