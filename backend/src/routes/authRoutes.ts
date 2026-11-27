import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const authRoutes = Router();

authRoutes.get('/profile', authMiddleware, AuthController.getProfile);
authRoutes.put('/profile', authMiddleware, AuthController.updateProfile);
