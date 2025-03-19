import express from 'express';
import { 
  getAllCertifications, 
  getCertificationById, 
  createCertification, 
  updateCertification, 
  deleteCertification,
  enrollInCertification,
  getEnrolledCertifications
} from '../controllers/certification.controller.js';
import { protectRoute, protectAdminRoutes } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllCertifications);
router.get('/:id', getCertificationById);

// Protected routes (requires authentication)
router.post('/:id/enroll', protectRoute, enrollInCertification);
router.get('/user/enrolled', protectRoute, getEnrolledCertifications);

// Admin routes
router.post('/', protectRoute, protectAdminRoutes, createCertification);
router.put('/:id', protectRoute, protectAdminRoutes, updateCertification);
router.delete('/:id', protectRoute, protectAdminRoutes, deleteCertification);

export default router;