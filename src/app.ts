import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import classScheduleRoutes from './routes/classScheduleRoutes';
import roomRoutes from './routes/roomRoutes';
import importRoutes from './routes/import.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/class-schedules', classScheduleRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/import', importRoutes);

export default app; 