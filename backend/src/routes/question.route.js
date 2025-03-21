import express from 'express';
import { 
  getAllQuestions, 
  getQuestionById, 
  getQuestionsByModule,
  createQuestion, 
  updateQuestion, 
  deleteQuestion,
  getQuestionsForTest
} from '../controllers/question.controller.js';
import { protectRoute, protectAdminRoutes } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected routes (requires authentication)
router.get('/test', protectRoute, getQuestionsForTest); // Moved up
router.get('/module/:moduleId', protectRoute, getQuestionsByModule);

// Admin routes
router.get('/', protectRoute, protectAdminRoutes, getAllQuestions);
router.get('/:id', protectRoute, protectAdminRoutes, getQuestionById); // Moved down
router.post('/', protectRoute, protectAdminRoutes, createQuestion);
router.put('/:id', protectRoute, protectAdminRoutes, updateQuestion);
router.delete('/:id', protectRoute, protectAdminRoutes, deleteQuestion);

export default router;