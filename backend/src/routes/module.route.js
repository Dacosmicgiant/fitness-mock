import express from 'express';
import { 
  getAllModules, 
  getModuleById, 
  getModulesByCertification,
  createModule, 
  updateModule, 
  deleteModule 
} from '../controllers/module.controller.js';
import { protectRoute, protectAdminRoutes } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllModules);
router.get('/:id', getModuleById);
router.get('/certification/:certificationId', getModulesByCertification);

// Admin routes
router.post('/', protectRoute, protectAdminRoutes, createModule);
router.put('/:id', protectRoute, protectAdminRoutes, updateModule);
router.delete('/:id', protectRoute, protectAdminRoutes, deleteModule);

export default router;