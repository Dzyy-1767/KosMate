import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const transactionRoutes = Router();

transactionRoutes.use(authMiddleware);

transactionRoutes.get('/', TransactionController.getAll);
transactionRoutes.get('/:id', TransactionController.getById);
transactionRoutes.post('/', TransactionController.create);
transactionRoutes.put('/:id', TransactionController.update);
transactionRoutes.delete('/:id', TransactionController.delete);
