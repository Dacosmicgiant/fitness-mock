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
import { protectRoute, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin routes
router.get('/', protectRoute, admin, getAllQuestions);
router.get('/:id', protectRoute, admin, getQuestionById);
router.post('/', protectRoute, admin, createQuestion);
router.put('/:id', protectRoute, admin, updateQuestion);
router.delete('/:id', protectRoute, admin, deleteQuestion);

// protected routes (requires authentication)
router.get('/module/:moduleId', protectRoute, getQuestionsByModule);
router.get('/test', protectRoute, getQuestionsForTest);

export default router;