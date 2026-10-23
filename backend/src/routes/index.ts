import { Router } from 'express';
import { authRoutes } from './authRoutes.js';
import { transactionRoutes } from './transactionRoutes.js';
import { needRoutes } from './needRoutes.js';
import { summaryRoutes } from './summaryRoutes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/transactions', transactionRoutes);
apiRouter.use('/needs', needRoutes);
apiRouter.use('/summary', summaryRoutes);

// Health Check
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KosMate Backend API',
    timestamp: new Date().toISOString(),
  });
});
