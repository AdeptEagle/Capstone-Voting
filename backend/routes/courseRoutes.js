import express from 'express';
import CourseController from '../controllers/CourseController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', CourseController.getAll);
router.get('/department/:departmentId', CourseController.getByDepartment);

// Protected routes (require authentication)
router.use(authenticate);
router.use(requireRole(['admin', 'superadmin']));

// Create a new course
router.post('/', CourseController.create);

// Update a course
router.put('/:id', CourseController.update);

// Delete a course
router.delete('/:id', CourseController.delete);

// Get voters in a course
router.get('/:id/voters', CourseController.getVoters);

// Get candidates in a course
router.get('/:id/candidates', CourseController.getCandidates);

// Get course by ID (must come last to avoid conflicts with other routes)
router.get('/:id', CourseController.getById);

export default router; 