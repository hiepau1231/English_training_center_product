import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/database';
import classScheduleRoutes from './routes/classScheduleRoutes';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database connection
AppDataSource.initialize()
    .then(() => {
        console.log('Database connection initialized');
    })
    .catch((error) => {
        console.error('Error initializing database connection:', error);
    });

// Routes
app.use('/api/classes', classScheduleRoutes);

// Handle undefined routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use(errorHandler);

export default app;