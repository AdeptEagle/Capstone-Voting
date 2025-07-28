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

// Get course by ID
router.get('/:id', CourseController.getById);

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

// Get voter groups in a course
router.get('/:id/voter-groups', CourseController.getVoterGroups);

export default router; 