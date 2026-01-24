import express from 'express';
import { register, login } from '../controllers/authController.js';
import {
  getProjects,
  getProject,
  createNewProject,
  updateProjectHandler,
  deleteProjectHandler
} from '../controllers/projectController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Protected routes
router.get('/projects', authMiddleware, getProjects);
router.get('/projects/:id', authMiddleware, getProject);
router.post('/projects', authMiddleware, createNewProject);
router.put('/projects/:id', authMiddleware, updateProjectHandler);
router.delete('/projects/:id', authMiddleware, deleteProjectHandler);

export default router;
