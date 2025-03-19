import express from 'express';
import { 
  getAllModules, 
  getModuleById, 
  getModulesByCertification,
  createModule, 
  updateModule, 
  deleteModule 
} from '../controllers/module.controller.js';
import { protectRoute, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllModules);
router.get('/:id', getModuleById);
router.get('/certification/:certificationId', getModulesByCertification);

// Admin routes
router.post('/', protectRoute, admin, createModule);
router.put('/:id', protectRoute, admin, updateModule);
router.delete('/:id', protectRoute, admin, deleteModule);

export default router;