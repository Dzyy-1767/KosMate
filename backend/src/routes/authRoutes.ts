import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const authRoutes = Router();

authRoutes.post('/register', AuthController.register);
authRoutes.post('/login', AuthController.login);
authRoutes.get('/profile', authMiddleware, AuthController.getProfile);
authRoutes.put('/profile', authMiddleware, AuthController.updateProfile);
