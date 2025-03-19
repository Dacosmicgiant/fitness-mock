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

// Admin routes
router.get('/', protectRoute, protectAdminRoutes, getAllQuestions);
router.get('/:id', protectRoute, protectAdminRoutes, getQuestionById);
router.post('/', protectRoute, protectAdminRoutes, createQuestion);
router.put('/:id', protectRoute, protectAdminRoutes, updateQuestion);
router.delete('/:id', protectRoute, protectAdminRoutes, deleteQuestion);

// protected routes (requires authentication)
router.get('/module/:moduleId', protectRoute, getQuestionsByModule);
router.get('/test', protectRoute, getQuestionsForTest);

export default router;