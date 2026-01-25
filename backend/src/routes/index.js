import express from 'express';
import { register, login } from '../controllers/authController.js';
import {
  getProjects,
  getProject,
  createNewProject,
  updateProjectHandler,
  deleteProjectHandler
} from '../controllers/projectController.js';
import {
  getNotes,
  getNote,
  createNewNote,
  updateNoteHandler,
  deleteNoteHandler,
  moveNoteHandler,
  reorderNoteHandler
} from '../controllers/noteController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Protected routes - Projects
router.get('/projects', authMiddleware, getProjects);
router.get('/projects/:id', authMiddleware, getProject);
router.post('/projects', authMiddleware, createNewProject);
router.put('/projects/:id', authMiddleware, updateProjectHandler);
router.delete('/projects/:id', authMiddleware, deleteProjectHandler);

// Protected routes - Notes
router.get('/projects/:projectId/notes', authMiddleware, getNotes);
router.get('/projects/:projectId/notes/:noteId', authMiddleware, getNote);
router.post('/projects/:projectId/notes', authMiddleware, createNewNote);
router.put('/projects/:projectId/notes/:noteId', authMiddleware, updateNoteHandler);
router.delete('/projects/:projectId/notes/:noteId', authMiddleware, deleteNoteHandler);
router.patch('/projects/:projectId/notes/:noteId/move', authMiddleware, moveNoteHandler);
router.patch('/projects/:projectId/notes/:noteId/reorder', authMiddleware, reorderNoteHandler);

export default router;
