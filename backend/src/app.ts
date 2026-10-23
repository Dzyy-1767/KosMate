import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp(): Application {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root endpoint
  app.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'Selamat datang di KosMate REST API Service 🚀',
      version: '1.0.0',
      docs: '/api/v1/health',
    });
  });

  // Mount API Router
  app.use('/api/v1', apiRouter);

  // 404 Route Not Found
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Rute '${req.originalUrl}' tidak ditemukan pada server`,
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
