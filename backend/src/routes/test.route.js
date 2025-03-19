import express from 'express';
import { 
  getUserTestAttempts, 
  getTestAttemptById, 
  createTestAttempt,
  getUserTestStats
} from '../controllers/test.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.get('/attempts', protectRoute, getUserTestAttempts);
router.get('/attempts/:id', protectRoute, getTestAttemptById);
router.post('/attempts', protectRoute, createTestAttempt);
router.get('/stats', protectRoute, getUserTestStats);

export default router;