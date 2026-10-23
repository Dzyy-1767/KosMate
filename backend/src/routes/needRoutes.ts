import { Router } from 'express';
import { NeedController } from '../controllers/needController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const needRoutes = Router();

needRoutes.use(authMiddleware);

needRoutes.get('/', NeedController.getAll);
needRoutes.get('/:id', NeedController.getById);
needRoutes.post('/', NeedController.create);
needRoutes.patch('/:id/toggle', NeedController.toggleStatus);
needRoutes.put('/:id', NeedController.update);
needRoutes.delete('/:id', NeedController.delete);
