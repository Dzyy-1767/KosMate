import { Router } from 'express';
import { SummaryController } from '../controllers/summaryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const summaryRoutes = Router();

summaryRoutes.use(authMiddleware);

summaryRoutes.get('/dashboard', SummaryController.getDashboardStats);
